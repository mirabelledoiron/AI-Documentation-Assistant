import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, X } from 'lucide-react';
import { searchApi } from '@/services/api';
import type { SearchResult } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/Shared/Button';
import { Card, CardContent } from '@/components/ui/card';

export const Header: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const el = wrapperRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setResults([]);
        setError(null);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const runSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await searchApi.search(q, 5);
      setResults(res);
    } catch (e) {
      console.error('Search error:', e);
      setResults([]);
      setError('Search failed. Check your API key and backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/favicon.svg"
            alt="AI-Powered Documentation Assistant"
            className="h-14 w-auto object-contain"
          />
          <div className="leading-tight">
            <div className="text-base font-semibold text-foreground">AI-Powered Documentation Assistant</div>
            <div className="text-xs text-muted-foreground">Atelier Design System</div>
          </div>
        </Link>

        <div className="flex-1 px-4 sm:px-6 max-w-xl" ref={wrapperRef}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void runSearch();
            }}
            className="relative"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documentation…"
                className="pl-9 pr-24 h-10"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {query.trim() && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 w-8 px-0"
                    aria-label="Clear search"
                    onClick={() => {
                      setQuery('');
                      setResults([]);
                      setError(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  type="submit"
                  size="sm"
                  disabled={!query.trim()}
                  loading={isLoading}
                  className="h-8"
                >
                  Search
                </Button>
              </div>
            </div>

            {(error || results.length > 0) && (
              <div className="absolute left-0 right-0 mt-2 z-50">
                <Card>
                  <CardContent className="p-2">
                    {error && (
                      <div className="px-2 py-2 text-sm text-destructive">{error}</div>
                    )}
                    {results.length > 0 && (
                      <div className="space-y-1">
                        {results.map((r, idx) => (
                          <a
                            key={idx}
                            href={r.document.url || '#'}
                            target={r.document.url ? '_blank' : undefined}
                            rel={r.document.url ? 'noopener noreferrer' : undefined}
                            className="block rounded-md px-2 py-2 hover:bg-muted"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-foreground truncate">
                                  {r.document.title}
                                </div>
                                <div className="text-xs text-muted-foreground line-clamp-2">
                                  {r.document.content}
                                </div>
                              </div>
                              {r.document.url && (
                                <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              )}
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </form>
        </div>

        <div className="text-sm text-muted-foreground">v0</div>
      </div>
    </header>
  );
};

