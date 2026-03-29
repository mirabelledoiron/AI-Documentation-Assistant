import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChatInterface } from '@/components/ChatInterface';
import { searchApi, chatApi } from '@/services/api';

vi.mock('@/services/api', () => ({
  searchApi: {
    search: vi.fn(),
  },
  chatApi: {
    streamMessage: vi.fn(),
  },
}));

describe('ChatInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (searchApi.search as any).mockResolvedValue([]);
    (chatApi.streamMessage as any).mockImplementation(
      (_messages: any, onMessage: any, onComplete: any) => {
        onMessage('Test response');
        onComplete();
      }
    );
  });

  it('renders initial welcome screen', () => {
    render(<ChatInterface />);
    expect(screen.getByText(/Welcome to AI-Powered Documentation Assistant/i)).toBeInTheDocument();
  });

  it('sends a message when form is submitted', async () => {
    render(<ChatInterface />);
    
    const input = screen.getByPlaceholderText(/Ask about design system/i);
    const form = input.closest('form')!;
    
    fireEvent.change(input, { target: { value: 'How do I create a button?' } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(searchApi.search).toHaveBeenCalledWith('How do I create a button?');
    });
  });

  it('shows example queries that can be clicked', () => {
    render(<ChatInterface />);
    
    const exampleQuery = screen.getByText('How do I create a primary button?');
    fireEvent.click(exampleQuery);
    
    const input = screen.getByPlaceholderText(/Ask about design system/i) as HTMLInputElement;
    expect(input.value).toBe('How do I create a primary button?');
  });
});
