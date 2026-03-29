package services

import (
	"archive/zip"
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"strings"
	"time"
)

type AtelierImportOptions struct {
	Owner string
	Repo  string
	Ref   string
	Limit int

	// MaxFileBytes is a safety limit to avoid ingesting huge files.
	MaxFileBytes int64
}

type ImportedDocument struct {
	Title    string
	Content  string
	URL      string
	Category string
	Tags     []string
	Path     string
}

func ImportAtelierStorybookZip(ctx context.Context, opts AtelierImportOptions) ([]ImportedDocument, map[string]int, error) {
	owner := strings.TrimSpace(opts.Owner)
	repo := strings.TrimSpace(opts.Repo)
	ref := strings.TrimSpace(opts.Ref)
	if owner == "" || repo == "" {
		return nil, nil, fmt.Errorf("owner/repo is required")
	}
	if ref == "" {
		ref = "main"
	}
	limit := opts.Limit
	if limit <= 0 {
		limit = 200
	}
	maxBytes := opts.MaxFileBytes
	if maxBytes <= 0 {
		maxBytes = 250 * 1024
	}

	stats := map[string]int{
		"considered": 0,
		"imported":   0,
		"skipped":    0,
	}

	zipURL := fmt.Sprintf("https://api.github.com/repos/%s/%s/zipball/%s", owner, repo, ref)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, zipURL, nil)
	if err != nil {
		return nil, stats, err
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", "ai-documentation-assistant")

	client := &http.Client{Timeout: 60 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, stats, err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		b, _ := io.ReadAll(io.LimitReader(resp.Body, 8*1024))
		return nil, stats, fmt.Errorf("github zipball request failed: %s: %s", resp.Status, strings.TrimSpace(string(b)))
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, stats, err
	}

	zr, err := zip.NewReader(bytes.NewReader(data), int64(len(data)))
	if err != nil {
		return nil, stats, err
	}

	imported := make([]ImportedDocument, 0, min(limit, len(zr.File)))
	for _, f := range zr.File {
		if len(imported) >= limit {
			break
		}
		if f.FileInfo().IsDir() {
			continue
		}

		relPath := stripZipRootDir(f.Name)
		if relPath == "" {
			continue
		}

		stats["considered"]++
		if shouldSkipAtelierPath(relPath) {
			stats["skipped"]++
			continue
		}

		ext := strings.ToLower(filepath.Ext(relPath))
		if !isAllowedAtelierExt(ext) {
			stats["skipped"]++
			continue
		}

		if f.UncompressedSize64 > uint64(maxBytes) {
			stats["skipped"]++
			continue
		}

		rc, err := f.Open()
		if err != nil {
			stats["skipped"]++
			continue
		}
		b, err := io.ReadAll(io.LimitReader(rc, maxBytes+1))
		_ = rc.Close()
		if err != nil {
			stats["skipped"]++
			continue
		}
		if int64(len(b)) > maxBytes {
			stats["skipped"]++
			continue
		}

		content := strings.TrimSpace(string(b))
		if content == "" {
			stats["skipped"]++
			continue
		}

		title := titleFromPath(relPath)
		category := categoryFromPath(relPath)
		tags := tagsFromPath(relPath)

		url := fmt.Sprintf("https://github.com/%s/%s/blob/%s/%s", owner, repo, ref, relPath)
		docContent := fmt.Sprintf("Source: %s\nPath: %s\n\n%s", url, relPath, content)

		imported = append(imported, ImportedDocument{
			Title:    title,
			Content:  docContent,
			URL:      url,
			Category: category,
			Tags:     tags,
			Path:     relPath,
		})
		stats["imported"]++
	}

	return imported, stats, nil
}

func stripZipRootDir(name string) string {
	// GitHub zipballs prefix every entry with a top-level folder like:
	// owner-repo-sha/<path>
	parts := strings.SplitN(name, "/", 2)
	if len(parts) != 2 {
		return ""
	}
	return strings.TrimPrefix(parts[1], "/")
}

func shouldSkipAtelierPath(relPath string) bool {
	p := strings.ToLower(relPath)
	// common huge/unhelpful directories
	skipPrefixes := []string{
		"node_modules/",
		"dist/",
		"build/",
		"coverage/",
		"storybook-static/",
		".git/",
		".github/",
		".changeset/",
	}
	for _, pref := range skipPrefixes {
		if strings.HasPrefix(p, pref) {
			return true
		}
	}
	// lock files / generated
	skipFiles := []string{
		"package-lock.json",
		"pnpm-lock.yaml",
		"yarn.lock",
		"bun.lockb",
		".ds_store",
	}
	base := strings.ToLower(filepath.Base(p))
	for _, f := range skipFiles {
		if base == f {
			return true
		}
	}
	return false
}

func isAllowedAtelierExt(ext string) bool {
	switch ext {
	case ".md", ".mdx", ".json", ".txt":
		return true
	default:
		return false
	}
}

func titleFromPath(relPath string) string {
	base := strings.TrimSuffix(filepath.Base(relPath), filepath.Ext(relPath))
	base = strings.ReplaceAll(base, "-", " ")
	base = strings.ReplaceAll(base, "_", " ")
	base = strings.TrimSpace(base)
	if base == "" {
		base = relPath
	}
	return base
}

func categoryFromPath(relPath string) string {
	parts := strings.Split(relPath, "/")
	if len(parts) == 0 {
		return "Atelier"
	}
	top := strings.TrimSpace(parts[0])
	if top == "" {
		return "Atelier"
	}
	return "Atelier / " + top
}

func tagsFromPath(relPath string) []string {
	parts := strings.Split(relPath, "/")
	seen := map[string]bool{}
	add := func(t string) {
		t = strings.ToLower(strings.TrimSpace(t))
		if t == "" {
			return
		}
		if !seen[t] {
			seen[t] = true
		}
	}

	add("atelier")
	add(strings.TrimPrefix(strings.ToLower(filepath.Ext(relPath)), "."))
	if len(parts) > 0 {
		add(parts[0])
	}
	for _, p := range parts {
		p = strings.ToLower(p)
		if strings.Contains(p, "token") {
			add("tokens")
		}
		if strings.Contains(p, "component") {
			add("components")
		}
		if strings.Contains(p, "pattern") {
			add("patterns")
		}
		if strings.Contains(p, "guid") {
			add("guidelines")
		}
	}

	out := make([]string, 0, len(seen))
	for k := range seen {
		out = append(out, k)
	}
	return out
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
