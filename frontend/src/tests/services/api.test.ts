import { describe, expect, it, vi, beforeEach } from 'vitest';
import { addAuthToken, searchApi, chatApi } from '@/services/api';

vi.mock('axios', async () => {
  const actual: any = await vi.importActual('axios');
  const mockClient = {
    post: vi.fn(),
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };
  return {
    ...actual,
    default: {
      ...actual.default,
      __mockClient: mockClient,
      create: vi.fn(() => mockClient),
    },
  };
});

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should add auth token to requests', () => {
    localStorage.setItem('auth_token', 'test-token');
    const config = addAuthToken({ headers: {} });
    expect(config.headers.Authorization).toBe('Bearer test-token');
  });

  it('should handle search API call', async () => {
    const mockData = {
      results: [
        {
          document: {
            id: 1,
            title: 'Button Component',
            content: 'Test content',
            url: 'https://example.com',
            category: 'Components',
            tags: ['button'],
          },
          score: 0.1,
        },
      ],
    };

    // searchApi uses axios; mock it via the module mock above by patching the created client
    const axios: any = (await import('axios')).default;
    const client = axios.__mockClient;
    client.post.mockResolvedValue({ data: mockData });

    const results = await searchApi.search('test query', 5);
    expect(results).toEqual(mockData.results);
  });

  it('should handle chat stream', async () => {
    const mockChunks = [
      'data: {"content": "Hello"}\n\n',
      'data: {"content": " World"}\n\n',
      'data: [DONE]\n\n',
    ];

    const mockStream = new ReadableStream({
      start(controller) {
        mockChunks.forEach(chunk => {
          controller.enqueue(new TextEncoder().encode(chunk));
        });
        controller.close();
      },
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: mockStream,
    });

    const onMessage = vi.fn();
    const onComplete = vi.fn();
    const onError = vi.fn();

    await chatApi.streamMessage(
      [{ role: 'user', content: 'Hello' }],
      onMessage,
      onComplete,
      onError
    );

    expect(onMessage).toHaveBeenCalledWith('Hello');
    expect(onMessage).toHaveBeenCalledWith(' World');
    expect(onComplete).toHaveBeenCalled();
  });
});
