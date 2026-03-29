package api

import (
	"github.com/gin-gonic/gin"
	"github.com/yourname/ai-documentation-assistant/internal/config"
	"gorm.io/gorm"
)

type Server struct {
	config *config.Config
	db     *gorm.DB
	router *gin.Engine
}

func NewServer(cfg *config.Config, db *gorm.DB) *Server {
	r := gin.Default()

	// Middleware
	r.Use(CORS(cfg.CorsOrigins))
	r.Use(Logger())

	server := &Server{
		config: cfg,
		db:     db,
		router: r,
	}

	// Setup routes
	server.setupRoutes()

	return server
}

func (s *Server) Start() error {
	return s.router.Run(":" + s.config.ServerPort)
}
