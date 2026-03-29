import { useState } from 'react';
import { TrendingUp, Code, Wand2, Palette, Settings, Bot } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ComponentLibrary from './components/ComponentLibrary';
import CodeGenerator from './components/CodeGenerator';
import DesignTokens from './components/DesignTokens';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'components', label: 'Components', icon: Code },
    { id: 'generator', label: 'AI Generator', icon: Wand2 },
    { id: 'tokens', label: 'Design Tokens', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Header */}
      <header className="bg-white border-b border-brand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Bot className="h-8 w-8 text-brand-600" />
              <h1 className="text-xl font-bold text-brand-900">Mirabelle's Design System</h1>
              {isGenerating && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-brand-100 text-brand-800 rounded-full text-sm">
                  <div className="w-2 h-2 bg-brand-600 rounded-full animate-pulse"></div>
                  <span>AI Working...</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-brand-600">
                Built by Mirabelle with Claude AI
              </div>
              <button className="p-2 text-brand-400 hover:text-brand-600">
                <Settings className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 bg-brand-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AI</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-brand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-brand-500 text-brand-600'
                      : 'border-transparent text-brand-500 hover:text-brand-700 hover:border-brand-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'components' && <ComponentLibrary isGenerating={isGenerating} setIsGenerating={setIsGenerating} />}
        {activeTab === 'generator' && <CodeGenerator isGenerating={isGenerating} setIsGenerating={setIsGenerating} />}
        {activeTab === 'tokens' && <DesignTokens />}
      </main>
    </div>
  );
};

export default App;