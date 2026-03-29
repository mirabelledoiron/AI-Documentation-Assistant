package services

import (
	"context"
	"fmt"
	"strings"

	"github.com/sashabaranov/go-openai"
	"github.com/yourname/ai-documentation-assistant/internal/models"
	"gorm.io/gorm"
)

type AtelierSeedResult struct {
	AlreadySeeded bool
	Imported      int
	Upserted      int
	Embedded      int
	Skipped       int
}

func SeedAtelierStorybook(ctx context.Context, db *gorm.DB, openAIKey string, embeddingModel string, ref string, limit int) (*AtelierSeedResult, error) {
	if db == nil {
		return nil, fmt.Errorf("db is nil")
	}
	if strings.TrimSpace(openAIKey) == "" {
		return nil, fmt.Errorf("OpenAI API key is not configured")
	}
	return SeedGitHubRepo(ctx, db, openAIKey, embeddingModel, "mirabelledoiron", "Atelier-Design-System", ref, limit)
}

func SeedGitHubRepo(ctx context.Context, db *gorm.DB, openAIKey string, embeddingModel string, owner string, repo string, ref string, limit int) (*AtelierSeedResult, error) {
	if strings.TrimSpace(owner) == "" || strings.TrimSpace(repo) == "" {
		return nil, fmt.Errorf("seed repo is not configured")
	}
	// Skip if already seeded (by URL prefix).
	urlPrefix := fmt.Sprintf("https://github.com/%s/%s/blob/%%", owner, repo)
	var existing int64
	if err := db.Model(&models.Document{}).
		Where("url LIKE ?", urlPrefix).
		Count(&existing).Error; err != nil {
		return nil, err
	}
	if existing > 0 {
		return &AtelierSeedResult{AlreadySeeded: true}, nil
	}

	docs, _, err := ImportAtelierStorybookZip(ctx, AtelierImportOptions{
		Owner:        owner,
		Repo:         repo,
		Ref:          ref,
		Limit:        limit,
		MaxFileBytes: 250 * 1024,
	})
	if err != nil {
		return nil, err
	}

	client := openai.NewClient(openAIKey)
	model := parseEmbeddingModelEnum(embeddingModel)

	res := &AtelierSeedResult{Imported: len(docs)}
	for _, d := range docs {
		content := strings.TrimSpace(d.Content)
		if content == "" {
			res.Skipped++
			continue
		}
		if len(content) > 12000 {
			content = content[:12000]
		}

		var doc models.Document
		err := db.Where("url = ?", d.URL).First(&doc).Error
		if err != nil {
			doc = models.Document{
				Title:    d.Title,
				Content:  d.Content,
				URL:      d.URL,
				Category: d.Category,
				Tags:     d.Tags,
			}
			if err := db.Create(&doc).Error; err != nil {
				res.Skipped++
				continue
			}
			res.Upserted++
		} else {
			doc.Title = d.Title
			doc.Content = d.Content
			doc.Category = d.Category
			doc.Tags = d.Tags
			if err := db.Save(&doc).Error; err != nil {
				res.Skipped++
				continue
			}
			res.Upserted++
		}

		embResp, err := client.CreateEmbeddings(ctx, openai.EmbeddingRequest{
			Input: content,
			Model: model,
		})
		if err != nil || len(embResp.Data) == 0 {
			res.Skipped++
			continue
		}

		_ = db.Where("document_id = ?", doc.ID).Delete(&models.Embedding{}).Error
		if err := db.Create(&models.Embedding{DocumentID: doc.ID, Vector: embResp.Data[0].Embedding}).Error; err != nil {
			res.Skipped++
			continue
		}
		res.Embedded++
	}

	return res, nil
}

func parseEmbeddingModelEnum(model string) openai.EmbeddingModel {
	if strings.TrimSpace(model) == "" {
		return openai.AdaEmbeddingV2
	}
	var parsed openai.EmbeddingModel
	_ = parsed.UnmarshalText([]byte(model))
	if parsed == openai.Unknown {
		return openai.AdaEmbeddingV2
	}
	return parsed
}
