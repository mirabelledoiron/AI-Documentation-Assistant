package models

import (
	"time"
)

type Document struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Title       string    `json:"title" gorm:"not null;index"`
	Content     string    `json:"content" gorm:"type:text;not null"`
	URL         string    `json:"url" gorm:"index"`
	Category    string    `json:"category" gorm:"index"`
	Tags        []string  `json:"tags" gorm:"type:text[]"`
	Embedding   []float32 `json:"-" gorm:"-"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type UserQuery struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Query     string    `json:"query" gorm:"type:text;not null"`
	Response  string    `json:"response" gorm:"type:text"`
	Sources   []string  `json:"sources" gorm:"type:text[]"`
	CreatedAt time.Time
}

type Embedding struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	DocumentID uint      `json:"document_id" gorm:"index"`
	Vector     []float32 `json:"-" gorm:"type:vector(1536)"`
	CreatedAt  time.Time
}

type SearchRequest struct {
	Query string `json:"query" binding:"required,min=3"`
	Limit int    `json:"limit" binding:"min=1,max=10" default:"5"`
}

type ChatRequest struct {
	Messages []Message `json:"messages" binding:"required,min=1"`
	Stream   bool      `json:"stream" default:"false"`
}

type Message struct {
	Role    string `json:"role" binding:"required,oneof=user assistant system"`
	Content string `json:"content" binding:"required,min=1"`
}

type SearchResult struct {
	Document Document `json:"document"`
	Score    float64  `json:"score"`
}

type ChatResponse struct {
	Message string         `json:"message"`
	Sources []SearchResult `json:"sources,omitempty"`
}

type DocumentListResponse struct {
	Documents []Document `json:"documents"`
	Total     int64      `json:"total"`
	Page      int        `json:"page"`
	Limit     int        `json:"limit"`
}
