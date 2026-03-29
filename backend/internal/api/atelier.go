package api

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sashabaranov/go-openai"
	"github.com/yourname/ai-documentation-assistant/internal/models"
	"github.com/yourname/ai-documentation-assistant/internal/services"
)

type atelierSyncRequest struct {
	Ref   string `json:"ref"`
	Limit int    `json:"limit"`
}

func atelierSyncHandler(c *gin.Context) {
	st := getState()
	if st == nil || st.cfg == nil || st.db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server not initialized"})
		return
	}
	if st.cfg.Environment == "production" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Atelier sync is disabled in production"})
		return
	}

	// Need an OpenAI key to generate embeddings.
	rp := getRequestProviderHeaders(c.GetHeader)
	openAIKey := strings.TrimSpace(st.cfg.OpenAI.APIKey)
	if rp.OpenAIKey != "" {
		openAIKey = rp.OpenAIKey
	}
	if openAIKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "OpenAI API key is not configured"})
		return
	}

	var req atelierSyncRequest
	_ = c.ShouldBindJSON(&req)
	ref := strings.TrimSpace(req.Ref)
	limit := req.Limit
	if limit <= 0 || limit > 1000 {
		limit = 200
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Minute)
	defer cancel()

	docs, stats, err := services.ImportAtelierStorybookZip(ctx, services.AtelierImportOptions{
		Owner:        st.cfg.Seed.GitHubOwner,
		Repo:         st.cfg.Seed.GitHubRepo,
		Ref:          ref,
		Limit:        limit,
		MaxFileBytes: 250 * 1024,
	})
	if err != nil {
		respondServiceError(c, http.StatusBadGateway, "Failed to download or parse Atelier Storybook", err)
		return
	}

	client := openai.NewClient(openAIKey)
	model := parseEmbeddingModel(st.cfg.OpenAI.EmbeddingModel)

	upserted := 0
	embedded := 0
	skipped := 0

	for _, d := range docs {
		content := strings.TrimSpace(d.Content)
		if content == "" {
			skipped++
			continue
		}
		// Keep embedding input bounded.
		if len(content) > 12000 {
			content = content[:12000]
		}

		var doc models.Document
		err := st.db.Where("url = ?", d.URL).First(&doc).Error
		if err != nil {
			// create new
			doc = models.Document{
				Title:    d.Title,
				Content:  d.Content,
				URL:      d.URL,
				Category: d.Category,
				Tags:     d.Tags,
			}
			if err := st.db.Create(&doc).Error; err != nil {
				skipped++
				continue
			}
			upserted++
		} else {
			// update existing
			doc.Title = d.Title
			doc.Content = d.Content
			doc.Category = d.Category
			doc.Tags = d.Tags
			if err := st.db.Save(&doc).Error; err != nil {
				skipped++
				continue
			}
			upserted++
		}

		embResp, err := client.CreateEmbeddings(ctx, openai.EmbeddingRequest{
			Input: content,
			Model: model,
		})
		if err != nil || len(embResp.Data) == 0 {
			skipped++
			continue
		}

		// Ensure one embedding per document.
		_ = st.db.Where("document_id = ?", doc.ID).Delete(&models.Embedding{}).Error
		if err := st.db.Create(&models.Embedding{
			DocumentID: doc.ID,
			Vector:     embResp.Data[0].Embedding,
		}).Error; err != nil {
			skipped++
			continue
		}
		embedded++
	}

	c.JSON(http.StatusOK, gin.H{
		"repo":     st.cfg.Seed.GitHubOwner + "/" + st.cfg.Seed.GitHubRepo,
		"ref":      ref,
		"limit":    limit,
		"stats":    stats,
		"upserted": upserted,
		"embedded": embedded,
		"skipped":  skipped,
	})
}
