import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-atelier-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="leading-tight">
            <div className="text-base font-semibold text-gray-900">AI-Powered Documentation Assistant</div>
            <div className="text-xs text-gray-500">Atelier Design System</div>
          </div>
        </Link>
        <div className="text-sm text-gray-500">v0</div>
      </div>
    </header>
  );
};

