import type { Component, DesignToken, AIInsight } from '../types';

export const components: Component[] = [
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
  },
  {
    name: 'Modal',
    category: 'Overlay',
    usage: 45,
    lastUpdated: '3 days ago',
    status: 'beta',
    accessibility: 'AA',
    variants: ['small', 'medium', 'large', 'fullscreen']
  },
  {
    name: 'Input',
    category: 'Form',
    usage: 92,
    lastUpdated: '1 day ago',
    status: 'stable',
    accessibility: 'AAA',
    variants: ['text', 'email', 'password', 'number']
  },
  {
    name: 'Tooltip',
    category: 'Overlay',
    usage: 67,
    lastUpdated: '5 days ago',
    status: 'stable',
    accessibility: 'AA',
    variants: ['top', 'bottom', 'left', 'right']
  },
  {
    name: 'Badge',
    category: 'Display',
    usage: 54,
    lastUpdated: '1 week ago',
    status: 'stable',
    accessibility: 'AA',
    variants: ['primary', 'secondary', 'success', 'warning', 'danger']
  }
];

export const designTokens: DesignToken[] = [
  { name: 'color-brand-500', value: '#29405A', category: 'colors', usage: 45 },
  { name: 'color-brand-600', value: '#395A7E', category: 'colors', usage: 32 },
  { name: 'color-brand-700', value: '#4974A2', category: 'colors', usage: 28 },
  { name: 'color-brand-800', value: '#658EB9', category: 'colors', usage: 15 },
  { name: 'color-brand-900', value: '#ACC2D9', category: 'colors', usage: 12 },
  { name: 'color-accent-500', value: '#658EB9', category: 'colors', usage: 25 },
  { name: 'color-accent-600', value: '#4974A2', category: 'colors', usage: 20 },
  { name: 'color-accent-700', value: '#395A7E', category: 'colors', usage: 18 },
  { name: 'spacing-xs', value: '4px', category: 'spacing', usage: 67 },
  { name: 'spacing-sm', value: '8px', category: 'spacing', usage: 89 },
  { name: 'spacing-md', value: '16px', category: 'spacing', usage: 95 },
  { name: 'spacing-lg', value: '24px', category: 'spacing', usage: 78 },
  { name: 'spacing-xl', value: '32px', category: 'spacing', usage: 56 },
  { name: 'typography-heading-sm', value: '18px/1.4', category: 'typography', usage: 34 },
  { name: 'typography-heading-md', value: '20px/1.3', category: 'typography', usage: 56 },
  { name: 'typography-heading-lg', value: '24px/1.2', category: 'typography', usage: 43 },
  { name: 'typography-body-sm', value: '14px/1.5', category: 'typography', usage: 87 },
  { name: 'typography-body-md', value: '16px/1.5', category: 'typography', usage: 92 },
  { name: 'border-radius-sm', value: '4px', category: 'borders', usage: 67 },
  { name: 'border-radius-md', value: '8px', category: 'borders', usage: 89 },
  { name: 'border-radius-lg', value: '12px', category: 'borders', usage: 45 },
  { name: 'shadow-sm', value: '0 1px 2px rgba(0,0,0,0.05)', category: 'shadows', usage: 76 },
  { name: 'shadow-md', value: '0 4px 6px rgba(0,0,0,0.1)', category: 'shadows', usage: 54 }
];

export const aiInsights: AIInsight[] = [
  {
    type: 'optimization',
    title: 'Unused Component Variants',
    description: 'I noticed your Button.ghost variant has 0% usage across projects. Consider deprecating it.',
    priority: 'low',
    action: 'Deprecate ghost variant'
  },
  {
    type: 'accessibility',
    title: 'Color Contrast Issue',
    description: 'Your secondary button on light backgrounds fails WCAG AA standards. This needs attention.',
    priority: 'high',
    action: 'Update color-brand-600 token'
  },
  {
    type: 'consistency',
    title: 'Spacing Inconsistency',
    description: 'I found that your cards use custom margins instead of design tokens in 3 projects. Let me help you fix this.',
    priority: 'medium',
    action: 'Auto-migrate to spacing tokens'
  },
  {
    type: 'maintenance',
    title: 'Outdated Dependencies',
    description: 'Your Modal component uses a deprecated focus management library. Time for an upgrade.',
    priority: 'medium',
    action: 'Upgrade to latest focus-trap version'
  }
];