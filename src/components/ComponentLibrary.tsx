import { useState, useEffect } from 'react';
import { Search, Wand2, Check, ExternalLink, Wifi, WifiOff, X, Copy, CheckCircle } from 'lucide-react';
import { storybookService } from '../services/storybookService';
import { aiService } from '../services/aiService';
import type { Component, AnalysisResults } from '../types';

interface ComponentLibraryProps {
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  componentName: string;
  code: string;
  framework: string;
  styling: string;
}

const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose, componentName, code, framework, styling }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-brand-200">
          <div>
            <h3 className="text-xl font-semibold text-brand-900">
              Generated Code for {componentName}
            </h3>
            <p className="text-sm text-brand-600">
              Framework: {framework} | Styling: {styling}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all duration-200 text-brand-400 hover:text-brand-600 hover:bg-brand-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-brand-700">Generated Code:</span>
            <button
              onClick={copyCode}
              className="flex items-center px-3 py-2 space-x-2 text-sm text-white rounded-lg transition-all duration-200 bg-brand-600 hover:bg-brand-700"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          
          <pre className="overflow-x-auto p-4 text-sm text-green-400 rounded-lg bg-brand-900">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ isGenerating, setIsGenerating }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [components, setComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [codeModal, setCodeModal] = useState<{
    isOpen: boolean;
    componentName: string;
    code: string;
    framework: string;
    styling: string;
  }>({
    isOpen: false,
    componentName: '',
    code: '',
    framework: 'react-typescript',
    styling: 'tailwind-css'
  });

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

  const filteredComponents = components.filter(component =>
    component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const analyzeDesignSystem = async () => {
    setIsGenerating(true);
    
    try {
      const results = await aiService.analyzeDesignSystem(components, []);
      setAnalysisResults(results);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
    
    setIsGenerating(false);
  };

  const generateComponentCode = async (componentName: string) => {
    setIsGenerating(true);
    
    try {
      const code = await storybookService.generateComponentCode(
        componentName, 
        codeModal.framework, 
        codeModal.styling
      );
      
      setCodeModal({
        isOpen: true,
        componentName,
        code,
        framework: codeModal.framework,
        styling: codeModal.styling
      });
    } catch (error) {
      console.error('Code generation failed:', error);
      alert(`Code generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setIsGenerating(false);
  };

  const openStorybook = () => {
    storybookService.openStorybook();
  };

  const refreshComponents = () => {
    loadComponents();
  };

  const viewComponentDocs = (componentName: string) => {
    storybookService.openComponentDocs(componentName);
  };

  const viewComponentStory = (componentName: string) => {
    storybookService.openComponentStory(componentName);
  };

  return (
    <div className="space-y-8">
      {/* Connection Status and Actions */}
      <div className="p-6 bg-white rounded-xl border shadow-sm border-brand-200">
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
          <div className="flex items-center space-x-3">
            <button
              onClick={refreshComponents}
              disabled={isLoading}
              className="px-4 py-2 font-medium rounded-lg border transition-all duration-200 border-brand-300 hover:bg-brand-50 text-brand-700 disabled:opacity-50"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={openStorybook}
              className="flex items-center px-4 py-2 space-x-2 font-medium text-white rounded-lg shadow-sm transition-all duration-200 bg-brand-600 hover:bg-brand-700 hover:shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Storybook</span>
            </button>
          </div>
        </div>
        <p className="text-sm text-brand-600">
          {isConnected 
            ? `Connected to ${storybookService.getStorybookUrl()}`
            : 'Using fallback data. Check your Storybook connection and try refreshing.'
          }
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 w-5 h-5 transform -translate-y-1/2 text-brand-400" />
          <input
            type="text"
            placeholder="Search components..."
            className="py-3 pr-4 pl-12 w-full rounded-xl border transition-all duration-200 border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent text-brand-900 placeholder-brand-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={analyzeDesignSystem}
          disabled={isGenerating || components.length === 0}
          className="flex justify-center items-center px-6 py-3 space-x-3 font-medium text-white rounded-xl shadow-sm transition-all duration-200 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
        >
          <Wand2 className="w-5 h-5" />
          <span>{isGenerating ? 'AI Analyzing...' : 'AI Analysis'}</span>
        </button>
      </div>

      {/* Code Generation Settings */}
      <div className="bg-white p-6 rounded-xl border border-brand-200 shadow-sm">
        <h3 className="text-lg font-semibold text-brand-900 mb-4">Code Generation Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-2">Framework</label>
            <select 
              value={codeModal.framework}
              onChange={(e) => setCodeModal(prev => ({ ...prev, framework: e.target.value }))}
              className="w-full px-3 py-2 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
            >
              <option value="react-typescript">React + TypeScript</option>
              <option value="react-javascript">React + JavaScript</option>
              <option value="vue-typescript">Vue + TypeScript</option>
              <option value="vue-javascript">Vue + JavaScript</option>
              <option value="angular">Angular</option>
              <option value="svelte">Svelte</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-2">Styling</label>
            <select 
              value={codeModal.styling}
              onChange={(e) => setCodeModal(prev => ({ ...prev, styling: e.target.value }))}
              className="w-full px-3 py-2 border border-brand-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
            >
              <option value="tailwind-css">Tailwind CSS</option>
              <option value="css-modules">CSS Modules</option>
              <option value="styled-components">Styled Components</option>
              <option value="emotion">Emotion</option>
              <option value="scss">SCSS/Sass</option>
              <option value="vanilla-css">Vanilla CSS</option>
            </select>
          </div>
        </div>
        <p className="text-sm text-brand-600 mt-3">
          These settings will be used when generating code for components. You can change them at any time.
        </p>
      </div>

      {isLoading && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 animate-spin border-brand-600"></div>
          <p className="text-brand-600">Loading components from Storybook...</p>
        </div>
      )}

      {!isLoading && components.length === 0 && (
        <div className="py-12 text-center">
          <p className="mb-4 text-brand-600">No components found.</p>
          <button
            onClick={refreshComponents}
            className="px-4 py-2 text-white rounded-lg transition-all duration-200 bg-brand-600 hover:bg-brand-700"
          >
            Try Again
          </button>
        </div>
      )}

      {analysisResults && (
        <div className="p-8 bg-white rounded-xl border shadow-sm border-brand-200">
          <h3 className="mb-6 text-xl font-semibold text-brand-900">Your Design System Health</h3>
          <div className="grid grid-cols-2 gap-6 mb-6 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-brand-600">{analysisResults.coverage}%</div>
              <div className="text-sm font-medium text-brand-600">Coverage</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-brand-600">{analysisResults.accessibility}%</div>
              <div className="text-sm font-medium text-brand-600">Accessibility</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-accent-600">{analysisResults.consistency}%</div>
              <div className="text-sm font-medium text-accent-600">Consistency</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-accent-600">{analysisResults.maintenance}%</div>
              <div className="text-sm font-medium text-accent-600">Maintenance</div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-brand-900">My Recommendations:</h4>
            {analysisResults.recommendations.map((rec, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="p-1 rounded-full bg-brand-100">
                  <Check className="flex-shrink-0 w-4 h-4 text-brand-600" />
                </div>
                <span className="text-brand-700">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && components.length > 0 && (
        <div className="grid gap-6">
          {filteredComponents.map((component, index) => (
            <div key={index} className="p-8 bg-white rounded-xl border shadow-sm transition-all duration-200 border-brand-200 hover:shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-brand-900">{component.name}</h3>
                  <p className="font-medium text-brand-600">{component.category}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    component.status === 'stable' ? 'bg-green-100 text-green-800' :
                    component.status === 'beta' ? 'bg-amber-100 text-amber-800' :
                    'bg-brand-100 text-brand-800'
                  }`}>
                    {component.status}
                  </span>
                  <span className="text-sm text-brand-500">Updated {component.lastUpdated}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
                <div>
                  <p className="mb-2 text-sm font-medium text-brand-600">Usage Rate</p>
                  <div className="flex items-center space-x-3">
                    <div className="overflow-hidden flex-1 h-3 rounded-full bg-brand-100">
                      <div 
                        className="h-3 bg-gradient-to-r rounded-full transition-all duration-300 from-brand-500 to-accent-500" 
                        style={{ width: `${component.usage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-brand-800 min-w-[3rem]">{component.usage}%</span>
                  </div>
                </div>
                
                <div>
                  <p className="mb-2 text-sm font-medium text-brand-600">Accessibility</p>
                  <span className={`text-sm font-semibold ${
                    component.accessibility === 'AAA' ? 'text-green-600' : 'text-brand-600'
                  }`}>
                    WCAG {component.accessibility}
                  </span>
                </div>
                
                <div>
                  <p className="mb-2 text-sm font-medium text-brand-600">Variants</p>
                  <p className="text-sm font-semibold text-brand-800">{component.variants.length} variants</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {component.variants.map((variant, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 text-sm font-medium rounded-lg border bg-brand-100 text-brand-700 border-brand-200"
                  >
                    {variant}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => generateComponentCode(component.name)}
                  disabled={isGenerating}
                  className="px-4 py-2 font-medium text-white rounded-lg shadow-sm transition-all duration-200 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 hover:shadow-md"
                >
                  {isGenerating ? 'Generating...' : 'Generate Code'}
                </button>
                <button 
                  onClick={() => viewComponentDocs(component.name)}
                  className="px-4 py-2 font-medium rounded-lg border transition-all duration-200 border-brand-300 hover:bg-brand-50 text-brand-700"
                >
                  View Docs
                </button>
                <button 
                  onClick={() => viewComponentStory(component.name)}
                  className="px-4 py-2 font-medium rounded-lg border transition-all duration-200 border-brand-300 hover:bg-brand-50 text-brand-700"
                >
                  View Story
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Code Generation Modal */}
      <CodeModal
        isOpen={codeModal.isOpen}
        onClose={() => setCodeModal(prev => ({ ...prev, isOpen: false }))}
        componentName={codeModal.componentName}
        code={codeModal.code}
        framework={codeModal.framework}
        styling={codeModal.styling}
      />
    </div>
  );
};

export default ComponentLibrary;