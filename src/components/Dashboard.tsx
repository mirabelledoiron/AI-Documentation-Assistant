import { useState, useEffect } from 'react';
import { Code, Palette, TrendingUp, CheckCircle, Bot, Lightbulb, Wifi, WifiOff, ExternalLink } from 'lucide-react';
import { storybookService } from '../services/storybookService';
import { designTokens, aiInsights } from '../data/mockData';
import type { Component } from '../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    setIsLoading(true);
    try {
      const fetchedComponents = await storybookService.fetchStories();
      setComponents(fetchedComponents);
      setIsConnected(storybookService.getConnectionStatus());
    } catch (error) {
      console.error('Failed to load components:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const avgUsage = components.length > 0 ? Math.round(components.reduce((acc, comp) => acc + comp.usage, 0) / components.length) : 0;
  const accessibilityScore = components.length > 0 ? Math.round(
    components.reduce((acc, comp) => acc + (comp.accessibility === 'AAA' ? 100 : 85), 0) / components.length
  ) : 0;

  const openStorybook = () => {
    storybookService.openStorybook();
  };

  const openComponentDocs = (componentName: string) => {
    storybookService.openComponentDocs(componentName);
  };

  const openComponentStory = (componentName: string) => {
    storybookService.openComponentStory(componentName);
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
              <p className="mb-1 text-sm font-medium text-accent-700">Total Components</p>
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
              <p className="mb-1 text-sm font-medium text-accent-700">Design Tokens</p>
              <p className="text-3xl font-bold text-accent-900">{designTokens.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-accent-100">
              <Palette className="w-8 h-8 text-accent-600" />
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-xl border transition-all duration-200 border-brand-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="mb-1 text-sm font-medium text-accent-700">Avg. Usage</p>
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
              <p className="mb-1 text-sm font-medium text-accent-700">Accessibility</p>
              <p className="text-3xl font-bold text-accent-900">
                {isLoading ? '...' : `${accessibilityScore}%`}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-accent-100">
              <CheckCircle className="w-8 h-8 text-accent-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Usage Chart */}
      {!isLoading && components.length > 0 && (
        <div className="p-8 bg-white rounded-xl border border-brand-200">
          <h3 className="mb-6 text-xl font-semibold text-brand-900">Component Usage Overview</h3>
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
            onClick={() => onNavigate('tokens')}
            className="p-6 text-left rounded-xl border-2 border-dashed transition-all duration-200 group border-accent-300 hover:border-accent-500 hover:bg-accent-50"
          >
            <div className="p-3 mb-4 rounded-lg transition-colors bg-accent-100 w-fit group-hover:bg-accent-200">
              <Palette className="w-6 h-6 text-accent-600" />
            </div>
            <p className="mb-2 text-base font-semibold text-accent-900">Add Design Token</p>
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