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
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Bot className="w-8 h-8 text-accent-700" />
              <h1 className="text-xl font-bold text-accent-700">Mirabelle's Design System</h1>
              {isGenerating && (
                <div className="flex items-center px-3 py-1 space-x-2 text-sm rounded-full bg-brand-100 text-accent-700">
                  <div className="w-2 h-2 rounded-full animate-pulse bg-brand-600"></div>
                  <span>AI Working...</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-accent-700">
                Built by Mirabelle with Claude AI
              </div>
              <button className="p-2 text-brand-400 hover:text-accent-700">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex justify-center items-center w-8 h-8 rounded-full bg-brand-700">
                <span className="text-sm font-medium text-white">AI</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-brand-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-lg text-accent-700 ${
                    activeTab === tab.id
                      ? 'border-brand-500 text-accent-700'
                      : 'border-transparent text-brand-500 hover:text-brand-700 hover:border-brand-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
        {activeTab === 'components' && <ComponentLibrary isGenerating={isGenerating} setIsGenerating={setIsGenerating} />}
        {activeTab === 'generator' && <CodeGenerator isGenerating={isGenerating} setIsGenerating={setIsGenerating} />}
        {activeTab === 'tokens' && <DesignTokens />}
      </main>
    </div>
  );
};

export default App;