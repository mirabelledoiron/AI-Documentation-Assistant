package api

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/yourname/ai-documentation-assistant/internal/models"
)

type anthropicMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type anthropicRequest struct {
	Model     string             `json:"model"`
	MaxTokens int                `json:"max_tokens"`
	Messages  []anthropicMessage `json:"messages"`
	System    string             `json:"system,omitempty"`
}

type anthropicResponse struct {
	Content []struct {
		Type string `json:"type"`
		Text string `json:"text"`
	} `json:"content"`
}

func anthropicChat(ctx context.Context, apiKey string, messages []models.Message) (string, error) {
	apiKey = strings.TrimSpace(apiKey)
	if apiKey == "" {
		return "", fmt.Errorf("Anthropic API key is not configured")
	}

	// Anthropic uses a separate `system` field; keep only the last system message.
	system := ""
	anthropicMessages := make([]anthropicMessage, 0, len(messages))
	for _, m := range messages {
		role := strings.ToLower(strings.TrimSpace(m.Role))
		switch role {
		case "system":
			system = m.Content
		case "user", "assistant":
			anthropicMessages = append(anthropicMessages, anthropicMessage{Role: role, Content: m.Content})
		default:
			// ignore unknown roles
		}
	}

	reqBody := anthropicRequest{
		Model:     "claude-3-5-sonnet-20240620",
		MaxTokens: 1000,
		Messages:  anthropicMessages,
		System:    system,
	}

	payload, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://api.anthropic.com/v1/messages", bytes.NewReader(payload))
	if err != nil {
		return "", err
	}
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("x-api-key", apiKey)
	httpReq.Header.Set("anthropic-version", "2023-06-01")

	client := &http.Client{Timeout: 60 * time.Second}
	res, err := client.Do(httpReq)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return "", fmt.Errorf("anthropic request failed with status %d", res.StatusCode)
	}

	var parsed anthropicResponse
	if err := json.NewDecoder(res.Body).Decode(&parsed); err != nil {
		return "", err
	}

	var out bytes.Buffer
	for _, c := range parsed.Content {
		if c.Type == "text" {
			out.WriteString(c.Text)
		}
	}
	return out.String(), nil
}
