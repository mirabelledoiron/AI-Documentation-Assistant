package api

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sashabaranov/go-openai"
	"github.com/yourname/ai-documentation-assistant/internal/models"
)

func healthCheckHandler(c *gin.Context) {
	st := getState()
	env := ""
	if st != nil && st.cfg != nil {
		env = st.cfg.Environment
	}
	c.JSON(http.StatusOK, gin.H{
		"status":      "healthy",
		"timestamp":   time.Now().Unix(),
		"environment": env,
	})
}

func searchHandler(c *gin.Context) {
	st := getState()
	if st == nil || st.cfg == nil || st.db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server not initialized"})
		return
	}

	var req models.SearchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request", "details": err.Error()})
		return
	}

	// Get embeddings for the query
	client := openai.NewClient(st.cfg.OpenAI.APIKey)
	embeddingResp, err := client.CreateEmbeddings(context.Background(), openai.EmbeddingRequest{
		Input: req.Query,
		Model: openai.AdaEmbeddingV2,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process query"})
		return
	}

	queryEmbedding := embeddingResp.Data[0].Embedding

	// Search with pgvector
	type row struct {
		models.Document
		Score float64 `gorm:"column:score" json:"score"`
	}
	var rows []row
	err = st.db.Raw(`
		SELECT d.*, e.vector <=> ? AS score
		FROM documents d
		JOIN embeddings e ON d.id = e.document_id
		ORDER BY e.vector <=> ?
		LIMIT ?
	`, queryEmbedding, queryEmbedding, req.Limit).Scan(&rows).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Search failed"})
		return
	}

	results := make([]models.SearchResult, 0, len(rows))
	for _, r := range rows {
		results = append(results, models.SearchResult{
			Document: r.Document,
			Score:    r.Score,
		})
	}

	// Log the query for analytics
	st.db.Create(&models.UserQuery{
		Query:    req.Query,
		Response: fmt.Sprintf("Found %d results", len(results)),
		Sources:  extractSourceURLs(results),
	})

	c.JSON(http.StatusOK, gin.H{
		"results": results,
		"query":   req.Query,
		"count":   len(results),
	})
}

func chatHandler(c *gin.Context) {
	st := getState()
	if st == nil || st.cfg == nil || st.db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server not initialized"})
		return
	}

	var req models.ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Search for relevant context first
	var searchResults []models.SearchResult
	if len(req.Messages) > 0 {
		lastMessage := req.Messages[len(req.Messages)-1].Content
		results, err := performSearch(lastMessage, 3)
		if err == nil && len(results) > 0 {
			searchResults = results
			// Add context to messages
			context := formatSearchContext(searchResults)
			req.Messages = append([]models.Message{{
				Role:    "system",
				Content: fmt.Sprintf("Context from documentation: %s", context),
			}}, req.Messages...)
		}
	}

	client := openai.NewClient(st.cfg.OpenAI.APIKey)
	resp, err := client.CreateChatCompletion(context.Background(), openai.ChatCompletionRequest{
		Model:       openai.GPT3Dot5Turbo,
		Messages:    convertMessages(req.Messages),
		Temperature: 0.7,
		MaxTokens:   1000,
	})
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Chat service unavailable"})
		return
	}

	response := models.ChatResponse{
		Message: resp.Choices[0].Message.Content,
	}

	// Log for analytics (query = last user message, response = assistant message)
	if len(req.Messages) > 0 {
		last := req.Messages[len(req.Messages)-1].Content
		st.db.Create(&models.UserQuery{
			Query:    last,
			Response: response.Message,
			Sources:  extractSourceURLs(searchResults),
		})
	}

	c.JSON(http.StatusOK, response)
}

func chatStreamHandler(c *gin.Context) {
	st := getState()
	if st == nil || st.cfg == nil || st.db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server not initialized"})
		return
	}

	var req models.ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")

	client := openai.NewClient(st.cfg.OpenAI.APIKey)
	
	// Add search context
	var searchResults []models.SearchResult
	if len(req.Messages) > 0 {
		lastMessage := req.Messages[len(req.Messages)-1].Content
		results, err := performSearch(lastMessage, 3)
		if err == nil && len(results) > 0 {
			searchResults = results
			context := formatSearchContext(searchResults)
			req.Messages = append([]models.Message{{
				Role:    "system",
				Content: fmt.Sprintf("Context from documentation: %s", context),
			}}, req.Messages...)
		}
	}

	stream, err := client.CreateChatCompletionStream(context.Background(), openai.ChatCompletionRequest{
		Model:       openai.GPT3Dot5Turbo,
		Messages:    convertMessages(req.Messages),
		Temperature: 0.7,
		MaxTokens:   1000,
		Stream:      true,
	})
	
	if err != nil {
		c.SSEvent("error", gin.H{"message": err.Error()})
		return
	}
	defer stream.Close()

	var streamed strings.Builder

	for {
		response, err := stream.Recv()
		if err != nil {
			if err.Error() == "EOF" {
				// Let the frontend know we're done.
				c.Writer.WriteString("data: [DONE]\n\n")
				c.Writer.Flush()

				// Log for analytics when stream completes
				if len(req.Messages) > 0 {
					last := req.Messages[len(req.Messages)-1].Content
					st.db.Create(&models.UserQuery{
						Query:    last,
						Response: streamed.String(),
						Sources:  extractSourceURLs(searchResults),
					})
				}
				return
			}
			c.SSEvent("error", gin.H{"message": err.Error()})
			return
		}

		if len(response.Choices) > 0 {
			delta := response.Choices[0].Delta
			if delta.Content != "" {
				// Keep it compatible with our frontend stream parser (expects data: {json}\n\n)
				payload := fmt.Sprintf("{\"content\":%q}", delta.Content)
				c.Writer.WriteString("data: " + payload + "\n\n")
				c.Writer.Flush()
				streamed.WriteString(delta.Content)
			}
		}
	}
}

func listDocumentsHandler(c *gin.Context) {
	st := getState()
	if st == nil || st.db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server not initialized"})
		return
	}
	var documents []models.Document
	var total int64
	
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "10")
	
	// Convert to int
	pageInt := 1
	limitInt := 10
	fmt.Sscanf(page, "%d", &pageInt)
	fmt.Sscanf(limit, "%d", &limitInt)
	
	offset := (pageInt - 1) * limitInt
	
	st.db.Model(&models.Document{}).Count(&total)
	st.db.Offset(offset).Limit(limitInt).Find(&documents)
	
	c.JSON(http.StatusOK, models.DocumentListResponse{
		Documents: documents,
		Total:     total,
		Page:      pageInt,
		Limit:     limitInt,
	})
}

func createDocumentHandler(c *gin.Context) {
	st := getState()
	if st == nil || st.cfg == nil || st.db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server not initialized"})
		return
	}
	var doc models.Document
	if err := c.ShouldBindJSON(&doc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid document data"})
		return
	}

	// Generate embedding
	client := openai.NewClient(st.cfg.OpenAI.APIKey)
	embeddingResp, err := client.CreateEmbeddings(context.Background(), openai.EmbeddingRequest{
		Input: doc.Content,
		Model: openai.AdaEmbeddingV2,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate embedding"})
		return
	}

	// Create document and embedding
	if err := st.db.Create(&doc).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create document"})
		return
	}

	embedding := models.Embedding{
		DocumentID: doc.ID,
		Vector:     embeddingResp.Data[0].Embedding,
	}
	
	if err := st.db.Create(&embedding).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create embedding"})
		return
	}

	c.JSON(http.StatusCreated, doc)
}

func deleteDocumentHandler(c *gin.Context) {
	st := getState()
	if st == nil || st.db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server not initialized"})
		return
	}
	id := c.Param("id")
	
	if err := st.db.Delete(&models.Document{}, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Document deleted"})
}

func popularQueriesHandler(c *gin.Context) {
	st := getState()
	if st == nil || st.db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server not initialized"})
		return
	}
	var queries []models.UserQuery
	st.db.Order("created_at DESC").Limit(10).Find(&queries)
	c.JSON(http.StatusOK, gin.H{"queries": queries})
}

func performSearch(query string, limit int) ([]models.SearchResult, error) {
	st := getState()
	if st == nil || st.cfg == nil || st.db == nil {
		return nil, fmt.Errorf("server not initialized")
	}
	client := openai.NewClient(st.cfg.OpenAI.APIKey)
	embeddingResp, err := client.CreateEmbeddings(context.Background(), openai.EmbeddingRequest{
		Input: query,
		Model: openai.AdaEmbeddingV2,
	})
	if err != nil {
		return nil, err
	}

	queryEmbedding := embeddingResp.Data[0].Embedding

	type row struct {
		models.Document
		Score float64 `gorm:"column:score" json:"score"`
	}
	var rows []row
	err = st.db.Raw(`
		SELECT d.*, e.vector <=> ? AS score
		FROM documents d
		JOIN embeddings e ON d.id = e.document_id
		ORDER BY e.vector <=> ?
		LIMIT ?
	`, queryEmbedding, queryEmbedding, limit).Scan(&rows).Error

	if err != nil {
		return nil, err
	}
	results := make([]models.SearchResult, 0, len(rows))
	for _, r := range rows {
		results = append(results, models.SearchResult{
			Document: r.Document,
			Score:    r.Score,
		})
	}
	return results, nil
}

func formatSearchContext(results []models.SearchResult) string {
	var context strings.Builder
	for i, result := range results {
		contentPreview := result.Document.Content
		if len(contentPreview) > 200 {
			contentPreview = contentPreview[:200]
		}
		context.WriteString(fmt.Sprintf("Document %d: %s\n%s\n\n", 
			i+1, result.Document.Title, contentPreview))
	}
	return context.String()
}

func convertMessages(messages []models.Message) []openai.ChatCompletionMessage {
	openaiMessages := make([]openai.ChatCompletionMessage, len(messages))
	for i, msg := range messages {
		openaiMessages[i] = openai.ChatCompletionMessage{
			Role:    msg.Role,
			Content: msg.Content,
		}
	}
	return openaiMessages
}

func extractSourceURLs(results []models.SearchResult) []string {
	urls := make([]string, 0, len(results))
	for _, result := range results {
		if result.Document.URL != "" {
			urls = append(urls, result.Document.URL)
		}
	}
	return urls
}
