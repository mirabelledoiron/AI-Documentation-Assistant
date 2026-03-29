// backend/internal/services/embeddings.go
package services

import (
	"context"

	"github.com/sashabaranov/go-openai"
)

type EmbeddingService struct {
	client *openai.Client
}

func NewEmbeddingService(apiKey string) *EmbeddingService {
	return &EmbeddingService{
		client: openai.NewClient(apiKey),
	}
}

func (s *EmbeddingService) GetEmbedding(text string) ([]float32, error) {
	resp, err := s.client.CreateEmbedding(context.Background(), openai.EmbeddingRequest{
		Input: text,
		Model: openai.AdaEmbeddingV2,
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
