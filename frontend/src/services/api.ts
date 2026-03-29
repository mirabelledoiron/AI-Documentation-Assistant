import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { SearchResult, Document, ChatCompletionMessage, UserQuery } from '@/types';
import { getProviderKeys } from '@/services/providerKeys';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function addAuthToken<T extends { headers?: any }>(config: T): T {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

export function addProviderKeys<T extends { headers?: any }>(config: T): T {
  const { provider, openAIKey, anthropicKey } = getProviderKeys();
  config.headers = config.headers || {};
  config.headers['X-AI-Provider'] = provider;
  if (openAIKey) config.headers['X-OpenAI-Key'] = openAIKey;
  if (anthropicKey) config.headers['X-Anthropic-Key'] = anthropicKey;
  return config;
}

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return addProviderKeys(addAuthToken(config));
  },
  (error: unknown) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // No auth flow is implemented in this project yet.
      // Keep the app usable by clearing any stale token without redirecting.
      localStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

export const searchApi = {
  search: async (query: string, limit: number = 5): Promise<SearchResult[]> => {
    const response = await api.post('/search', { query, limit });
    return response.data.results;
  },
};

export const chatApi = {
  sendMessage: async (messages: ChatCompletionMessage[]): Promise<string> => {
    const response = await api.post('/chat', { messages, stream: false });
    return response.data.message;
  },

  streamMessage: async (
    messages: ChatCompletionMessage[],
    onMessage: (chunk: string) => void,
    onComplete: () => void = () => {},
    onError: (error: Error) => void = () => {}
  ): Promise<void> => {
    const { provider, openAIKey, anthropicKey } = getProviderKeys();
    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AI-Provider': provider,
        ...(openAIKey ? { 'X-OpenAI-Key': openAIKey } : {}),
        ...(anthropicKey ? { 'X-Anthropic-Key': anthropicKey } : {}),
      },
      body: JSON.stringify({ messages, stream: true }),
    });

    if (!response.ok) {
      throw new Error('Stream request failed');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onMessage(parsed.content);
              }
            } catch (e) {
              console.error('Failed to parse stream data:', e);
            }
          }
        }
      }
    } catch (error) {
      onError(error as Error);
    } finally {
      reader.releaseLock();
    }
  },
};

export const documentApi = {
  getDocuments: async (page: number = 1, limit: number = 10): Promise<{
    documents: Document[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await api.get('/documents', { params: { page, limit } });
    return response.data;
  },

  createDocument: async (document: Partial<Document>): Promise<Document> => {
    const response = await api.post('/documents', document);
    return response.data;
  },

  deleteDocument: async (id: number): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },
};

export const analyticsApi = {
  getPopularQueries: async (): Promise<UserQuery[]> => {
    const response = await api.get('/analytics/popular');
    return response.data.queries || [];
  },
};

export default api;
