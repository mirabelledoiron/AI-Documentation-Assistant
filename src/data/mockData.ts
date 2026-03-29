import type { Component, DesignToken } from '../types';

export const components: Component[] = [
  {
    id: '1',
    name: 'Button',
    category: 'Interactive',
    usage: 85,
    lastUsed: new Date('2024-01-15'),
    variants: ['primary', 'secondary', 'ghost', 'danger'],
    props: { size: 'md', disabled: false }
  },
  {
    id: '2',
    name: 'Card',
    category: 'Layout',
    usage: 72,
    lastUsed: new Date('2024-01-10'),
    variants: ['default', 'elevated', 'outlined'],
    props: { padding: 'md', shadow: 'sm' }
  },
  {
    id: '3',
    name: 'Input',
    category: 'Form',
    usage: 68,
    lastUsed: new Date('2024-01-12'),
    variants: ['text', 'email', 'password', 'number'],
    props: { type: 'text', placeholder: '' }
  },
  {
    id: '4',
    name: 'Modal',
    category: 'Overlay',
    usage: 45,
    lastUsed: new Date('2024-01-14'),
    variants: ['small', 'medium', 'large', 'full'],
    props: { isOpen: false, size: 'md' }
  },
  {
    id: '5',
    name: 'Dropdown',
    category: 'Navigation',
    usage: 52,
    lastUsed: new Date('2024-01-13'),
    variants: ['default', 'searchable', 'multi-select'],
    props: { options: [], multiple: false }
  },
  {
    id: '6',
    name: 'Alert',
    category: 'Feedback',
    usage: 38,
    lastUsed: new Date('2024-01-08'),
    variants: ['info', 'success', 'warning', 'error'],
    props: { type: 'info', dismissible: true }
  }
];

export const designTokens: DesignToken[] = [
  { id: '1', name: 'color-brand-500', value: '#29405A', category: 'color', description: 'Primary brand color' },
  { id: '2', name: 'color-brand-600', value: '#395A7E', category: 'color', description: 'Dark brand color' },
  { id: '3', name: 'color-brand-700', value: '#4974A2', category: 'color', description: 'Accent brand color' },
  { id: '4', name: 'color-brand-800', value: '#658EB9', category: 'color', description: 'Light brand color' },
  { id: '5', name: 'color-brand-900', value: '#ACC2D9', category: 'color', description: 'Very light brand color' },
  { id: '6', name: 'color-accent-500', value: '#658EB9', category: 'color', description: 'Primary accent color' },
  { id: '7', name: 'color-accent-600', value: '#4974A2', category: 'color', description: 'Dark accent color' },
  { id: '8', name: 'color-accent-700', value: '#395A7E', category: 'color', description: 'Very dark accent color' },
  { id: '9', name: 'spacing-xs', value: '4px', category: 'spacing', description: 'Extra small spacing' },
  { id: '10', name: 'spacing-sm', value: '8px', category: 'spacing', description: 'Small spacing' },
  { id: '11', name: 'spacing-md', value: '16px', category: 'spacing', description: 'Medium spacing' },
  { id: '12', name: 'spacing-lg', value: '24px', category: 'spacing', description: 'Large spacing' },
  { id: '13', name: 'spacing-xl', value: '32px', category: 'spacing', description: 'Extra large spacing' },
  { id: '14', name: 'typography-heading-sm', value: '18px/1.4', category: 'typography', description: 'Small heading' },
  { id: '15', name: 'typography-heading-md', value: '20px/1.3', category: 'typography', description: 'Medium heading' },
  { id: '16', name: 'typography-heading-lg', value: '24px/1.2', category: 'typography', description: 'Large heading' },
  { id: '17', name: 'typography-body-sm', value: '14px/1.5', category: 'typography', description: 'Small body text' },
  { id: '18', name: 'typography-body-md', value: '16px/1.5', category: 'typography', description: 'Medium body text' },
  { id: '19', name: 'border-radius-sm', value: '4px', category: 'border', description: 'Small border radius' },
  { id: '20', name: 'border-radius-md', value: '8px', category: 'border', description: 'Medium border radius' },
  { id: '21', name: 'border-radius-lg', value: '12px', category: 'border', description: 'Large border radius' },
  { id: '22', name: 'shadow-sm', value: '0 1px 2px rgba(0,0,0,0.05)', category: 'shadow', description: 'Small shadow' },
  { id: '23', name: 'shadow-md', value: '0 4px 6px rgba(0,0,0,0.1)', category: 'shadow', description: 'Medium shadow' }
];

export const aiInsights = [
  {
    title: 'Component Consistency',
    description: 'Your Button components show 95% consistency across variants, but Modal components could benefit from standardized sizing.',
    priority: 'medium',
    action: 'Review Modal component variants and implement consistent sizing scale',
    savings: '2-3 hours per project'
  },
  {
    title: 'Accessibility Improvements',
    description: 'Form components need better ARIA labeling. Current accessibility score: 78%.',
    priority: 'high',
    action: 'Add proper ARIA labels and roles to Input, Checkbox, and Radio components',
    savings: 'Reduced accessibility audit time by 40%'
  },
  {
    title: 'Design Token Usage',
    description: 'Color tokens are well-utilized (87%), but spacing tokens could be more consistent.',
    priority: 'low',
    action: 'Audit spacing usage and standardize common values',
    savings: '1-2 hours per project'
  }
];