import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Copy } from 'lucide-react';
import { designTokens } from '../data/mockData';
import type { DesignToken } from '../types';

const DesignTokens: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'colors', 'spacing', 'typography', 'borders', 'shadows'];

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
      case 'colors':
        return (
          <div 
            className="w-10 h-10 rounded-lg border-2 border-brand-200 shadow-sm"
            style={{ backgroundColor: token.value }}
          />
        );
      case 'spacing':
        return (
          <div className="flex items-center">
            <div 
              className="bg-brand-500 h-5 rounded"
              style={{ width: token.value }}
            />
            <span className="ml-3 text-xs text-brand-500 font-mono">{token.value}</span>
          </div>
        );
      case 'typography':
        return (
          <div 
            className="text-brand-900 font-medium"
            style={{ 
              fontSize: token.value.split('/')[0],
              lineHeight: token.value.split('/')[1]
            }}
          >
            Aa
          </div>
        );
      case 'borders':
        return (
          <div 
            className="w-10 h-10 border-2 border-brand-400 bg-white"
            style={{ borderRadius: token.value }}
          />
        );
      case 'shadows':
        return (
          <div 
            className="w-10 h-10 bg-white border border-brand-200 rounded-lg"
            style={{ boxShadow: token.value }}
          />
        );
      default:
        return <div className="w-10 h-10 bg-brand-100 rounded-lg border border-brand-200" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-brand-900">Design Tokens</h2>
          <p className="text-brand-600 mt-2">Your design system's foundational values</p>
        </div>
        <button className="px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 flex items-center justify-center space-x-3 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
          <Plus className="h-5 w-5" />
          <span>Add Token</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl border border-brand-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search tokens..."
              className="w-full pl-12 pr-4 py-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 text-brand-900 placeholder-brand-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 text-brand-900 bg-white font-medium"
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
        <div key={category} className="bg-white rounded-xl border border-brand-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-brand-200 bg-brand-50">
            <h3 className="text-xl font-semibold text-brand-900 capitalize">
              {category} ({tokens.length})
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {tokens.map((token, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-brand-50 rounded-xl hover:bg-brand-100 transition-all duration-200 border border-brand-100">
                  <div className="flex items-center space-x-4">
                    {renderTokenPreview(token)}
                    <div>
                      <p className="font-mono text-sm font-semibold text-brand-900">{token.name}</p>
                      <p className="font-mono text-xs text-brand-600">{token.value}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {token.usage && (
                      <div className="text-right mr-4">
                        <p className="text-sm font-semibold text-brand-900">{token.usage}%</p>
                        <p className="text-xs text-brand-600">usage</p>
                      </div>
                    )}
                    
                    <button
                      onClick={() => copyToken(token.name)}
                      className="p-2 text-brand-400 hover:text-brand-600 hover:bg-brand-100 rounded-lg transition-all duration-200"
                      title="Copy token"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    
                    <button className="p-2 text-brand-400 hover:text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200">
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button className="p-2 text-brand-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Usage Guidelines */}
      <div className="bg-white p-8 rounded-xl border border-brand-200 shadow-sm">
        <h3 className="text-xl font-semibold text-brand-900 mb-6">Token Usage Guidelines</h3>
        <div className="space-y-6 text-brand-700">
          <div>
            <h4 className="font-semibold text-brand-900 mb-3">CSS Custom Properties</h4>
            <div className="bg-brand-900 text-green-400 p-4 rounded-xl font-mono text-sm border border-brand-800">
              <div>/* Use tokens as CSS custom properties */</div>
              <div>color: var(--color-primary-500);</div>
              <div>margin: var(--spacing-md);</div>
              <div>font-size: var(--typography-body-md);</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-brand-900 mb-3">Tailwind Configuration</h4>
            <div className="bg-brand-900 text-green-400 p-4 rounded-xl font-mono text-sm border border-brand-800">
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
            <h4 className="font-semibold text-brand-900 mb-3">Best Practices</h4>
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