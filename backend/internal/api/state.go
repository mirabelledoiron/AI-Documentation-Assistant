package api

import (
	"sync"

	"github.com/yourname/ai-documentation-assistant/internal/config"
	"gorm.io/gorm"
)

type deps struct {
	cfg *config.Config
	db  *gorm.DB
}

var (
	stateMu sync.RWMutex
	state   *deps
)

// Init wires config + db into the api package so package-level handlers can use them.
// Call this once from main() before SetupRoutes().
func Init(cfg *config.Config, db *gorm.DB) {
	stateMu.Lock()
	defer stateMu.Unlock()
	state = &deps{cfg: cfg, db: db}
}

func getState() *deps {
	stateMu.RLock()
	defer stateMu.RUnlock()
	return state
}

