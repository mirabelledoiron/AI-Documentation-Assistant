package api

import "strings"

type requestProvider struct {
	Provider     string
	OpenAIKey    string
	AnthropicKey string
}

func getRequestProviderHeaders(h func(string) string) requestProvider {
	p := strings.ToLower(strings.TrimSpace(h("X-AI-Provider")))
	if p != "anthropic" {
		p = "openai"
	}
	return requestProvider{
		Provider:     p,
		OpenAIKey:    strings.TrimSpace(h("X-OpenAI-Key")),
		AnthropicKey: strings.TrimSpace(h("X-Anthropic-Key")),
	}
}
