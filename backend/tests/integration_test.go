//go:build integration

package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"testing"
)

func TestSearchEndpoint_Integration(t *testing.T) {
	payload := map[string]any{"query": "test document", "limit": 3}
	jsonData, _ := json.Marshal(payload)

	resp, err := http.Post("http://localhost:8080/api/search", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %v", resp.StatusCode)
	}
}

