import { Sun, Moon, Eye, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  usePreferences,
  toggleTheme,
  toggleA11y,
  toggleLowCarbon,
} from '@/hooks/usePreferences';

export const Header: React.FC = () => {
  const { theme, a11y, lowCarbon } = usePreferences();

  return (
    <div className="h-14 flex items-center justify-end px-6 bg-background">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-pressed={theme === 'dark'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="h-8 w-8 text-foreground/50 hover:text-foreground"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <Button
          variant={a11y ? 'secondary' : 'ghost'}
          size="icon"
          onClick={toggleA11y}
          aria-pressed={a11y}
          aria-label={a11y ? 'Disable accessibility mode' : 'Enable accessibility mode'}
          className={a11y ? 'h-8 w-8' : 'h-8 w-8 text-foreground/50 hover:text-foreground'}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant={lowCarbon ? 'secondary' : 'ghost'}
          size="icon"
          onClick={toggleLowCarbon}
          aria-pressed={lowCarbon}
          aria-label={lowCarbon ? 'Disable low carbon mode' : 'Enable low carbon mode'}
          className={lowCarbon ? 'h-8 w-8' : 'h-8 w-8 text-foreground/50 hover:text-foreground'}
        >
          <Leaf className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
