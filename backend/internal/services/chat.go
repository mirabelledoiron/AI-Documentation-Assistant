// backend/internal/services/chat.go
package services

import (
	"context"
	"fmt"
	"strings"

	"github.com/sashabaranov/go-openai"
)

type ChatService struct {
	client *openai.Client
}

func NewChatService(apiKey string) *ChatService {
	return &ChatService{
		client: openai.NewClient(apiKey),
	}
}

func (s *ChatService) GenerateResponse(messages []openai.ChatCompletionMessage) (string, error) {
	resp, err := s.client.CreateChatCompletion(context.Background(), openai.ChatCompletionRequest{
		Model:       openai.GPT3Dot5Turbo,
		Messages:    messages,
		Temperature: 0.7,
		MaxTokens:   1000,
	})
	if err != nil {
		return "", err
	}

	return resp.Choices[0].Message.Content, nil
}

func (s *ChatService) StreamResponse(messages []openai.ChatCompletionMessage, stream chan string) error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	openaiStream, err := s.client.CreateChatCompletionStream(ctx, openai.ChatCompletionRequest{
		Model:       openai.GPT3Dot5Turbo,
		Messages:    messages,
		Temperature: 0.7,
		MaxTokens:   1000,
		Stream:      true,
	})
	if err != nil {
		return err
	}
	defer openaiStream.Close()

	for {
		response, err := openaiStream.Recv()
		if err != nil {
			close(stream)
			return err
		}

		if len(response.Choices) > 0 && response.Choices[0].Delta.Content != "" {
			stream <- response.Choices[0].Delta.Content
		}
	}
}

func FormatContextForLLM(results []map[string]interface{}) string {
	var context strings.Builder
	context.WriteString("Relevant documentation:\n\n")
	
	for i, result := range results {
		content := result["content"].(string)
		if len(content) > 300 {
			content = content[:300] + "..."
		}
		
		context.WriteString(fmt.Sprintf("Document %d: %s\n%s\n\n", 
			i+1, 
			result["title"].(string), 
			content))
	}
	
	return context.String()
}
