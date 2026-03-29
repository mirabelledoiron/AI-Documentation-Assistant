// backend/cmd/server/main.go (CORRECTED)
package main

import (
	"context"
	"log"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/yourname/ai-documentation-assistant/internal/api"
	"github.com/yourname/ai-documentation-assistant/internal/config"
	"github.com/yourname/ai-documentation-assistant/internal/database"
	"github.com/yourname/ai-documentation-assistant/internal/services"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	cfg := config.Load()

	// Initialize database
	db, err := database.New(cfg.Database.URL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	// Close underlying SQL connection pool on shutdown
	if sqlDB, err := db.DB.DB(); err == nil {
		defer sqlDB.Close()
	}

	// Wire deps into the api package
	api.Init(cfg, db.DB)

	// Setup Gin router
	router := setupRouter(cfg)

	// Setup API routes
	api.SetupRoutes(router)

	// Dev-only: seed the knowledge base from a configured GitHub repo on start.
	// Runs in the background and skips if already seeded.
	if cfg.Environment != "production" && cfg.Seed.AutoSeedOnStart {
		openAIKey := strings.TrimSpace(cfg.OpenAI.APIKey)
		if openAIKey != "" {
			go func() {
				ctx, cancel := context.WithTimeout(context.Background(), 3*time.Minute)
				defer cancel()

				res, err := services.SeedGitHubRepo(
					ctx,
					db.DB,
					openAIKey,
					cfg.OpenAI.EmbeddingModel,
					cfg.Seed.GitHubOwner,
					cfg.Seed.GitHubRepo,
					cfg.Seed.DefaultRef,
					cfg.Seed.DefaultLimit,
				)
				if err != nil {
					log.Printf("Atelier seed failed: %v", err)
					return
				}
				if res.AlreadySeeded {
					log.Printf("Seed skipped (already seeded)")
					return
				}
				log.Printf("Seed complete: imported=%d upserted=%d embedded=%d skipped=%d", res.Imported, res.Upserted, res.Embedded, res.Skipped)
			}()
		} else {
			log.Printf("Seed skipped (OPENAI_API_KEY not set)")
		}
	}

	// Start server
	log.Printf("Starting server on port %s", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func setupRouter(cfg *config.Config) *gin.Engine {
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()

	// Middleware
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(api.CorsMiddleware(cfg.Security.CORS))

	return router
}
