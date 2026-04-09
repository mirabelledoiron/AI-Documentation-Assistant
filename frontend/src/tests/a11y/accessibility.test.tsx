import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import axe from 'axe-core';
import { BrowserRouter } from 'react-router-dom';
import { ChatInterface } from '@/components/ChatInterface';

describe('Accessibility', () => {
  it('ChatInterface has no WCAG violations', async () => {
    const { container } = render(
      <BrowserRouter>
        <ChatInterface />
      </BrowserRouter>
    );

    const results = await axe.run(container, {
      rules: {
        region: { enabled: false },
        'color-contrast': { enabled: false },
      },
    });

    const violations = results.violations.map(
      (v) => `${v.id}: ${v.description} (${v.nodes.length} nodes)`
    );

    expect(violations).toEqual([]);
  });
});
