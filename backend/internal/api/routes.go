package api

import (
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	st := getState()
	jwtSecret := ""
	if st != nil && st.cfg != nil {
		jwtSecret = st.cfg.Security.JWTSecret
	}

	// Health check
	router.GET("/health", healthCheckHandler)

	// API routes (matches your local dev guide)
	api := router.Group("/api")
	{
		api.GET("/health", healthCheckHandler)

		api.POST("/search", searchHandler)
		api.POST("/chat", chatHandler)
		api.POST("/chat/stream", chatStreamHandler)

		api.GET("/documents", AuthMiddleware(jwtSecret), listDocumentsHandler)
		api.POST("/documents", AuthMiddleware(jwtSecret), createDocumentHandler)
		api.DELETE("/documents/:id", AuthMiddleware(jwtSecret), deleteDocumentHandler)

		api.GET("/analytics/popular", AuthMiddleware(jwtSecret), popularQueriesHandler)
	}

	// Back-compat (older frontend/docker compose)
	v1 := router.Group("/api/v1")
	{
		v1.POST("/search", searchHandler)
		v1.POST("/chat", chatHandler)
		v1.POST("/chat/stream", chatStreamHandler)
		v1.GET("/documents", AuthMiddleware(jwtSecret), listDocumentsHandler)
		v1.POST("/documents", AuthMiddleware(jwtSecret), createDocumentHandler)
		v1.DELETE("/documents/:id", AuthMiddleware(jwtSecret), deleteDocumentHandler)
		v1.GET("/analytics/popular", AuthMiddleware(jwtSecret), popularQueriesHandler)
	}
}
