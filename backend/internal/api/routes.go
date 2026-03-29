package api

import (
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	st := getState()
	_ = st // st is accessed indirectly by handlers; keep this for future auth wiring

	// Health check
	router.GET("/health", healthCheckHandler)

	// API routes (matches your local dev guide)
	api := router.Group("/api")
	{
		api.GET("/health", healthCheckHandler)

		api.POST("/search", searchHandler)
		api.POST("/chat", chatHandler)
		api.POST("/chat/stream", chatStreamHandler)

		// NOTE: No auth flow is implemented yet (no login/token issuance).
		// Keep these public for now so local dev works end-to-end.
		api.GET("/documents", listDocumentsHandler)
		api.POST("/documents", createDocumentHandler)
		api.DELETE("/documents/:id", deleteDocumentHandler)

		api.GET("/analytics/popular", popularQueriesHandler)
	}

	// Back-compat (older frontend/docker compose)
	v1 := router.Group("/api/v1")
	{
		v1.POST("/search", searchHandler)
		v1.POST("/chat", chatHandler)
		v1.POST("/chat/stream", chatStreamHandler)
		v1.GET("/documents", listDocumentsHandler)
		v1.POST("/documents", createDocumentHandler)
		v1.DELETE("/documents/:id", deleteDocumentHandler)
		v1.GET("/analytics/popular", popularQueriesHandler)
	}
}
