import { useRef, useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Home, MessageCircle, Upload, BarChart2, KeyRound, Briefcase, Search, ExternalLink, X } from 'lucide-react';
import { searchApi } from '@/services/api';
import type { SearchResult } from '@/types';
import { Input } from '@/components/ui/input';
import { LowCarbonImage } from '@/components/LowCarbonImage';

const nav = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/analytics', label: 'Query Log', icon: BarChart2 },
  { to: '/case-studies', label: 'Case Studies', icon: Briefcase },
  { to: '/settings/api-keys', label: 'API Keys', icon: KeyRound },
];

export const Sidebar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [, setIsLoading] = useState(false);
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
    <aside className="hidden md:flex flex-col w-60 flex-shrink-0 bg-background h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <Link to="/" className="flex items-center gap-2.5">
          <LowCarbonImage
            src="/favicon.svg"
            alt="AI Docs"
            className="h-8 w-8 object-contain"
          />
          <span className="text-sm font-semibold text-foreground tracking-tight">
            AI Doc Assistant
          </span>
        </Link>
      </div>

      {/* Search */}
      <div className="px-4 pb-4 relative" ref={wrapperRef}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void runSearch();
          }}
        >
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="pl-8 h-9 text-sm bg-muted/50 border-border"
            />
            {query.trim() && (
              <button
                type="button"
                onClick={() => { setQuery(''); setResults([]); setError(null); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>

        {(error || results.length > 0) && (
          <div className="absolute left-4 right-4 mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg">
            <div className="p-2">
              {error && <div className="px-2 py-2 text-sm text-destructive">{error}</div>}
              {results.map((r, idx) => (
                <a
                  key={idx}
                  href={r.document.url || '#'}
                  target={r.document.url ? '_blank' : undefined}
                  rel={r.document.url ? 'noopener noreferrer' : undefined}
                  className="flex items-start justify-between gap-2 rounded-md px-2 py-2 hover:bg-muted text-sm"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-foreground truncate">{r.document.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{r.document.content}</div>
                  </div>
                  {r.document.url && <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground/70 hover:bg-muted hover:text-foreground',
                ].join(' ')
              }
              end={item.to === '/'}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer inside sidebar */}
      <div className="px-5 py-4 mt-auto text-xs text-muted-foreground">
        Atelier Design System
      </div>
    </aside>
  );
};
