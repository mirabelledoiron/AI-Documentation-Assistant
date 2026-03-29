import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Copy } from 'lucide-react';
import { designTokens } from '../data/mockData';
import type { DesignToken } from '../types';

const DesignTokens: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'colors', 'spacing', 'typography', 'borders'];

  const filteredTokens = designTokens.filter(token => {
    const matchesSearch = token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         token.value.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || token.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedTokens = filteredTokens.reduce((groups, token) => {
    const category = token.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(token);
    return groups;
  }, {} as Record<string, DesignToken[]>);

  const copyToken = async (tokenName: string) => {
    try {
      await navigator.clipboard.writeText(`var(--${tokenName})`);
      alert('Token copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy token:', error);
    }
  };

  const renderTokenPreview = (token: DesignToken) => {
    switch (token.category) {
      case 'color':
        return (
          <div 
            className="w-10 h-10 rounded-lg border-2 border-brand-200"
            style={{ backgroundColor: token.value }}
          />
        );
      case 'spacing':
        return (
          <div className="flex items-center">
            <div 
              className="h-5 rounded bg-brand-500"
              style={{ width: token.value }}
            />
            <span className="ml-3 font-mono text-xs text-brand-500">{token.value}</span>
          </div>
        );
      case 'typography':
        return (
          <div 
            className="font-medium text-brand-900"
            style={{ 
              fontSize: token.value.split('/')[0],
              lineHeight: token.value.split('/')[1]
            }}
          >
            Aa
          </div>
        );
      case 'border':
        return (
          <div 
            className="w-10 h-10 bg-white border-2 border-brand-400"
            style={{ borderRadius: token.value }}
          />
        );
      case 'shadow':
        return (
          <div 
            className="w-10 h-10 bg-white rounded-lg border border-brand-200"
          />
        );
      default:
        return <div className="w-10 h-10 rounded-lg border bg-brand-100 border-brand-200" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-brand-900">Design Tokens</h2>
          <p className="mt-2 text-brand-600">Your design system's foundational values</p>
        </div>
        <button className="flex justify-center items-center px-6 py-3 space-x-3 font-semibold text-white rounded-xl transition-all duration-200 bg-brand-600 hover:bg-brand-700">
          <Plus className="w-5 h-5" />
          <span>Add Token</span>
        </button>
      </div>

      {/* Filters */}
      <div className="p-6 bg-white rounded-xl border border-brand-200">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 w-5 h-5 transform -translate-y-1/2 text-brand-400" />
            <input
              type="text"
              placeholder="Search tokens..."
              className="py-3 pr-4 pl-12 w-full rounded-xl border transition-all duration-200 border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent text-brand-900 placeholder-brand-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-3 font-medium bg-white rounded-xl border transition-all duration-200 border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent text-brand-900"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Token Groups */}
      {Object.entries(groupedTokens).map(([category, tokens]) => (
        <div key={category} className="overflow-hidden bg-white rounded-xl border border-brand-200">
          <div className="p-6 border-b border-brand-200 bg-brand-50">
            <h3 className="text-xl font-semibold capitalize text-brand-900">
              {category} ({tokens.length})
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {tokens.map((token, index) => (
                <div key={index} className="flex justify-between items-center p-4 rounded-xl border transition-all duration-200 bg-brand-50 hover:bg-brand-100 border-brand-100">
                  <div className="flex items-center space-x-4">
                    {renderTokenPreview(token)}
                    <div>
                      <p className="font-mono text-sm font-semibold text-brand-900">{token.name}</p>
                      <p className="font-mono text-xs text-brand-600">{token.value}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    
                    <button
                      onClick={() => copyToken(token.name)}
                      className="p-2 rounded-lg transition-all duration-200 text-brand-400 hover:text-brand-600 hover:bg-brand-100"
                      title="Copy token"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    
                    <button className="p-2 rounded-lg transition-all duration-200 text-brand-400 hover:text-green-600 hover:bg-green-100">
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button className="p-2 rounded-lg transition-all duration-200 text-brand-400 hover:text-red-600 hover:bg-red-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Usage Guidelines */}
      <div className="p-8 bg-white rounded-xl border border-brand-200">
        <h3 className="mb-6 text-xl font-semibold text-brand-900">Token Usage Guidelines</h3>
        <div className="space-y-6 text-brand-700">
          <div>
            <h4 className="mb-3 font-semibold text-brand-900">CSS Custom Properties</h4>
            <div className="p-4 font-mono text-sm text-green-400 rounded-xl border bg-brand-900 border-brand-800">
              <div>/* Use tokens as CSS custom properties */</div>
              <div>color: var(--color-primary-500);</div>
              <div>margin: var(--spacing-md);</div>
              <div>font-size: var(--typography-body-md);</div>
            </div>
          </div>
          
          <div>
            <h4 className="mb-3 font-semibold text-brand-900">Tailwind Configuration</h4>
            <div className="p-4 font-mono text-sm text-green-400 rounded-xl border bg-brand-900 border-brand-800">
              <div>// tailwind.config.js</div>
              <div>theme: {`{`}</div>
              <div>  extend: {`{`}</div>
              <div>    colors: {`{`}</div>
              <div>      primary: {`{`}</div>
              <div>        500: 'var(--color-primary-500)',</div>
              <div>      {`}`}</div>
              <div>    {`}`}</div>
              <div>  {`}`}</div>
              <div>{`}`}</div>
            </div>
          </div>
          
          <div>
            <h4 className="mb-3 font-semibold text-brand-900">Best Practices</h4>
            <ul className="space-y-2 list-disc list-inside">
              <li>Use semantic naming conventions (primary, secondary vs blue, red)</li>
              <li>Maintain consistent scales for spacing and typography</li>
              <li>Test color combinations for accessibility compliance</li>
              <li>Document token usage and update guidelines regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignTokens;