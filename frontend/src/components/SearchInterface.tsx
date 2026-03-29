import React, { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { searchApi } from '@/services/api';
import { SearchResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export const SearchInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const searchResults = await searchApi.search(query, 10);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documentation..."
              className="pl-10 h-12"
            />
          </div>
          <Button type="submit" disabled={!query.trim()} loading={isLoading} className="h-12 px-6">
            Search
          </Button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Found {results.length} results
          </h3>
          {results.map((result, index) => (
            <Card key={index} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-medium text-foreground">{result.document.title}</h4>
                  {result.document.url && (
                    <a
                      href={result.document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:opacity-90"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  {result.document.content.substring(0, 300)}...
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Score: {result.score.toFixed(4)}</span>
                  {result.document.category && (
                    <span className="px-2 py-1 bg-muted rounded-md text-foreground">
                      {result.document.category}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
