// backend/internal/database/database.go
package database

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Database struct {
	*gorm.DB
}

func New(dsn string) (*Database, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
		NowFunc: func() time.Time {
			return time.Now().UTC()
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Enable pgvector extension
	db.Exec("CREATE EXTENSION IF NOT EXISTS vector")

	log.Println("✅ Database connected successfully")

	return &Database{db}, nil
}

func (db *Database) AutoMigrate(models ...interface{}) error {
	return db.DB.AutoMigrate(models...)
}

func (db *Database) HealthCheck() error {
	sqlDB, err := db.DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Ping()
}
