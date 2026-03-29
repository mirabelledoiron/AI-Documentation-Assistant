package main

import (
	"database/sql"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
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

	// Execute the whole file at once.
	// This avoids breaking on semicolons inside dollar-quoted function bodies (e.g. $$ ... $$).
	if _, err := db.Exec(string(sqlBytes)); err != nil {
		log.Fatalf("migration failed: %v", err)
	}

	log.Println("migrations applied")
}
