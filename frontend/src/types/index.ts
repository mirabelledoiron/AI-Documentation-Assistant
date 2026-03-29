export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: SearchResult[];
  timestamp: Date;
  isStreaming?: boolean;
}

// For API requests (no local-only fields like id/timestamp)
export type ChatCompletionMessage = Pick<Message, 'role' | 'content'>;

export interface SearchResult {
  document: Document;
  score: number;
}

export interface Document {
  id: number;
  title: string;
  content: string;
  url: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface UserQuery {
  id: number;
  query: string;
  response?: string;
  sources?: string[];
  created_at: string;
}

export interface SearchRequest {
  query: string;
  limit?: number;
}

export interface ChatRequest {
  messages: Message[];
  stream?: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export type ChatStatus = 'idle' | 'loading' | 'streaming' | 'error';
