// backend/internal/config/config.go
package config

import (
	"os"
	"strconv"
	"strings"
)

type Config struct {
	Port        string
	Environment string
	Database    DatabaseConfig
	OpenAI      OpenAIConfig
	Seed        SeedConfig
	Security    SecurityConfig
}

type SeedConfig struct {
	GitHubOwner     string
	GitHubRepo      string
	DefaultRef      string
	DefaultLimit    int
	AutoSeedOnStart bool
}

type DatabaseConfig struct {
	URL string
}

type OpenAIConfig struct {
	APIKey         string
	Model          string
	EmbeddingModel string
}

type SecurityConfig struct {
	JWTSecret string
	CORS      []string
}

func Load() *Config {
	cors := getEnv("CORS_ORIGINS", "")
	corsList := getEnvSlice("CORS_ALLOWED_ORIGINS", []string{"*"})
	if cors != "" {
		corsList = strings.Split(cors, ",")
	}
	return &Config{
		Port:        getEnv("PORT", "8080"),
		Environment: getEnv("ENVIRONMENT", "development"),
		Database: DatabaseConfig{
			URL: getEnv("DATABASE_URL", "postgres://user:password@localhost:5432/docs_assistant"),
		},
		OpenAI: OpenAIConfig{
			APIKey: getEnv("OPENAI_API_KEY", ""),
			Model:  getEnv("OPENAI_MODEL", "gpt-4o-mini"),
			// NOTE: github.com/sashabaranov/go-openai@v1.17.9 only supports enumerated embedding models
			// (e.g. text-embedding-ada-002). If you set an unsupported value, the backend will fall back.
			EmbeddingModel: getEnv("OPENAI_EMBEDDING_MODEL", "text-embedding-ada-002"),
		},
		Seed: SeedConfig{
			GitHubOwner:     getEnv("SEED_GITHUB_OWNER", "mirabelledoiron"),
			GitHubRepo:      getEnv("SEED_GITHUB_REPO", "Atelier-Design-System"),
			DefaultRef:      getEnv("SEED_GITHUB_REF", "main"),
			DefaultLimit:    getEnvInt("SEED_GITHUB_LIMIT", 200),
			AutoSeedOnStart: getEnvBool("SEED_AUTO_ON_START", true),
		},
		Security: SecurityConfig{
			JWTSecret: getEnv("JWT_SECRET", "your-secret-key"),
			CORS:      corsList,
		},
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvSlice(key string, defaultValue []string) []string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return strings.Split(value, ",")
}

func getEnvInt(key string, defaultValue int) int {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return defaultValue
	}
	n, err := strconv.Atoi(value)
	if err != nil {
		return defaultValue
	}
	return n
}

func getEnvBool(key string, defaultValue bool) bool {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return defaultValue
	}
	switch strings.ToLower(value) {
	case "1", "true", "yes", "y", "on":
		return true
	case "0", "false", "no", "n", "off":
		return false
	default:
		return defaultValue
	}
}
