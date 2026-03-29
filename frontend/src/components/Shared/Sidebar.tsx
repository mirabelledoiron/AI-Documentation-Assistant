import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, Upload, BarChart2, KeyRound, Briefcase } from 'lucide-react';

const nav = [
  { to: '/', label: 'Overview', icon: Home },
  { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/analytics', label: 'Query Log', icon: BarChart2 },
  { to: '/case-studies', label: 'Case Studies', icon: Briefcase },
  { to: '/settings/api-keys', label: 'API Keys', icon: KeyRound },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:block w-64 border-r border-border bg-background min-h-[calc(100vh-4rem)]">
      <nav className="p-3 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive ? 'bg-muted text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')
              }
              end={item.to === '/'}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

