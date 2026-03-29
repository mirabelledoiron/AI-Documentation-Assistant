export interface Component {
  id: string;
  name: string;
  category: string;
  usage: number;
  lastUsed: Date;
  variants: string[];
  props: Record<string, any>;
}

export interface DesignToken {
  id: string;
  name: string;
  value: string;
  category: 'color' | 'typography' | 'spacing' | 'border' | 'shadow';
  description?: string;
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

export interface SavedComponent {
  id: string;
  name: string;
  code: string;
  framework: string;
  styling: string;
  category: string;
  variants: string[];
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  lastUsed: Date;
  isFavorite: boolean;
  metadata: {
    linesOfCode: number;
    hasTypeScript: boolean;
    hasAccessibility: boolean;
    hasTests: boolean;
  };
}

export interface LibraryState {
  components: SavedComponent[];
  categories: string[];
  frameworks: string[];
  stylingApproaches: string[];
  searchQuery: string;
  selectedCategory: string | null;
  selectedFramework: string | null;
  selectedStyling: string | null;
  sortBy: 'name' | 'createdAt' | 'updatedAt' | 'usageCount' | 'lastUsed';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
  showFavoritesOnly: boolean;
}

export interface ComponentLibraryProps {
  onComponentSelect: (component: SavedComponent) => void;
  onComponentEdit: (component: SavedComponent) => void;
  onComponentDelete: (componentId: string) => void;
  onComponentDuplicate: (component: SavedComponent) => void;
}