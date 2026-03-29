import { useState, useEffect } from 'react';
import { 
  Search, 
  Grid3X3, 
  List, 
  Star, 
  StarOff, 
  Copy, 
  Edit, 
  Trash2, 
  Download, 
  Upload, 
  Eye,
  Code,
  Calendar,
  Zap,
  Tag,
  Palette
} from 'lucide-react';
import { libraryService } from '../services/libraryService';
import type { SavedComponent, LibraryState } from '../types';

interface ComponentLibraryProps {
  onComponentSelect: (component: SavedComponent) => void;
  onComponentEdit: (component: SavedComponent) => void;
  onComponentDelete: (componentId: string) => void;
  onComponentDuplicate: (component: SavedComponent) => void;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onComponentSelect,
  onComponentEdit,
  onComponentDuplicate
}) => {
  const [library, setLibrary] = useState<LibraryState>(libraryService.loadLibrary());
  const [filteredComponents, setFilteredComponents] = useState<SavedComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<SavedComponent | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState('');

  useEffect(() => {
    const components = libraryService.searchComponents(library.searchQuery, library);
    setFilteredComponents(components);
  }, [library]);

  const handleSearch = (query: string) => {
    setLibrary(prev => ({ ...prev, searchQuery: query }));
  };

  const handleFilterChange = (filterType: keyof LibraryState, value: unknown) => {
    setLibrary(prev => ({ ...prev, [filterType]: value }));
  };

  const handleSort = (sortBy: LibraryState['sortBy']) => {
    setLibrary(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleToggleViewMode = () => {
    setLibrary(prev => ({
      ...prev,
      viewMode: prev.viewMode === 'grid' ? 'list' : 'grid'
    }));
  };

  const handleToggleFavorites = () => {
    setLibrary(prev => ({
      ...prev,
      showFavoritesOnly: !prev.showFavoritesOnly
    }));
  };

  const handleToggleFavorite = (componentId: string) => {
    libraryService.toggleFavorite(componentId);
    setLibrary(libraryService.loadLibrary());
  };

  const handleDuplicate = (component: SavedComponent) => {
    const duplicated = libraryService.duplicateComponent(component);
    setLibrary(libraryService.loadLibrary());
    onComponentDuplicate(duplicated);
  };

  const handleDelete = (componentId: string) => {
    if (libraryService.deleteComponent(componentId)) {
      setLibrary(libraryService.loadLibrary());
      setShowDeleteConfirm(null);
      if (selectedComponent?.id === componentId) {
        setSelectedComponent(null);
      }
    }
  };

  const handleExport = () => {
    const data = libraryService.exportLibrary();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `component-library-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (libraryService.importLibrary(importData)) {
      setLibrary(libraryService.loadLibrary());
      setShowImportModal(false);
      setImportData('');
    }
  };

  const stats = libraryService.getLibraryStats();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(date);
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="p-6 bg-white rounded-xl border shadow-sm border-brand-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-brand-900">Component Library</h2>
            <p className="text-brand-600 mt-1">Manage and organize your generated components</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 space-x-2 font-medium text-white bg-brand-600 rounded-lg shadow-sm transition-all duration-200 hover:bg-brand-700 hover:shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center px-4 py-2 space-x-2 font-medium text-white bg-accent-600 rounded-lg shadow-sm transition-all duration-200 hover:bg-accent-700 hover:shadow-md"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-brand-50 rounded-lg border border-brand-200">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-brand-600" />
              <span className="text-sm font-medium text-brand-700">Total</span>
            </div>
            <p className="text-2xl font-bold text-brand-900 mt-1">{stats.totalComponents}</p>
          </div>
          
          <div className="p-4 bg-accent-50 rounded-lg border border-accent-200">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-accent-600" />
              <span className="text-sm font-medium text-accent-700">Usage</span>
            </div>
            <p className="text-2xl font-bold text-accent-900 mt-1">{stats.totalUsage}</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Favorites</span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {library.components.filter(c => c.isFavorite).length}
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Recent</span>
            </div>
            <p className="text-2xl font-bold text-purple-900 mt-1">
              {stats.recentComponents.length}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 bg-white rounded-xl border shadow-sm border-brand-200">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={library.searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-white rounded-lg border transition-all duration-200 border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent text-brand-900"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <select
              value={library.selectedCategory || ''}
              onChange={(e) => handleFilterChange('selectedCategory', e.target.value || null)}
              className="px-3 py-2 bg-white rounded-lg border transition-all duration-200 border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent text-brand-700"
            >
              <option value="">All Categories</option>
              {library.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={library.selectedFramework || ''}
              onChange={(e) => handleFilterChange('selectedFramework', e.target.value || null)}
              className="px-3 py-2 bg-white rounded-lg border transition-all duration-200 border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent text-brand-700"
            >
              <option value="">All Frameworks</option>
              {library.frameworks.map(framework => (
                <option key={framework} value={framework}>{framework}</option>
              ))}
            </select>

            <select
              value={library.selectedStyling || ''}
              onChange={(e) => handleFilterChange('selectedStyling', e.target.value || null)}
              className="px-3 py-2 bg-white rounded-lg border transition-all duration-200 border-brand-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent text-brand-700"
            >
              <option value="">All Styling</option>
              {library.stylingApproaches.map(styling => (
                <option key={styling} value={styling}>{styling}</option>
              ))}
            </select>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleFavorites}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                library.showFavoritesOnly
                  ? 'bg-yellow-100 border-yellow-300 text-yellow-700'
                  : 'bg-white border-brand-200 text-brand-600 hover:bg-brand-50'
              }`}
              title="Show favorites only"
            >
              <Star className="w-4 h-4" />
            </button>

            <button
              onClick={handleToggleViewMode}
              className="p-2 bg-white rounded-lg border transition-all duration-200 border-brand-200 text-brand-600 hover:bg-brand-50"
              title={`Switch to ${library.viewMode === 'grid' ? 'list' : 'grid'} view`}
            >
              {library.viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-brand-200">
          <span className="text-sm font-medium text-brand-700">Sort by:</span>
          {(['name', 'createdAt', 'updatedAt', 'usageCount', 'lastUsed'] as const).map(sortOption => (
            <button
              key={sortOption}
              onClick={() => handleSort(sortOption)}
              className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
                library.sortBy === sortOption
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-brand-600 hover:bg-brand-50 border border-brand-200'
              }`}
            >
              {sortOption === 'createdAt' && 'Created'}
              {sortOption === 'updatedAt' && 'Updated'}
              {sortOption === 'usageCount' && 'Usage'}
              {sortOption === 'lastUsed' && 'Last Used'}
              {sortOption === 'name' && 'Name'}
              {library.sortBy === sortOption && (
                <span className="ml-1">
                  {library.sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Components Grid/List */}
      <div className="p-6 bg-white rounded-xl border shadow-sm border-brand-200">
        {filteredComponents.length === 0 ? (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-brand-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-brand-700 mb-2">No components found</h3>
            <p className="text-brand-500">
              {library.searchQuery || library.selectedCategory || library.selectedFramework || library.selectedStyling
                ? 'Try adjusting your search or filters'
                : 'Start by generating some components in the AI Generator tab'
              }
            </p>
          </div>
        ) : (
          <div className={library.viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredComponents.map(component => (
              <div
                key={component.id}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md ${
                  selectedComponent?.id === component.id
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-brand-200 bg-white hover:border-brand-300'
                }`}
                onClick={() => setSelectedComponent(component)}
              >
                {/* Component Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-brand-900 mb-1">{component.name}</h3>
                    <p className="text-sm text-brand-600 line-clamp-2">{component.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(component.id);
                    }}
                    className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-brand-100 transition-colors"
                  >
                    {component.isFavorite ? (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    ) : (
                      <StarOff className="w-4 h-4 text-brand-400" />
                    )}
                  </button>
                </div>

                {/* Component Meta */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center space-x-2 text-xs text-brand-600">
                    <Code className="w-3 h-3" />
                    <span>{component.framework}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-brand-600">
                    <Palette className="w-3 h-3" />
                    <span>{component.styling}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-brand-600">
                    <Tag className="w-3 h-3" />
                    <span>{component.category}</span>
                  </div>
                </div>

                {/* Component Stats */}
                <div className="flex items-center justify-between text-xs text-brand-500 mb-3">
                  <span>Used {component.usageCount} times</span>
                  <span>{formatRelativeTime(component.lastUsed)}</span>
                </div>

                {/* Component Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onComponentSelect(component);
                    }}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-brand-600 rounded-md transition-colors hover:bg-brand-700"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onComponentEdit(component);
                    }}
                    className="p-2 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-md transition-colors"
                    title="Edit component"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate(component);
                    }}
                    className="p-2 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-md transition-colors"
                    title="Duplicate component"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(component.id);
                    }}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete component"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-brand-900 mb-4">Delete Component</h3>
            <p className="text-brand-600 mb-6">
              Are you sure you want to delete this component? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-brand-700 bg-white border border-brand-300 rounded-lg hover:bg-brand-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-brand-900 mb-4">Import Component Library</h3>
            <p className="text-brand-600 mb-4">
              Paste your exported component library JSON data below:
            </p>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste JSON data here..."
              className="w-full h-48 p-3 border border-brand-200 rounded-lg font-mono text-sm resize-none"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-brand-700 bg-white border border-brand-300 rounded-lg hover:bg-brand-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!importData.trim()}
                className="px-4 py-2 text-white bg-accent-600 rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentLibrary;