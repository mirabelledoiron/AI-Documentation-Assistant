// backend/internal/services/search.go
package services

import (
	"gorm.io/gorm"
)

type SearchService struct {
	db *gorm.DB
}

func NewSearchService(db *gorm.DB) *SearchService {
	return &SearchService{db: db}
}

func (s *SearchService) SearchSimilar(queryEmbedding []float32, limit int) ([]map[string]interface{}, error) {
	var results []map[string]interface{}
	
	err := s.db.Raw(`
		SELECT 
			d.id,
			d.title,
			d.content,
			d.url,
			d.category,
			d.tags,
			e.vector <=> ? AS score
		FROM documents d
		JOIN embeddings e ON d.id = e.document_id
		ORDER BY e.vector <=> ?
		LIMIT ?
	`, queryEmbedding, queryEmbedding, limit).Scan(&results).Error

	return results, err
}

type SearchResult struct {
	ID       uint    `json:"id"`
	Title    string  `json:"title"`
	Content  string  `json:"content"`
	URL      string  `json:"url"`
	Category string  `json:"category"`
	Tags     []string `json:"tags"`
	Score    float64 `json:"score"`
}
