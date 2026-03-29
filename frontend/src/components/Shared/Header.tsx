import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-atelier-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="px-3 h-9 bg-gradient-to-r from-atelier-primary to-atelier-accent rounded-atelier flex items-center justify-center">
            <span className="font-signature text-white text-lg leading-none">Mirabelle&apos;s</span>
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold text-gray-900">Mirabelle's AI Documentation Assistant</div>
            <div className="text-xs text-gray-500">Atelier Design System</div>
          </div>
        </Link>
        <div className="text-sm text-gray-500">v0</div>
      </div>
    </header>
  );
};

