import '@testing-library/jest-dom';
import { vi } from 'vitest';

// jsdom doesn't implement this; our components call it for chat autoscroll.
Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true,
});

