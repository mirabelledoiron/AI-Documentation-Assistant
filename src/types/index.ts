export interface Component {
  name: string;
  category: string;
  usage: number;
  lastUpdated: string;
  status: 'stable' | 'beta' | 'deprecated';
  accessibility: 'AA' | 'AAA';
  variants: string[];
}

export interface DesignToken {
  name: string;
  value: string;
  category: 'colors' | 'spacing' | 'typography' | 'borders' | 'shadows';
  usage?: number;
}

export interface AIInsight {
  type: 'optimization' | 'accessibility' | 'consistency' | 'maintenance';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  savings?: string;
  action?: string;
}

export interface AnalysisResults {
  coverage: number;
  accessibility: number;
  consistency: number;
  maintenance: number;
  recommendations: string[];
}

export interface CodeGenerationRequest {
  componentName: string;
  framework: string;
  styling: string;
}

export interface CodeGenerationResponse {
  code: string;
  framework: string;
  styling: string;
  componentName: string;
}