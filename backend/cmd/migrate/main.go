package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	_ "github.com/lib/pq"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL is required")
	}

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("failed to connect: %v", err)
	}
	defer db.Close()

	sqlBytes, err := os.ReadFile("migrations/001_initial_schema.sql")
	if err != nil {
		log.Fatalf("failed to read migration file: %v", err)
	}

	statements := splitSQL(string(sqlBytes))
	for _, stmt := range statements {
		if strings.TrimSpace(stmt) == "" {
			continue
		}
		if _, err := db.Exec(stmt); err != nil {
			log.Fatalf("migration failed: %v\n---\n%s\n---", err, stmt)
		}
	}

	fmt.Println("✅ migrations applied")
}

// naive SQL splitter; good enough for our single migration file
func splitSQL(input string) []string {
	parts := strings.Split(input, ";")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		out = append(out, p+";")
	}
	return out
}

