import type { Component } from '../types';
import { aiService } from './aiService';

interface StorybookStory {
  id: string;
  name: string;
  kind: string;
  parameters?: {
    docs?: {
      description?: string;
    };
    controls?: {
      matchers?: Record<string, unknown>;
    };
    design?: {
      type?: string;
      url?: string;
    };
  };
}

interface StorybookStoriesResponse {
  stories: Record<string, StorybookStory>;
}

interface ComponentDetails {
  name: string;
  category: string;
  description?: string;
  designUrl?: string;
  stories: StorybookStory[];
  variants: string[];
  usage: number;
  lastUpdated: string;
  status: 'stable' | 'beta' | 'deprecated';
  accessibility: 'AA' | 'AAA';
}

class StorybookService {
  private storybookUrl: string = 'https://687a614558f8de72c52bf829-wboedldegu.chromatic.com';
  private isConnected: boolean = false;
  private componentCache: Map<string, ComponentDetails> = new Map();

  async fetchStories(): Promise<Component[]> {
    try {
      this.isConnected = await this.checkStorybookConnection();
      
      if (this.isConnected) {
        console.log('Connected to Storybook - fetching components');
        const components = await this.getStorybookData();
        return this.transformToComponentArray(components);
      } else {
        console.log('Storybook not available - using fallback data');
        return this.getFallbackData();
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      this.isConnected = false;
      return this.getFallbackData();
    }
  }

  async getComponentDetails(componentName: string): Promise<ComponentDetails | null> {
    // Check cache first
    if (this.componentCache.has(componentName)) {
      return this.componentCache.get(componentName)!;
    }

    try {
      const response = await fetch(`${this.storybookUrl}/stories.json`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: StorybookStoriesResponse = await response.json();
      const componentDetails = this.extractComponentDetails(data, componentName);
      
      if (componentDetails) {
        this.componentCache.set(componentName, componentDetails);
      }
      
      return componentDetails;
    } catch (error) {
      console.error('Error fetching component details:', error);
      return null;
    }
  }

  async generateComponentCode(componentName: string, framework: string = 'react-typescript', styling: string = 'tailwind-css'): Promise<string> {
    const componentDetails = await this.getComponentDetails(componentName);
    
    if (!componentDetails) {
      throw new Error(`Component ${componentName} not found`);
    }

    try {
      // Use the existing AI service instead of making our own API call
      const code = await aiService.generateComponentCode({
        componentName,
        framework,
        styling,
        componentDetails: {
          variants: componentDetails.variants,
          description: componentDetails.description,
          category: componentDetails.category
        }
      });
      
      return code;
    } catch (error) {
      console.error('Code generation failed:', error);
      throw new Error('Failed to generate code. Try again.');
    }
  }

  openComponentDocs(componentName: string): void {
    const encodedName = encodeURIComponent(componentName);
    const docsUrl = `${this.storybookUrl}/?path=/docs/${encodedName.toLowerCase()}-${encodedName.toLowerCase()}--docs`;
    window.open(docsUrl, '_blank');
  }

  openComponentStory(componentName: string, variant?: string): void {
    const encodedName = encodeURIComponent(componentName);
    let storyUrl = `${this.storybookUrl}/?path=/story/${encodedName.toLowerCase()}-${encodedName.toLowerCase()}`;
    
    if (variant) {
      storyUrl += `--${variant.toLowerCase().replace(/\s+/g, '-')}`;
    }
    
    window.open(storyUrl, '_blank');
  }

  private async checkStorybookConnection(): Promise<boolean> {
    try {
      // Try to fetch the main Storybook page to check if it's accessible
      const response = await fetch(`${this.storybookUrl}/iframe.html`);
      return response.ok;
    } catch (error) {
      console.error('Storybook connection check failed:', error);
      return false;
    }
  }

  private async getStorybookData(): Promise<ComponentDetails[]> {
    try {
      // Fetch the main stories data from Storybook
      const response = await fetch(`${this.storybookUrl}/stories.json`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: StorybookStoriesResponse = await response.json();
      
      // Transform Storybook data to our Component format
      const components = this.transformStorybookData(data);
      
      if (components.length === 0) {
        console.log('No components found in Storybook, using fallback data');
        return [];
      }
      
      return components;
    } catch (error) {
      console.error('Error fetching Storybook data:', error);
      return [];
    }
  }

  private transformStorybookData(data: StorybookStoriesResponse): ComponentDetails[] {
    const componentMap = new Map<string, ComponentDetails>();
    
    Object.values(data.stories).forEach((story) => {
      const category = this.extractCategory(story.kind);
      const componentName = this.extractComponentName(story.kind);
      
      if (!componentMap.has(componentName)) {
        componentMap.set(componentName, {
          name: componentName,
          category: category,
          description: story.parameters?.docs?.description,
          designUrl: story.parameters?.design?.url,
          stories: [],
          variants: [],
          usage: Math.floor(Math.random() * 30) + 70, // Random usage between 70-100
          lastUpdated: this.getRandomLastUpdated(),
          status: 'stable' as const,
          accessibility: Math.random() > 0.3 ? 'AAA' : 'AA'
        });
      }
      
      const component = componentMap.get(componentName)!;
      component.stories.push(story);
      
      // Add variant if it's a different story for the same component
      const variant = this.extractVariantName(story.name);
      if (variant && !component.variants.includes(variant)) {
        component.variants.push(variant);
      }
    });
    
    return Array.from(componentMap.values());
  }

  private extractComponentDetails(data: StorybookStoriesResponse, componentName: string): ComponentDetails | null {
    const componentStories = Object.values(data.stories).filter(story => 
      this.extractComponentName(story.kind) === componentName
    );
    
    if (componentStories.length === 0) {
      return null;
    }
    
    const firstStory = componentStories[0];
    const category = this.extractCategory(firstStory.kind);
    const variants = componentStories.map(story => this.extractVariantName(story.name));
    
    return {
      name: componentName,
      category: category,
      description: firstStory.parameters?.docs?.description,
      designUrl: firstStory.parameters?.design?.url,
      stories: componentStories,
      variants: variants,
      usage: Math.floor(Math.random() * 30) + 70,
      lastUpdated: this.getRandomLastUpdated(),
      status: 'stable' as const,
      accessibility: Math.random() > 0.3 ? 'AAA' : 'AA'
    };
  }

  private transformToComponentArray(components: ComponentDetails[]): Component[] {
    return components.map(comp => ({
      name: comp.name,
      category: comp.category,
      usage: comp.usage,
      lastUpdated: comp.lastUpdated,
      status: comp.status,
      accessibility: comp.accessibility,
      variants: comp.variants
    }));
  }

  private extractCategory(kind: string): string {
    // Extract category from story kind (e.g., "Design System/Button" -> "Design System")
    const parts = kind.split('/');
    if (parts.length > 1) {
      return parts[0];
    }
    return 'Components';
  }

  private extractComponentName(kind: string): string {
    // Extract component name from story kind (e.g., "Design System/Button" -> "Button")
    const parts = kind.split('/');
    return parts[parts.length - 1] || kind;
  }

  private extractVariantName(storyName: string): string {
    // Extract variant name from story name (e.g., "Primary" from "Button/Primary")
    const parts = storyName.split('/');
    return parts[parts.length - 1] || storyName;
  }

  private getRandomLastUpdated(): string {
    const options = ['Today', '1 day ago', '2 days ago', '1 week ago', '2 weeks ago'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private getComponentSpecifications(componentName: string, details?: ComponentDetails): string {
    const baseSpecs: Record<string, string> = {
      'Button': '- Should support different variants (primary, secondary, ghost, danger)\n- Should support different sizes\n- Should handle loading states\n- Should support icon placement',
      'Card': '- Should be composable with CardHeader, CardContent, CardFooter\n- Should support different elevations\n- Should support different border styles',
      'Modal': '- Should handle focus management\n- Should support different sizes\n- Should include backdrop click handling\n- Should support custom close behavior',
      'Input': '- Should support different input types\n- Should include error states\n- Should support helper text\n- Should include proper labeling',
      'Dropdown': '- Should support keyboard navigation\n- Should handle outside clicks\n- Should support search/filtering\n- Should support multi-select',
      'Tooltip': '- Should support multiple trigger types\n- Should handle positioning automatically\n- Should include proper delay timing\n- Should be accessible with keyboard navigation',
      'Badge': '- Should support different variants and colors\n- Should support different sizes\n- Should handle text overflow\n- Should support icon integration',
      'Alert': '- Should support different severity levels\n- Should include dismissible functionality\n- Should support custom icons\n- Should handle action buttons',
      'Accordion': '- Should support single and multiple open items\n- Should include smooth animations\n- Should handle keyboard navigation\n- Should support custom trigger content',
      'Tabs': '- Should support horizontal and vertical orientations\n- Should handle keyboard navigation\n- Should support disabled states\n- Should include proper ARIA attributes'
    };

    let specs = baseSpecs[componentName] || '- Should follow standard component patterns\n- Should include proper accessibility features';
    
    if (details?.variants.length) {
      specs += `\n- Should support variants: ${details.variants.join(', ')}`;
    }
    
    if (details?.description) {
      specs += `\n- Component description: ${details.description}`;
    }
    
    return specs;
  }

  private getFallbackData(): Component[] {
    return [
      {
        name: 'Button',
        category: 'Interactive',
        usage: 89,
        lastUpdated: '2 days ago',
        status: 'stable',
        accessibility: 'AA',
        variants: ['primary', 'secondary', 'ghost', 'danger']
      },
      {
        name: 'Card',
        category: 'Layout',
        usage: 76,
        lastUpdated: '1 week ago',
        status: 'stable',
        accessibility: 'AAA',
        variants: ['default', 'elevated', 'outlined']
      }
    ];
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getStorybookUrl(): string {
    return this.storybookUrl;
  }

  async openStorybook(): Promise<void> {
    window.open(this.storybookUrl, '_blank');
  }
}

export const storybookService = new StorybookService();