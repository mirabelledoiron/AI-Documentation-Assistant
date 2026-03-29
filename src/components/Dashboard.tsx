import { useState, useEffect } from 'react';
import { Code, Palette, TrendingUp, Bot, Lightbulb, Wifi, WifiOff, ExternalLink, BookOpen, Star, Zap } from 'lucide-react';
import { storybookService } from '../services/storybookService';
import { libraryService } from '../services/libraryService';
import { designTokens, aiInsights } from '../data/mockData';
import type { Component, SavedComponent } from '../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [libraryStats, setLibraryStats] = useState({
    totalComponents: 0,
    totalUsage: 0,
    mostUsedComponent: null as SavedComponent | null,
    recentComponents: [] as SavedComponent[],
    categoryBreakdown: {} as Record<string, number>,
    frameworkBreakdown: {} as Record<string, number>
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load Storybook components
      const fetchedComponents = await storybookService.fetchStories();
      setComponents(fetchedComponents);
      setIsConnected(storybookService.getConnectionStatus());
      
      // Load library statistics
      const stats = libraryService.getLibraryStats();
      setLibraryStats(stats);
    } catch (error) {
      console.error('Failed to load data:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const avgUsage = components.length > 0 ? Math.round(components.reduce((acc, comp) => acc + comp.usage, 0) / components.length) : 0;

  const openStorybook = () => {
    storybookService.openStorybook();
  };

  const openComponentDocs = (componentName: string) => {
    storybookService.openComponentDocs(componentName);
  };

  const openComponentStory = (componentName: string) => {
    storybookService.openComponentStory(componentName);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <div className="space-y-8">
      {/* Storybook Connection Status */}
      <div className="p-6 bg-white rounded-xl border border-brand-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-medium ${
              isConnected ? 'text-green-700' : 'text-red-700'
            }`}>
              {isConnected ? 'Connected to Storybook' : 'Storybook Disconnected'}
            </span>
          </div>
          <button
            onClick={openStorybook}
            className="flex items-center px-4 py-2 space-x-2 font-medium text-white rounded-lg transition-all duration-200 bg-brand-600 hover:bg-brand-700"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Storybook</span>
          </button>
        </div>
        <p className="text-sm text-accent-700">
          {isConnected 
            ? `Connected to ${storybookService.getStorybookUrl()}`
            : 'Using fallback data. Check your Storybook connection and try refreshing.'
          }
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-xl border transition-all duration-200 border-brand-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="mb-1 text-sm font-medium text-accent-700">Storybook Components</p>
              <p className="text-3xl font-bold text-brand-900">
                {isLoading ? '...' : components.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-brand-100">
              <Code className="w-8 h-8 text-accent-700" />
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-xl border transition-all duration-200 border-accent-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="mb-1 text-sm font-medium text-accent-700">Library Components</p>
              <p className="text-3xl font-bold text-accent-900">{libraryStats.totalComponents}</p>
            </div>
            <div className="p-3 rounded-lg bg-accent-100">
              <BookOpen className="w-8 h-8 text-accent-600" />
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-xl border transition-all duration-200 border-brand-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="mb-1 text-sm font-medium text-accent-700">Total Usage</p>
              <p className="text-3xl font-bold text-brand-900">
                {isLoading ? '...' : `${avgUsage}%`}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-brand-100">
              <TrendingUp className="w-8 h-8 text-accent-700" />
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-xl border transition-all duration-200 border-accent-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="mb-1 text-sm font-medium text-accent-700">Design Tokens</p>
              <p className="text-3xl font-bold text-accent-900">{designTokens.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-accent-100">
              <Palette className="w-8 h-8 text-accent-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Component Library Overview */}
      {libraryStats.totalComponents > 0 && (
        <div className="p-8 bg-white rounded-xl border border-brand-200">
          <h3 className="mb-6 text-xl font-semibold text-brand-900">Component Library Overview</h3>
          
          {/* Library Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-brand-50 rounded-lg border border-brand-200">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-brand-600" />
                <span className="text-sm font-medium text-brand-700">Total Usage</span>
              </div>
              <p className="text-2xl font-bold text-brand-900">{libraryStats.totalUsage}</p>
            </div>
            
            <div className="p-4 bg-accent-50 rounded-lg border border-accent-200">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-accent-600" />
                <span className="text-sm font-medium text-accent-700">Favorites</span>
              </div>
              <p className="text-2xl font-bold text-accent-900">
                {libraryStats.recentComponents.filter(c => c.isFavorite).length}
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Recent</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{libraryStats.recentComponents.length}</p>
            </div>
          </div>

          {/* Recent Components */}
          {libraryStats.recentComponents.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-brand-800 mb-4">Recently Added Components</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {libraryStats.recentComponents.slice(0, 6).map(component => (
                  <div key={component.id} className="p-4 bg-brand-50 rounded-lg border border-brand-200">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-brand-900">{component.name}</h5>
                      {component.isFavorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-brand-600 mb-2 line-clamp-2">{component.description}</p>
                    <div className="flex items-center justify-between text-xs text-brand-500">
                      <span>{component.framework}</span>
                      <span>{formatRelativeTime(component.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Breakdown */}
          {Object.keys(libraryStats.categoryBreakdown).length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-brand-800 mb-4">Components by Category</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(libraryStats.categoryBreakdown).map(([category, count]) => (
                  <div key={category} className="p-3 bg-accent-50 rounded-lg border border-accent-200 text-center">
                    <p className="text-sm font-medium text-accent-700">{category}</p>
                    <p className="text-xl font-bold text-accent-900">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Usage Chart */}
      {!isLoading && components.length > 0 && (
        <div className="p-8 bg-white rounded-xl border border-brand-200">
          <h3 className="mb-6 text-xl font-semibold text-brand-900">Storybook Component Usage Overview</h3>
          <div className="space-y-4">
            {components.map((component, index) => (
              <div key={index} className="flex items-center space-x-6">
                <div className="w-32 text-sm font-medium text-brand-700">{component.name}</div>
                <div className="overflow-hidden flex-1 h-4 rounded-full bg-brand-100">
                  <div 
                    className="h-4 bg-gradient-to-r rounded-full transition-all duration-500 ease-out from-brand-500 to-accent-500" 
                    style={{ width: `${component.usage}%` }}
                  ></div>
                </div>
                <div className="w-16 text-sm font-semibold text-brand-800">{component.usage}%</div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openComponentDocs(component.name)}
                    className="px-2 py-1 text-xs rounded transition-colors bg-brand-100 text-brand-700 hover:bg-brand-200"
                  >
                    Docs
                  </button>
                  <button
                    onClick={() => openComponentStory(component.name)}
                    className="px-2 py-1 text-xs rounded transition-colors bg-accent-100 text-accent-700 hover:bg-accent-200"
                  >
                    Story
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="p-8 bg-white rounded-xl border border-brand-200">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 animate-spin border-brand-600"></div>
            <p className="text-accent-700">Loading components from Storybook...</p>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="p-8 bg-white rounded-xl border border-brand-200">
        <h3 className="flex items-center mb-6 text-xl font-semibold text-brand-900">
          <div className="p-2 mr-3 rounded-lg bg-brand-100">
            <Bot className="w-6 h-6 text-accent-700" />
          </div>
          My AI Insights
        </h3>
        <div className="space-y-6">
          {aiInsights.map((insight, index) => (
            <div key={index} className="flex items-start p-6 space-x-4 rounded-xl border bg-brand-50 border-brand-100">
              <div className={`p-3 rounded-lg ${
                insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-2 space-x-3">
                  <h4 className="font-semibold text-brand-900">{insight.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    insight.priority === 'high' ? 'bg-accent-100 text-accent-800' :
                    insight.priority === 'medium' ? 'bg-accent-100 text-accent-800' :
                    'bg-brand-100 text-brand-800'
                  }`}>
                    {insight.priority}
                  </span>
                </div>
                <p className="mb-3 text-brand-700">{insight.description}</p>
                {insight.action && (
                  <p className="mb-2 text-sm font-medium text-accent-600">→ {insight.action}</p>
                )}
                {insight.savings && (
                  <p className="text-sm font-medium text-accent-700">Potential savings: {insight.savings}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-8 bg-white rounded-xl border border-brand-200">
        <h3 className="mb-6 text-xl font-semibold text-brand-900">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <button 
            onClick={() => onNavigate('generator')}
            className="p-6 text-left rounded-xl border-2 border-dashed transition-all duration-200 group border-brand-300 hover:border-brand-500 hover:bg-brand-50"
          >
            <div className="p-3 mb-4 rounded-lg transition-colors bg-brand-100 w-fit group-hover:bg-brand-200">
              <Code className="w-6 h-6 text-accent-700" />
            </div>
            <p className="mb-2 text-base font-semibold text-brand-900">Generate New Component</p>
            <p className="text-sm text-accent-700">Create a new component for your design system</p>
          </button>
          
          <button 
            onClick={() => onNavigate('library')}
            className="p-6 text-left rounded-xl border-2 border-dashed transition-all duration-200 group border-accent-300 hover:border-accent-500 hover:bg-accent-50"
          >
            <div className="p-3 mb-4 rounded-lg transition-colors bg-accent-100 w-fit group-hover:bg-accent-200">
              <BookOpen className="w-6 h-6 text-accent-600" />
            </div>
            <p className="mb-2 text-base font-semibold text-accent-900">Component Library</p>
            <p className="text-sm text-accent-600">View and manage your saved components</p>
          </button>
          
          <button 
            onClick={() => onNavigate('tokens')}
            className="p-6 text-left rounded-xl border-2 border-dashed transition-all duration-200 group border-brand-300 hover:border-brand-500 hover:bg-brand-50"
          >
            <div className="p-3 mb-4 rounded-lg transition-colors bg-brand-100 w-fit group-hover:bg-brand-200">
              <Palette className="w-6 h-6 text-accent-600" />
            </div>
            <p className="mb-2 text-base font-semibold text-brand-900">Add Design Token</p>
            <p className="text-sm text-accent-600">Define new design tokens for your system</p>
          </button>
          
          <button 
            onClick={() => onNavigate('components')}
            className="p-6 text-left rounded-xl border-2 border-dashed transition-all duration-200 group border-brand-300 hover:border-brand-500 hover:bg-brand-50"
          >
            <div className="p-3 mb-4 rounded-lg transition-colors bg-brand-100 w-fit group-hover:bg-brand-200">
              <TrendingUp className="w-6 h-6 text-accent-600" />
            </div>
            <p className="mb-2 text-base font-semibold text-brand-900">Run Analysis</p>
            <p className="text-sm text-accent-700">Check your system's health</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;