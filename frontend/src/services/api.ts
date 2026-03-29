import axios, { AxiosError } from 'axios';
import { SearchResult, Document, ChatCompletionMessage } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function addAuthToken(config: any) {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return addAuthToken(config);
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
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
    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

export default api;
