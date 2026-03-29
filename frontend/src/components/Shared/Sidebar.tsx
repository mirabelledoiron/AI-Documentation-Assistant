import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePreferences, toggleTheme } from '@/hooks/usePreferences';

const nav = [
  { to: '/', label: 'HOME' },
  { to: '/chat', label: 'CHAT' },
  { to: '/upload', label: 'UPLOAD' },
  { to: '/analytics', label: 'QUERY LOG' },
  { to: '/case-studies', label: 'CASE STUDIES' },
  { to: '/settings/api-keys', label: 'API KEYS' },
];

function SidebarNav() {
  return (
    <div className="flex-1 py-2">
      {nav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            [
              'flex items-center justify-between px-6 py-3 text-xs tracking-[0.15em] transition-colors',
              isActive
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')
          }
          end={item.to === '/'}
        >
          {item.label}
          <ChevronRight className="w-4 h-4 opacity-40" />
        </NavLink>
      ))}
    </div>
  );
}

function DarkModeToggle() {
  const { theme } = usePreferences();
  return (
    <div className="mt-auto">
      <Separator />
      <Button
        variant="ghost"
        onClick={toggleTheme}
        className="flex items-center justify-start gap-3 px-6 py-4 text-sm text-muted-foreground hover:text-foreground w-full h-auto rounded-none"
        aria-pressed={theme === 'dark'}
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        Dark mode
      </Button>
    </div>
  );
}

function SidebarInner({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-5">
        <span className="text-lg font-bold text-foreground">AI Doc Assistant</span>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close sidebar"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
      </div>
      <Separator />
      <SidebarNav />
      <DarkModeToggle />
    </div>
  );
}

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export const AppSidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger
          className="md:hidden fixed top-4 left-4 z-40 h-10 w-10 flex items-center justify-center rounded-lg bg-card border border-border shadow-sm text-foreground"
        >
          <Menu className="w-5 h-5" />
          <span className="sr-only">Open menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarInner />
        </SheetContent>
      </Sheet>

      {/* Desktop: collapsed state */}
      {!open && (
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          aria-label="Open sidebar"
          className="hidden md:flex fixed top-5 left-5 z-30 h-9 w-9 shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}

      {/* Desktop: expanded */}
      {open && (
        <div className="hidden md:block w-64 flex-shrink-0 border-r border-border bg-background h-screen sticky top-0 overflow-y-auto">
          <SidebarInner onClose={onToggle} />
        </div>
      )}
    </>
  );
};
