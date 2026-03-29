import { useState } from 'react';
import { Wand2, CheckCircle, Copy, RotateCcw, AlertCircle, Save, BookOpen } from 'lucide-react';
import { aiService } from '../services/aiService';
import { libraryService } from '../services/libraryService';

interface CodeGeneratorProps {
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ isGenerating, setIsGenerating }) => {
  const [selectedComponent, setSelectedComponent] = useState('Button');
  const [selectedFramework, setSelectedFramework] = useState('React + TypeScript');
  const [selectedStyling, setSelectedStyling] = useState('Tailwind CSS');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyWarning, setShowApiKeyWarning] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveForm, setSaveForm] = useState({
    name: '',
    description: '',
    category: 'Interactive',
    tags: ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const componentOptions = [
    'Button', 'Card', 'Modal', 'Input', 'Dropdown', 'Tooltip', 
    'Badge', 'Alert', 'Accordion', 'Tabs', 'Checkbox', 'Radio'
  ];

  const frameworkOptions = [
    'React + TypeScript',
    'React + JavaScript', 
    'Vue 3 + TypeScript',
    'Vue 3 + JavaScript',
    'Angular + TypeScript',
    'Svelte + TypeScript',
    'Vanilla JavaScript'
  ];

  const stylingOptions = [
    'Tailwind CSS',
    'CSS Modules',
    'Styled Components',
    'Emotion',
    'SASS/SCSS',
    'CSS-in-JS',
    'Vanilla CSS'
  ];

  const categoryOptions = [
    'Interactive', 'Layout', 'Form', 'Navigation', 'Feedback', 'Display', 'Overlay'
  ];

  const generateCode = async () => {
    setIsGenerating(true);
    setError(null);
    setShowApiKeyWarning(false);
    
    try {
      // Check if API key is available
      if (!import.meta.env.VITE_CLAUDE_API_KEY) {
        setShowApiKeyWarning(true);
        console.warn('No Claude API key found. Using fallback code generation.');
      }

      const code = await aiService.generateComponentCode({
        componentName: selectedComponent,
        framework: selectedFramework,
        styling: selectedStyling,
        componentDetails: {
          variants: getDefaultVariants(selectedComponent),
          category: getComponentCategory(selectedComponent),
          description: `AI-generated ${selectedComponent} component using ${selectedFramework} with ${selectedStyling}`
        }
      });
      
      setGeneratedCode(code);
      
      // Auto-populate save form
      setSaveForm({
        name: selectedComponent,
        description: `${selectedComponent} component generated with ${selectedFramework} and ${selectedStyling}`,
        category: getComponentCategory(selectedComponent),
        tags: `${selectedComponent.toLowerCase()}, ${selectedFramework.toLowerCase()}, ${selectedStyling.toLowerCase()}`
      });
    } catch (error) {
      console.error('Code generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Code generation failed: ${errorMessage}`);
      setGeneratedCode(`// Error generating code: ${errorMessage}\n// Using fallback generation...`);
      
      // Try fallback generation
      try {
        const fallbackCode = await aiService.generateComponentCode({
          componentName: selectedComponent,
          framework: selectedFramework,
          styling: selectedStyling,
          componentDetails: {
            variants: getDefaultVariants(selectedComponent),
            category: getComponentCategory(selectedComponent),
            description: `Fallback ${selectedComponent} component using ${selectedFramework} with ${selectedStyling}`
          }
        });
        setGeneratedCode(fallbackCode);
        setError(null);
      } catch (fallbackError) {
        setError(`Both AI and fallback generation failed: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
      }
    }
    
    setIsGenerating(false);
  };

  const getDefaultVariants = (component: string): string[] => {
    const variantMap: Record<string, string[]> = {
      'Button': ['primary', 'secondary', 'ghost', 'danger'],
      'Card': ['default', 'elevated', 'outlined'],
      'Modal': ['small', 'medium', 'large', 'full'],
      'Input': ['default', 'error', 'success', 'disabled'],
      'Dropdown': ['default', 'searchable', 'multi-select'],
      'Tooltip': ['top', 'bottom', 'left', 'right'],
      'Badge': ['success', 'warning', 'error', 'info'],
      'Alert': ['info', 'success', 'warning', 'error'],
      'Accordion': ['single', 'multiple'],
      'Tabs': ['horizontal', 'vertical'],
      'Checkbox': ['default', 'indeterminate'],
      'Radio': ['default', 'disabled']
    };
    return variantMap[component] || ['primary', 'secondary', 'ghost'];
  };

  const getComponentCategory = (component: string): string => {
    const categoryMap: Record<string, string> = {
      'Button': 'Interactive',
      'Card': 'Layout',
      'Modal': 'Overlay',
      'Input': 'Form',
      'Dropdown': 'Navigation',
      'Tooltip': 'Feedback',
      'Badge': 'Display',
      'Alert': 'Feedback',
      'Accordion': 'Layout',
      'Tabs': 'Navigation',
      'Checkbox': 'Form',
      'Radio': 'Form'
    };
    return categoryMap[component] || 'UI';
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      // Show success feedback
      const button = document.querySelector('[data-copy-button]') as HTMLButtonElement;
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<CheckCircle className="w-4 h-4" /><span>Copied!</span>';
        button.classList.add('bg-green-700');
        setTimeout(() => {
          button.innerHTML = originalText;
          button.classList.remove('bg-green-700');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to copy code:', error);
      setError('Failed to copy code. Please select and copy manually.');
    }
  };

  const generateTests = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const testCode = await aiService.generateComponentCode({
        componentName: `${selectedComponent} Tests`,
        framework: selectedFramework,
        styling: 'jest-testing-library'
      });
      
      setGeneratedCode(testCode);
    } catch (error) {
      console.error('Test generation failed:', error);
      setError(`Test generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setIsGenerating(false);
  };

  const handleSaveToLibrary = () => {
    if (!generatedCode.trim()) {
      setError('No code to save. Please generate a component first.');
      return;
    }
    setShowSaveModal(true);
  };

  const saveComponentToLibrary = () => {
    try {
      const tags = saveForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      
      const componentData = {
        name: saveForm.name,
        code: generatedCode,
        framework: selectedFramework,
        styling: selectedStyling,
        category: saveForm.category,
        variants: getDefaultVariants(selectedComponent),
        description: saveForm.description,
        tags,
        isFavorite: false,
        metadata: {
          linesOfCode: generatedCode.split('\n').length,
          hasTypeScript: generatedCode.includes('TypeScript') || generatedCode.includes('interface') || generatedCode.includes('type'),
          hasAccessibility: generatedCode.includes('aria-') || generatedCode.includes('role=') || generatedCode.includes('accessibility'),
          hasTests: generatedCode.includes('test') || generatedCode.includes('spec') || generatedCode.includes('describe')
        }
      };

      const savedComponent = libraryService.saveComponent(componentData);
      console.log('Component saved to library:', savedComponent);
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowSaveModal(false);
        setSaveForm({
          name: '',
          description: '',
          category: 'Interactive',
          tags: ''
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to save component:', error);
      setError('Failed to save component to library. Please try again.');
    }
  };

  const openLibrary = () => {
    // This would typically navigate to the library tab
    // For now, we'll just show a message
    alert('Navigate to the Component Library tab to view your saved components!');
  };

  return (
    <div className="space-y-8">
      {/* API Key Warning */}
      {showApiKeyWarning && (
        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-800">API Key Not Configured</h4>
              <p className="mt-1 text-sm text-yellow-700">
                To use AI-powered code generation, you need to set up your Claude API key. 
                See the <strong>AI_SETUP.md</strong> file for instructions. 
                For now, using fallback code generation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-800">Generation Error</h4>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Save Success Message */}
      {saveSuccess && (
        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-800">Component Saved!</h4>
              <p className="mt-1 text-sm text-green-700">
                Your component has been successfully saved to the library.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="p-8 bg-white rounded-xl border shadow-sm border-brand-200">
        <h3 className="mb-6 text-xl font-semibold text-accent-700">AI Code Generator</h3>
        <div className="space-y-6">
          <div>
            <label className="block mb-3 text-sm font-semibold text-brand-700">
              Component Type
            </label>
            <select 
              className="p-3 w-full bg-white rounded-xl border transition-all duration-200 border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent text-accent-700"
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
            >
              {componentOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-3 text-sm font-semibold text-brand-700">
              Framework
            </label>
            <select 
              className="p-3 w-full bg-white rounded-xl border transition-all duration-200 border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent text-accent-700"
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
            >
              {frameworkOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-3 text-sm font-semibold text-brand-700">
              Styling Approach
            </label>
            <select 
              className="p-3 w-full bg-white rounded-xl border transition-all duration-200 border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent text-accent-700"
              value={selectedStyling}
              onChange={(e) => setSelectedStyling(e.target.value)}
            >
              {stylingOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div className="p-6 rounded-xl border bg-brand-50 border-brand-200">
            <h4 className="mb-3 font-semibold text-accent-700">Generation Preview</h4>
            <p className="text-brand-700">
              Will generate: <strong className="text-accent-700">{selectedComponent}</strong> component using <strong className="text-accent-700">{selectedFramework}</strong> with <strong className="text-accent-700">{selectedStyling}</strong> styling
            </p>
            <div className="mt-3 text-sm text-brand-600">
              <p>Variants: {getDefaultVariants(selectedComponent).join(', ')}</p>
              <p>Category: {getComponentCategory(selectedComponent)}</p>
            </div>
          </div>
          
          <button
            onClick={generateCode}
            disabled={isGenerating}
            className="flex justify-center items-center px-6 py-4 space-x-3 w-full font-semibold text-white rounded-xl shadow-sm transition-all duration-200 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
          >
            <Wand2 className="w-5 h-5" />
            <span>{isGenerating ? 'Generating with AI...' : 'Generate Component Code'}</span>
          </button>
        </div>
      </div>

      {generatedCode && (
        <div className="p-8 bg-white rounded-xl border shadow-sm border-brand-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-accent-700">Generated Code</h3>
            <div className="flex items-center space-x-3 text-sm text-brand-600">
              <div className="p-1 bg-green-100 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <span>{import.meta.env.VITE_CLAUDE_API_KEY ? 'Generated by Claude API & Mirabelle' : 'Generated with Fallback'}</span>
            </div>
          </div>
          
          <div className="overflow-x-auto p-6 max-h-96 font-mono text-sm text-green-400 rounded-xl border bg-brand-900 border-brand-800">
            <pre className="whitespace-pre-wrap">{generatedCode}</pre>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <button 
              onClick={copyToClipboard}
              data-copy-button
              className="flex items-center px-4 py-2 space-x-2 font-medium text-white bg-green-600 rounded-lg shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Code</span>
            </button>
            
            <button 
              onClick={handleSaveToLibrary}
              className="flex items-center px-4 py-2 space-x-2 font-medium text-white rounded-lg shadow-sm transition-all duration-200 bg-brand-600 hover:bg-brand-700 hover:shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save to Library</span>
            </button>
            
            <button 
              onClick={generateCode}
              disabled={isGenerating}
              className="flex items-center px-4 py-2 space-x-2 font-medium text-white rounded-lg shadow-sm transition-all duration-200 bg-accent-600 hover:bg-accent-700 disabled:opacity-50 hover:shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Regenerate</span>
            </button>
            
            <button 
              onClick={generateTests}
              disabled={isGenerating}
              className="px-4 py-2 font-medium rounded-lg border transition-all duration-200 border-brand-300 hover:bg-brand-50 disabled:opacity-50 text-brand-700"
            >
              Generate Tests
            </button>
            
            <button 
              onClick={openLibrary}
              className="flex items-center px-4 py-2 space-x-2 font-medium rounded-lg border transition-all duration-200 border-brand-300 hover:bg-brand-50 text-brand-700"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Library</span>
            </button>
          </div>
        </div>
      )}

      {/* Save to Library Modal */}
      {showSaveModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="p-6 mx-4 max-w-2xl bg-white rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-brand-900">Save Component to Library</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-brand-700">Component Name</label>
                <input
                  type="text"
                  value={saveForm.name}
                  onChange={(e) => setSaveForm(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 w-full rounded-lg border border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Enter component name"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-brand-700">Description</label>
                <textarea
                  value={saveForm.description}
                  onChange={(e) => setSaveForm(prev => ({ ...prev, description: e.target.value }))}
                  className="px-3 py-2 w-full rounded-lg border border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe your component"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-brand-700">Category</label>
                <select
                  value={saveForm.category}
                  onChange={(e) => setSaveForm(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 w-full rounded-lg border border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-brand-700">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={saveForm.tags}
                  onChange={(e) => setSaveForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="px-3 py-2 w-full rounded-lg border border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="e.g., button, react, tailwind"
                />
              </div>
            </div>
            
            <div className="flex mt-6 space-x-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 bg-white rounded-lg border transition-colors text-brand-700 border-brand-300 hover:bg-brand-50"
              >
                Cancel
              </button>
              <button
                onClick={saveComponentToLibrary}
                disabled={!saveForm.name.trim()}
                className="px-4 py-2 text-white rounded-lg transition-colors bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save to Library
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Code Generation Tips */}
      <div className="p-8 bg-white rounded-xl border shadow-sm border-brand-200">
        <h3 className="mb-6 text-xl font-semibold text-accent-700">Code Generation Tips</h3>
        <div className="space-y-4 text-brand-700">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-brand-500"></div>
            <p>Generated components follow accessibility best practices and include proper ARIA attributes</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-brand-500"></div>
            <p>All components are fully typed with TypeScript interfaces and JSDoc comments</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-brand-500"></div>
            <p>Components include multiple variants and size options for maximum flexibility</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-brand-500"></div>
            <p>Generated code can be regenerated with different specifications for iterative improvement</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-brand-500"></div>
            <p>Save your favorite components to the library for easy access and reuse</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator;