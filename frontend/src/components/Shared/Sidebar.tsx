import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageCircle, Search, Upload, BarChart2 } from 'lucide-react';

const nav = [
  { to: '/', label: 'Home', icon: MessageCircle },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:block w-64 border-r border-gray-200 bg-white min-h-[calc(100vh-4rem)]">
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
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50',
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

