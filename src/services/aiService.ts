import type { Component, DesignToken, AnalysisResults, CodeGenerationRequest } from '../types';

interface EnhancedCodeGenerationRequest extends CodeGenerationRequest {
  componentDetails?: {
    variants: string[];
    description?: string;
    category: string;
  };
}

class AIService {
  private async callClaudeAPI(prompt: string, maxTokens: number = 2000): Promise<string> {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_CLAUDE_API_KEY || "",
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: maxTokens,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw error;
    }
  }

  async generateComponentCode({ componentName, framework, styling, componentDetails }: EnhancedCodeGenerationRequest): Promise<string> {
    // Debug: Log environment variable status
    console.log('Environment check:', {
      hasApiKey: !!import.meta.env.VITE_CLAUDE_API_KEY,
      apiKeyLength: import.meta.env.VITE_CLAUDE_API_KEY?.length || 0,
      apiKeyPrefix: import.meta.env.VITE_CLAUDE_API_KEY?.substring(0, 7) || 'none'
    });
    
    // Check if API key is available
    if (!import.meta.env.VITE_CLAUDE_API_KEY) {
      console.warn('No Claude API key found. Using fallback code generation.');
      return this.generateFallbackCode(componentName, framework, styling, componentDetails);
    }

    const prompt = `Create a production-ready ${componentName} component for a design system.
    
Requirements:
- Framework: ${framework}
- Styling: ${styling}
- Component: ${componentName}
- Follow modern React best practices
- Include proper TypeScript types
- Ensure accessibility compliance
- Use semantic HTML elements
- Include proper error handling
- Follow the existing design system patterns

Component Specifications:
${this.getComponentSpecifications(componentName, componentDetails)}

Generate clean, production-ready code for your design system. Only respond with the code, no explanations.`;

    try {
      const code = await this.callClaudeAPI(prompt);
      
      // Clean up any markdown code blocks
      return code.replace(/```[a-zA-Z]*\n?/g, '').replace(/```\n?/g, '').trim();
    } catch (error) {
      console.warn('AI code generation failed, using fallback:', error);
      return this.generateFallbackCode(componentName, framework, styling, componentDetails);
    }
  }

  async analyzeDesignSystem(components: Component[], tokens: DesignToken[]): Promise<AnalysisResults> {
    const systemData = {
      components,
      tokens,
      totalComponents: components.length,
      avgUsage: Math.round(components.reduce((acc, comp) => acc + comp.usage, 0) / components.length)
    };

    const prompt = `Analyze this design system and provide actionable insights:

Design System Data:
${JSON.stringify(systemData, null, 2)}

Analyze and provide:
1. Coverage score (0-100) - how well components cover common UI needs
2. Accessibility score (0-100) - overall accessibility compliance
3. Consistency score (0-100) - how consistent the system is
4. Maintenance score (0-100) - how maintainable the system is
5. 3-5 specific, actionable recommendations for improvement

Respond with ONLY valid JSON in this exact format:
{
  "coverage": number,
  "accessibility": number,
  "consistency": number,
  "maintenance": number,
  "recommendations": ["rec1", "rec2", "rec3"]
}

DO NOT OUTPUT ANYTHING OTHER THAN VALID JSON.`;

    try {
      const response = await this.callClaudeAPI(prompt, 1000);
      
      // Clean up any markdown or extra text
      const cleanResponse = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      return JSON.parse(cleanResponse);
    } catch (error) {
      // Fallback to mock data if API fails
      console.warn('AI analysis failed, using fallback data:', error);
      return {
        coverage: 87,
        accessibility: 92,
        consistency: 78,
        maintenance: 85,
        recommendations: [
          'API temporarily unavailable - showing sample analysis',
          'Standardize focus states across all interactive components',
          'Implement automated testing for design token usage'
        ]
      };
    }
  }

  private getComponentSpecifications(componentName: string, componentDetails?: { variants: string[]; description?: string; category: string }): string {
    const baseSpecs: Record<string, string> = {
      'Button': '- Should support different variants (primary, secondary, ghost, danger)\n- Should support different sizes (sm, md, lg)\n- Should handle loading states\n- Should support icon placement (left, right)\n- Should include proper focus states and accessibility\n- Should support disabled states',
      'Card': '- Should be composable with CardHeader, CardContent, CardFooter\n- Should support different elevations (flat, raised, floating)\n- Should support different border styles and radius\n- Should handle hover and focus states\n- Should support custom padding and spacing',
      'Modal': '- Should handle focus management and trap focus\n- Should support different sizes (sm, md, lg, full)\n- Should include backdrop click handling\n- Should support custom close behavior\n- Should include proper ARIA attributes\n- Should support custom content and actions',
      'Input': '- Should support different input types (text, email, password, number)\n- Should include error states and validation\n- Should support helper text and error messages\n- Should include proper labeling and accessibility\n- Should support different sizes and variants\n- Should handle focus and hover states',
      'Dropdown': '- Should support keyboard navigation (arrow keys, enter, escape)\n- Should handle outside clicks and focus management\n- Should support search/filtering functionality\n- Should support multi-select options\n- Should include proper ARIA attributes\n- Should support custom trigger elements',
      'Tooltip': '- Should support multiple trigger types (hover, focus, click)\n- Should handle positioning automatically (top, bottom, left, right)\n- Should include proper delay timing and animations\n- Should be accessible with keyboard navigation\n- Should support custom content and styling',
      'Badge': '- Should support different variants and colors (success, warning, error, info)\n- Should support different sizes (sm, md, lg)\n- Should handle text overflow gracefully\n- Should support icon integration\n- Should include proper contrast ratios\n- Should support custom styling',
      'Alert': '- Should support different severity levels (info, success, warning, error)\n- Should include dismissible functionality\n- Should support custom icons for each level\n- Should handle action buttons and links\n- Should include proper ARIA roles and attributes\n- Should support different layouts and styles',
      'Accordion': '- Should support single and multiple open items\n- Should include smooth animations and transitions\n- Should handle keyboard navigation properly\n- Should support custom trigger content and styling\n- Should include proper ARIA attributes\n- Should support different variants and themes',
      'Tabs': '- Should support horizontal and vertical orientations\n- Should handle keyboard navigation (arrow keys, home, end)\n- Should support disabled states and proper styling\n- Should include proper ARIA attributes and roles\n- Should support custom tab content and styling\n- Should handle dynamic tab addition/removal',
      'Checkbox': '- Should support different sizes and variants\n- Should include proper labeling and accessibility\n- Should handle indeterminate states\n- Should support custom styling and themes\n- Should include proper focus states\n- Should support form integration',
      'Radio': '- Should support different sizes and variants\n- Should include proper grouping and accessibility\n- Should handle selection states correctly\n- Should support custom styling and themes\n- Should include proper focus states\n- Should support form integration'
    };

    const specificSpecs: Record<string, string> = {};
    if (componentDetails) {
      if (componentDetails.variants && componentDetails.variants.length > 0) {
        specificSpecs['variants'] = `- Should support variants: ${componentDetails.variants.join(', ')}`;
      }
      if (componentDetails.description) {
        specificSpecs['description'] = `- Description: ${componentDetails.description}`;
      }
      if (componentDetails.category) {
        specificSpecs['category'] = `- Category: ${componentDetails.category}`;
      }
    }

    const allSpecs = { ...baseSpecs, ...specificSpecs };
    return allSpecs[componentName] || '- Should follow standard component patterns\n- Should include proper accessibility features\n- Should support customization and theming\n- Should handle edge cases gracefully';
  }

  private generateFallbackCode(componentName: string, framework: string, styling: string, componentDetails?: { variants: string[]; description?: string; category: string }): string {
    const variants = componentDetails?.variants || ['primary', 'secondary', 'ghost'];
    
    // Framework-specific code generation
    if (framework.includes('react') || framework.includes('typescript')) {
      return this.generateReactComponent(componentName, styling, variants);
    } else if (framework.includes('vue')) {
      return this.generateVueComponent(componentName, styling, variants);
    } else if (framework.includes('angular')) {
      return this.generateAngularComponent(componentName, styling, variants);
    } else if (framework.includes('svelte')) {
      return this.generateSvelteComponent(componentName, styling);
    } else {
      return this.generateVanillaComponent(componentName, styling);
    }
  }

  private generateReactComponent(componentName: string, styling: string, variants: string[]): string {
    const isTailwind = styling.toLowerCase().includes('tailwind');
    const isCssModules = styling.toLowerCase().includes('css modules');
    const isStyledComponents = styling.toLowerCase().includes('styled components');
    
    let styleImport = '';
    let classNameLogic = '';
    
    if (isCssModules) {
      styleImport = `import styles from './${componentName}.module.css';`;
      classNameLogic = `className={styles.${componentName.toLowerCase()}}`;
    } else if (isStyledComponents) {
      styleImport = `import styled from 'styled-components';`;
      classNameLogic = `className="${componentName.toLowerCase()}-component"`;
    } else if (isTailwind) {
      classNameLogic = `className="inline-flex justify-center items-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"`;
    } else {
      classNameLogic = `className="${componentName.toLowerCase()}-component"`;
    }

    return `import React, { forwardRef, ButtonHTMLAttributes } from 'react';
${styleImport}

export interface ${componentName}Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: '${variants.join("' | '")}';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const ${componentName} = forwardRef<HTMLButtonElement, ${componentName}Props>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variantClasses = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      ${variants.length > 3 ? variants.slice(3).map(v => `${v}: 'bg-${v} text-${v}-foreground hover:bg-${v}/90'`).join(',\n      ') : ''}
    };
    
    const sizeClasses = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8 text-lg'
    };

    return (
      <button
        ${classNameLogic}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading && (
          <div className="mr-2 w-4 h-4 rounded-full border-2 border-current animate-spin border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

${componentName}.displayName = '${componentName}';

export { ${componentName} };`;
  }

  private generateVueComponent(componentName: string, styling: string, variants: string[]): string {
    const isTailwind = styling.toLowerCase().includes('tailwind');
    const isScoped = styling.toLowerCase().includes('scoped');
    
    const styleTag = isScoped ? '<style scoped>' : '<style>';
    const tailwindClasses = isTailwind ? 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none' : '';

    return `<template>
  <button
    :class="[
      '${componentName.toLowerCase()}-component',
      variantClasses[variant],
      sizeClasses[size],
      { 'opacity-50 cursor-not-allowed': isLoading }
    ]"
    :disabled="isLoading"
    @click="$emit('click', $event)"
  >
    <div v-if="isLoading" class="mr-2 w-4 h-4 rounded-full border-2 border-current animate-spin border-t-transparent"></div>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: '${variants.join("' | '")}';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  isLoading: false
});

const variantClasses = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  ${variants.length > 3 ? variants.slice(3).map(v => `${v}: 'bg-${v} text-${v}-foreground hover:bg-${v}/90'`).join(',\n  ') : ''}
};

const sizeClasses = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 py-2',
  lg: 'h-11 px-8 text-lg'
};
</script>

${styleTag}
.${componentName.toLowerCase()}-component {
  ${isTailwind ? tailwindClasses : 'display: inline-flex; align-items: center; justify-content: center; border-radius: 0.375rem; font-weight: 500; transition: all 0.2s;'}
}

.${componentName.toLowerCase()}-component:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.${componentName.toLowerCase()}-component:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>`;
  }

  private generateAngularComponent(componentName: string, styling: string, variants: string[]): string {
    const isTailwind = styling.toLowerCase().includes('tailwind');
    
    return `import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-${componentName.toLowerCase()}',
  template: \`
    <button
      [class]="getClasses()"
      [disabled]="isLoading"
      (click)="onClick.emit($event)"
    >
      <div *ngIf="isLoading" class="mr-2 w-4 h-4 rounded-full border-2 border-current animate-spin border-t-transparent"></div>
      <ng-content></ng-content>
    </button>
  \`,
  styleUrls: ['./${componentName.toLowerCase()}.component.${isTailwind ? 'css' : 'scss'}']
})
export class ${componentName}Component {
  @Input() variant: '${variants.join("' | '")}' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() isLoading = false;
  
  @Output() onClick = new EventEmitter<Event>();

  getClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variantClasses = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      ${variants.length > 3 ? variants.slice(3).map(v => `${v}: 'bg-${v} text-${v}-foreground hover:bg-${v}/90'`).join(',\n      ') : ''}
    };
    
    const sizeClasses = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8 text-lg'
    };

    return \`\${baseClasses} \${variantClasses[this.variant]} \${sizeClasses[this.size]}\`;
  }
}`;
  }

  private generateSvelteComponent(_componentName: string, styling: string): string {
    const isTailwind = styling.toLowerCase().includes('tailwind');
    const isCssModules = styling.toLowerCase().includes('css modules');
    const isStyledComponents = styling.toLowerCase().includes('styled components');
    const isEmotion = styling.toLowerCase().includes('emotion');
    const isSass = styling.toLowerCase().includes('sass') || styling.toLowerCase().includes('scss');

    if (isTailwind) {
      return `<!-- Svelte Component with Tailwind CSS -->
<script>
  export let variant = 'primary';
  export let size = 'md';
  export let disabled = false;
  
  const variantClasses = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500',
    secondary: 'bg-white text-brand-700 border border-brand-300 hover:bg-brand-50 focus:ring-brand-500',
    ghost: 'text-brand-700 hover:bg-brand-100 focus:ring-brand-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  $: buttonClasses = \`\${variantClasses[variant]} \${sizeClasses[size]} \${disabled ? 'opacity-50 cursor-not-allowed' : ''} rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2\`;
</script>

<button class={buttonClasses} {disabled} on:click>
  <slot />
</button>`;
    } else if (isCssModules) {
      return `<!-- Svelte Component with CSS Modules -->
<script>
  export let variant = 'primary';
  export let size = 'md';
  export let disabled = false;
  
  import styles from './Button.module.css';
  
  $: buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled
  ].filter(Boolean).join(' ');
</script>

<button class={buttonClasses} {disabled} on:click>
  <slot />
</button>

<style>
  /* Button.module.css would contain the styles */
</style>`;
    } else if (isStyledComponents || isEmotion) {
      return `<!-- Svelte Component with CSS-in-JS approach -->
<script>
  export let variant = 'primary';
  export let size = 'md';
  export let disabled = false;
  
  // Note: Svelte doesn't have styled-components, but you can use CSS-in-JS libraries
  // This is a conceptual example showing the structure
</script>

<button class="button {variant} {size}" class:disabled {disabled} on:click>
  <slot />
</button>

<style>
  .button {
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
  }
  
  .button.primary {
    background-color: #29405A;
    color: white;
  }
  
  .button.secondary {
    background-color: white;
    color: #29405A;
    border: 1px solid #cbd5e1;
  }
  
  .button.ghost {
    background-color: transparent;
    color: #29405A;
  }
  
  .button.sm { padding: 0.375rem 0.75rem; font-size: 0.875rem; }
  .button.md { padding: 0.5rem 1rem; font-size: 1rem; }
  .button.lg { padding: 0.75rem 1.5rem; font-size: 1.125rem; }
  
  .button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>`;
    } else if (isSass) {
      return `<!-- Svelte Component with SASS/SCSS -->
<script>
  export let variant = 'primary';
  export let size = 'md';
  export let disabled = false;
</script>

<button class="button button--{variant} button--{size}" class:disabled {disabled} on:click>
  <slot />
</button>

<style lang="scss">
  .button {
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
    
    &--primary {
      background-color: #29405A;
      color: white;
      
      &:hover:not(.disabled) {
        background-color: #395A7E;
      }
    }
    
    &--secondary {
      background-color: white;
      color: #29405A;
      border: 1px solid #cbd5e1;
      
      &:hover:not(.disabled) {
        background-color: #f8fafc;
      }
    }
    
    &--ghost {
      background-color: transparent;
      color: #29405A;
      
      &:hover:not(.disabled) {
        background-color: #f1f5f9;
      }
    }
    
    &--sm { padding: 0.375rem 0.75rem; font-size: 0.875rem; }
    &--md { padding: 0.5rem 1rem; font-size: 1rem; }
    &--lg { padding: 0.75rem 1.5rem; font-size: 1.125rem; }
    
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
</style>`;
    } else {
      return `<!-- Svelte Component with Vanilla CSS -->
<script>
  export let variant = 'primary';
  export let size = 'md';
  export let disabled = false;
</script>

<button class="button button--{variant} button--{size}" class:disabled {disabled} on:click>
  <slot />
</button>

<style>
  .button {
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
  }
  
  .button--primary {
    background-color: #29405A;
    color: white;
  }
  
  .button--secondary {
    background-color: white;
    color: #29405A;
    border: 1px solid #cbd5e1;
  }
  
  .button--ghost {
    background-color: transparent;
    color: #29405A;
  }
  
  .button--sm { padding: 0.375rem 0.75rem; font-size: 0.875rem; }
  .button--md { padding: 0.5rem 1rem; font-size: 1rem; }
  .button--lg { padding: 0.75rem 1.5rem; font-size: 1.125rem; }
  
  .button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>`;
    }
  }

  private generateVanillaComponent(componentName: string, styling: string): string {
    return `// ${componentName} Component for Vanilla JavaScript with ${styling}

class ${componentName} {
  constructor(options = {}) {
    this.variant = options.variant || 'primary';
    this.size = options.size || 'md';
    this.isLoading = options.isLoading || false;
    this.onClick = options.onClick || (() => {});
    
    this.element = this.createElement();
    this.render();
  }

  createElement() {
    const button = document.createElement('button');
    button.className = \`${componentName.toLowerCase()}-component \${this.variant} \${this.size}\`;
    button.addEventListener('click', this.onClick);
    return button;
  }

  render() {
    this.element.innerHTML = \`
      \${this.isLoading ? '<div class="loading-spinner"></div>' : ''}
      <span class="content"></span>
    \`;
    
    this.element.disabled = this.isLoading;
  }

  setVariant(variant) {
    this.variant = variant;
    this.element.className = \`${componentName.toLowerCase()}-component \${this.variant} \${this.size}\`;
  }

  setSize(size) {
    this.size = size;
    this.element.className = \`${componentName.toLowerCase()}-component \${this.variant} \${this.size}\`;
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
    this.render();
  }

  destroy() {
    this.element.remove();
  }
}

// Usage example:
// const button = new ${componentName}({
//   variant: 'primary',
//   size: 'md',
//   onClick: () => console.log('Button clicked!')
// });
// document.body.appendChild(button.element);

export { ${componentName} };`;
  }
}

export const aiService = new AIService();