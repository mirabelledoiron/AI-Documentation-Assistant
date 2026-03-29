import type { SavedComponent, LibraryState } from '../types';

class LibraryService {
  private readonly STORAGE_KEY = 'component_library';
  private readonly MAX_COMPONENTS = 1000; // Prevent unlimited storage

  // Initialize library with default state
  private getDefaultState(): LibraryState {
    return {
      components: [],
      categories: ['Interactive', 'Layout', 'Form', 'Navigation', 'Feedback', 'Display', 'Overlay'],
      frameworks: ['React + TypeScript', 'React + JavaScript', 'Vue 3 + TypeScript', 'Vue 3 + JavaScript', 'Angular + TypeScript', 'Svelte + TypeScript', 'Vanilla JavaScript'],
      stylingApproaches: ['Tailwind CSS', 'CSS Modules', 'Styled Components', 'Emotion', 'SASS/SCSS', 'CSS-in-JS', 'Vanilla CSS'],
      searchQuery: '',
      selectedCategory: null,
      selectedFramework: null,
      selectedStyling: null,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      viewMode: 'grid',
      showFavoritesOnly: false
    };
  }

  // Load library state from localStorage
  loadLibrary(): LibraryState {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.components = parsed.components.map((comp: any) => ({
          ...comp,
          createdAt: new Date(comp.createdAt),
          updatedAt: new Date(comp.updatedAt),
          lastUsed: new Date(comp.lastUsed)
        }));
        return parsed;
      }
    } catch (error) {
      console.error('Error loading library from localStorage:', error);
    }
    return this.getDefaultState();
  }

  // Save library state to localStorage
  saveLibrary(state: LibraryState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving library to localStorage:', error);
    }
  }

  // Save a new component to the library
  saveComponent(component: Omit<SavedComponent, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'lastUsed'>): SavedComponent {
    const library = this.loadLibrary();
    
    // Check if we're at the limit
    if (library.components.length >= this.MAX_COMPONENTS) {
      // Remove oldest component
      library.components.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      library.components.shift();
    }

    const newComponent: SavedComponent = {
      ...component,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      lastUsed: new Date()
    };

    library.components.push(newComponent);
    this.saveLibrary(library);
    
    return newComponent;
  }

  // Update an existing component
  updateComponent(componentId: string, updates: Partial<SavedComponent>): SavedComponent | null {
    const library = this.loadLibrary();
    const index = library.components.findIndex(c => c.id === componentId);
    
    if (index === -1) return null;

    const updatedComponent: SavedComponent = {
      ...library.components[index],
      ...updates,
      updatedAt: new Date()
    };

    library.components[index] = updatedComponent;
    this.saveLibrary(library);
    
    return updatedComponent;
  }

  // Delete a component
  deleteComponent(componentId: string): boolean {
    const library = this.loadLibrary();
    const initialLength = library.components.length;
    
    library.components = library.components.filter(c => c.id !== componentId);
    
    if (library.components.length !== initialLength) {
      this.saveLibrary(library);
      return true;
    }
    
    return false;
  }

  // Duplicate a component
  duplicateComponent(component: SavedComponent): SavedComponent {
    const duplicatedComponent: Omit<SavedComponent, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'lastUsed'> = {
      ...component,
      name: `${component.name} (Copy)`,
      description: `${component.description} (Duplicated)`,
      isFavorite: false
    };

    return this.saveComponent(duplicatedComponent);
  }

  // Increment usage count for a component
  incrementUsage(componentId: string): void {
    const library = this.loadLibrary();
    const component = library.components.find(c => c.id === componentId);
    
    if (component) {
      component.usageCount++;
      component.lastUsed = new Date();
      this.saveLibrary(library);
    }
  }

  // Toggle favorite status
  toggleFavorite(componentId: string): void {
    const library = this.loadLibrary();
    const component = library.components.find(c => c.id === componentId);
    
    if (component) {
      component.isFavorite = !component.isFavorite;
      this.saveLibrary(library);
    }
  }

  // Search components
  searchComponents(query: string, filters: Partial<LibraryState> = {}): SavedComponent[] {
    const library = this.loadLibrary();
    let results = library.components;

    // Apply search query
    if (query.trim()) {
      const searchLower = query.toLowerCase();
      results = results.filter(comp => 
        comp.name.toLowerCase().includes(searchLower) ||
        comp.description.toLowerCase().includes(searchLower) ||
        comp.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        comp.framework.toLowerCase().includes(searchLower) ||
        comp.styling.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.selectedCategory) {
      results = results.filter(comp => comp.category === filters.selectedCategory);
    }

    // Apply framework filter
    if (filters.selectedFramework) {
      results = results.filter(comp => comp.framework === filters.selectedFramework);
    }

    // Apply styling filter
    if (filters.selectedStyling) {
      results = results.filter(comp => comp.styling === filters.selectedStyling);
    }

    // Apply favorites filter
    if (filters.showFavoritesOnly) {
      results = results.filter(comp => comp.isFavorite);
    }

    // Apply sorting
    const sortBy = filters.sortBy || library.sortBy;
    const sortOrder = filters.sortOrder || library.sortOrder;
    
    results.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'updatedAt':
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
          break;
        case 'usageCount':
          aValue = a.usageCount;
          bValue = b.usageCount;
          break;
        case 'lastUsed':
          aValue = a.lastUsed.getTime();
          bValue = b.lastUsed.getTime();
          break;
        default:
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return results;
  }

  // Get component statistics
  getLibraryStats(): {
    totalComponents: number;
    totalUsage: number;
    mostUsedComponent: SavedComponent | null;
    recentComponents: SavedComponent[];
    categoryBreakdown: Record<string, number>;
    frameworkBreakdown: Record<string, number>;
  } {
    const library = this.loadLibrary();
    const components = library.components;

    if (components.length === 0) {
      return {
        totalComponents: 0,
        totalUsage: 0,
        mostUsedComponent: null,
        recentComponents: [],
        categoryBreakdown: {},
        frameworkBreakdown: {}
      };
    }

    const totalUsage = components.reduce((sum, comp) => sum + comp.usageCount, 0);
    const mostUsedComponent = components.reduce((max, comp) => 
      comp.usageCount > max.usageCount ? comp : max
    );
    
    const recentComponents = [...components]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5);

    const categoryBreakdown = components.reduce((acc, comp) => {
      acc[comp.category] = (acc[comp.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const frameworkBreakdown = components.reduce((acc, comp) => {
      acc[comp.framework] = (acc[comp.framework] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalComponents: components.length,
      totalUsage,
      mostUsedComponent,
      recentComponents,
      categoryBreakdown,
      frameworkBreakdown
    };
  }

  // Export library data
  exportLibrary(): string {
    const library = this.loadLibrary();
    return JSON.stringify(library, null, 2);
  }

  // Import library data
  importLibrary(data: string): boolean {
    try {
      const imported = JSON.parse(data);
      
      // Validate the imported data structure
      if (!imported.components || !Array.isArray(imported.components)) {
        throw new Error('Invalid library data structure');
      }

      // Convert date strings to Date objects
      imported.components = imported.components.map((comp: any) => ({
        ...comp,
        createdAt: new Date(comp.createdAt || Date.now()),
        updatedAt: new Date(comp.updatedAt || Date.now()),
        lastUsed: new Date(comp.lastUsed || Date.now())
      }));

      this.saveLibrary(imported);
      return true;
    } catch (error) {
      console.error('Error importing library:', error);
      return false;
    }
  }

  // Clear all components
  clearLibrary(): void {
    const defaultState = this.getDefaultState();
    this.saveLibrary(defaultState);
  }

  // Generate unique ID
  private generateId(): string {
    return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const libraryService = new LibraryService();
