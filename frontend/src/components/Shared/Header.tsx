import { Sun, Moon, Eye, Leaf } from 'lucide-react';
import {
  usePreferences,
  toggleTheme,
  toggleA11y,
  toggleLowCarbon,
} from '@/hooks/usePreferences';

export const Header: React.FC = () => {
  const { theme, a11y, lowCarbon } = usePreferences();

  return (
    <header className="h-14 flex items-center justify-end px-6 bg-background">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={toggleTheme}
          aria-pressed={theme === 'dark'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-foreground/50 hover:text-foreground hover:bg-muted transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={toggleA11y}
          aria-pressed={a11y}
          aria-label={a11y ? 'Disable accessibility mode' : 'Enable accessibility mode'}
          className={[
            'h-8 w-8 inline-flex items-center justify-center rounded-lg transition-colors',
            a11y
              ? 'text-primary bg-primary/10'
              : 'text-foreground/50 hover:text-foreground hover:bg-muted',
          ].join(' ')}
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={toggleLowCarbon}
          aria-pressed={lowCarbon}
          aria-label={lowCarbon ? 'Disable low carbon mode' : 'Enable low carbon mode'}
          className={[
            'h-8 w-8 inline-flex items-center justify-center rounded-lg transition-colors',
            lowCarbon
              ? 'text-primary bg-primary/10'
              : 'text-foreground/50 hover:text-foreground hover:bg-muted',
          ].join(' ')}
        >
          <Leaf className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
