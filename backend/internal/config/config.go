// backend/internal/config/config.go
package config

import (
	"os"
	"strings"
)

type Config struct {
	Port        string
	Environment string
	Database    DatabaseConfig
	OpenAI      OpenAIConfig
	Security    SecurityConfig
}

type DatabaseConfig struct {
	URL string
}

type OpenAIConfig struct {
	APIKey string
	Model  string
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
			Model:  getEnv("OPENAI_MODEL", "gpt-3.5-turbo"),
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
