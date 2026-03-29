import { useState } from 'react';
import { Wand2, CheckCircle, Copy, RotateCcw } from 'lucide-react';
import { aiService } from '../services/aiService';

interface CodeGeneratorProps {
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ isGenerating, setIsGenerating }) => {
  const [selectedComponent, setSelectedComponent] = useState('Button');
  const [selectedFramework, setSelectedFramework] = useState('React + TypeScript');
  const [selectedStyling, setSelectedStyling] = useState('Tailwind CSS');
  const [generatedCode, setGeneratedCode] = useState('');

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

  const generateCode = async () => {
    setIsGenerating(true);
    
    try {
      const code = await aiService.generateComponentCode({
        componentName: selectedComponent,
        framework: selectedFramework.toLowerCase().replace(/\s+/g, '-'),
        styling: selectedStyling.toLowerCase().replace(/\s+/g, '-')
      });
      
      setGeneratedCode(code);
    } catch (error) {
      console.error('Code generation failed:', error);
      setGeneratedCode(`// Error generating code: ${error instanceof Error ? error.message : 'Unknown error'}\n// Try again or check your connection.`);
    }
    
    setIsGenerating(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      alert('Code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy code:', error);
      alert('Failed to copy code. Please select and copy manually.');
    }
  };

  const generateTests = async () => {
    setIsGenerating(true);
    
    try {
      const testCode = await aiService.generateComponentCode({
        componentName: `${selectedComponent} Tests`,
        framework: selectedFramework.toLowerCase().replace(/\s+/g, '-'),
        styling: 'jest-testing-library'
      });
      
      setGeneratedCode(testCode);
    } catch (error) {
      console.error('Test generation failed:', error);
      setGeneratedCode(`// Error generating tests: ${error instanceof Error ? error.message : 'Unknown error'}\n// Try again or check your connection.`);
    }
    
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8">
      <div className="p-8 bg-white rounded-xl border shadow-sm border-brand-200">
        <h3 className="mb-6 text-xl font-semibold text-accent-700">My AI Code Generator</h3>
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
              <span>Generated by Claude AI</span>
            </div>
          </div>
          
          <div className="overflow-x-auto p-6 max-h-96 font-mono text-sm text-green-400 rounded-xl border bg-brand-900 border-brand-800">
            <pre className="whitespace-pre-wrap">{generatedCode}</pre>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <button 
              onClick={copyToClipboard}
              className="flex items-center px-4 py-2 space-x-2 font-medium text-white bg-green-600 rounded-lg shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Code</span>
            </button>
            
            <button 
              onClick={generateCode}
              disabled={isGenerating}
              className="flex items-center px-4 py-2 space-x-2 font-medium text-white rounded-lg shadow-sm transition-all duration-200 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 hover:shadow-md"
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
            
            <button className="px-4 py-2 font-medium rounded-lg border transition-all duration-200 border-brand-300 hover:bg-brand-50 text-brand-700">
              Save to Library
            </button>
            
            <button className="px-4 py-2 font-medium rounded-lg border transition-all duration-200 border-brand-300 hover:bg-brand-50 text-brand-700">
              Export Files
            </button>
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
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator;