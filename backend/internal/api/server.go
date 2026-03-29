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
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(CorsMiddleware(cfg.Security.CORS))

	// Wire deps and register routes (keeps this server usable in tests/alt entrypoints)
	Init(cfg, db)
	SetupRoutes(r)

	return &Server{config: cfg, db: db, router: r}
}

func (s *Server) Start() error {
	return s.router.Run(":" + s.config.Port)
}
