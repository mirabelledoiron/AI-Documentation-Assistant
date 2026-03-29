// backend/internal/services/embeddings.go
package services

import (
	"context"
	"strings"

	"github.com/sashabaranov/go-openai"
)

type EmbeddingService struct {
	client         *openai.Client
	embeddingModel openai.EmbeddingModel
}

func NewEmbeddingService(apiKey string, embeddingModel string) *EmbeddingService {
	model := parseEmbeddingModel(embeddingModel)
	return &EmbeddingService{
		client:         openai.NewClient(apiKey),
		embeddingModel: model,
	}
}

func parseEmbeddingModel(model string) openai.EmbeddingModel {
	// go-openai@v1.17.9 uses an enum for embedding models.
	// Convert from an env/config string via UnmarshalText.
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

func (s *EmbeddingService) GetEmbedding(text string) ([]float32, error) {
	resp, err := s.client.CreateEmbeddings(context.Background(), openai.EmbeddingRequest{
		Input: text,
		Model: s.embeddingModel,
	})
	if err != nil {
		return nil, err
	}

	return resp.Data[0].Embedding, nil
}

func (s *EmbeddingService) GetEmbeddings(texts []string) ([][]float32, error) {
	embeddings := make([][]float32, len(texts))
	for i, text := range texts {
		embedding, err := s.GetEmbedding(text)
		if err != nil {
			return nil, err
		}
		embeddings[i] = embedding
	}
	return embeddings, nil
}
