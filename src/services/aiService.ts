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
          "x-api-key": process.env.REACT_APP_CLAUDE_API_KEY || "",
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
    // Check if API key is available
    if (!process.env.REACT_APP_CLAUDE_API_KEY) {
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
    return allSpecs[componentName] || '- Should follow standard component patterns\n- Should include proper accessibility features';
  }

  private generateFallbackCode(componentName: string, framework: string, styling: string, componentDetails?: { variants: string[]; description?: string; category: string }): string {
    const variants = componentDetails?.variants || ['primary', 'secondary', 'ghost'];
    
    if (framework.includes('react')) {
      return `import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ${componentName}Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: '${variants.join("' | '")}';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
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
        className={cn(
          baseClasses,
          variantClasses[variant as keyof typeof variantClasses],
          sizeClasses[size],
          className
        )}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

${componentName}.displayName = '${componentName}';

export { ${componentName} };`;
    }
    
    // Fallback for other frameworks
    return `// ${componentName} component for ${framework} with ${styling}
// This is a fallback template. Configure your API key for AI-generated code.

export const ${componentName} = () => {
  return (
    <div className="${componentName.toLowerCase()}-component">
      <h3>${componentName}</h3>
      <p>Component template for ${framework} with ${styling}</p>
      <p>Variants: ${variants.join(', ')}</p>
    </div>
  );
};`;
  }
}

export const aiService = new AIService();