// frontend/src/components/ChatInterface.tsx
import { useState, useRef, useEffect } from 'react';
import { Message, SearchResult, ChatCompletionMessage } from '@/types';
import { searchApi, chatApi } from '@/services/api';
import { getProviderKeys } from '@/services/providerKeys';
import { Send, Bot, User, Search, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ className = '' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const { provider, openAIKey } = getProviderKeys();

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Search for relevant documents (requires OpenAI key for embeddings)
      let searchResults: SearchResult[] = [];
      if (openAIKey) {
        try {
          searchResults = await searchApi.search(input);
        } catch {
          searchResults = [];
        }
      }
      
      // Prepare messages for chat
      const chatMessages: ChatCompletionMessage[] = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage.content },
      ];

      // Add context if we have search results
      if (searchResults.length > 0) {
        const context = formatSearchContext(searchResults);
        chatMessages.unshift({
          role: 'system',
          content: `Context from documentation: ${context}`,
        });
      }

      if (provider === 'anthropic') {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          sources: searchResults,
          timestamp: new Date(),
          isStreaming: true,
        };

        setMessages(prev => [...prev, assistantMessage]);

        const full = await chatApi.sendMessage(chatMessages);

        setMessages(prev => {
          const updated = [...prev];
          const lastMessage = updated[updated.length - 1];
          if (lastMessage.role === 'assistant') {
            lastMessage.content = full;
            lastMessage.isStreaming = false;
          }
          return updated;
        });
      } else {
        // Stream the response
        await streamResponse(chatMessages, searchResults);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const streamResponse = async (
    messages: ChatCompletionMessage[],
    searchResults: SearchResult[]
  ) => {
    let accumulatedContent = '';

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      sources: searchResults,
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      await chatApi.streamMessage(
        messages,
        (chunk) => {
          accumulatedContent += chunk;
          setMessages(prev => {
            const updated = [...prev];
            const lastMessage = updated[updated.length - 1];
            if (lastMessage.role === 'assistant') {
              lastMessage.content = accumulatedContent;
            }
            return updated;
          });
        },
        () => {
          setMessages(prev => {
            const updated = [...prev];
            const lastMessage = updated[updated.length - 1];
            if (lastMessage.role === 'assistant') {
              lastMessage.isStreaming = false;
            }
            return updated;
          });
          // done
        },
        (error) => {
          console.error('Stream error:', error);
        }
      );
    } catch (error) {
      console.error('Streaming failed:', error);
    }
  };

  const formatSearchContext = (results: SearchResult[]): string => {
    return results.map((result, index) => 
      `Document ${index + 1}: ${result.document.title}\n${result.document.content.substring(0, 200)}...`
    ).join('\n\n');
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className={cn('flex flex-col h-full overflow-hidden', className)}>
      <div className="flex-shrink-0 px-4 py-3 border-b border-border bg-card">
        <h1 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          AI-Powered Documentation Assistant
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ask me anything about the design system
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
          {messages.length === 0 && (
            <div className="py-6">
              <div className="max-w-xl">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Bot className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-base font-medium text-foreground">
                      Start a conversation
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ask about components, patterns, tokens, or guidelines.
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2">
                <ExampleQueryButton 
                  query="How do I create a primary button?"
                  onClick={setInput}
                />
                <ExampleQueryButton 
                  query="What are the spacing guidelines?"
                  onClick={setInput}
                />
                <ExampleQueryButton 
                  query="Show me form validation patterns"
                  onClick={setInput}
                />
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                message.role === 'user' ? 'bg-primary' : 'bg-muted'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-3.5 h-3.5 text-primary-foreground" />
                ) : (
                  <Bot className="w-3.5 h-3.5 text-foreground" />
                )}
              </div>
              
              <div
                className={cn(
                  'flex-1 max-w-[70%] flex flex-col',
                  message.role === 'user' ? 'items-end' : 'items-start'
                )}
              >
                <div className={`px-3 py-2 rounded-lg text-left text-sm leading-relaxed ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.isStreaming && (
                    <div className="flex space-x-1 mt-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                    </div>
                  )}
                </div>
                
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Search className="w-3 h-3" />
                      <span>Sources:</span>
                    </div>
                    <div className="space-y-1">
                      {message.sources.map((source, index) => (
                        <a
                          key={index}
                          href={source.document.url || '#'}
                          target={source.document.url ? '_blank' : undefined}
                          rel={source.document.url ? 'noopener noreferrer' : undefined}
                          className="flex items-center gap-1 text-primary hover:opacity-90 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{source.document.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className={`text-xs text-muted-foreground mt-1 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex-shrink-0 p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about design system components, patterns, or guidelines..."
            disabled={isLoading}
            className="flex-1 h-10"
          />
          <Button type="submit" disabled={!input.trim()} loading={isLoading} className="w-12 px-0" aria-label="Send">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </Card>
  );
};

const ExampleQueryButton: React.FC<{ query: string; onClick: (query: string) => void }> = ({ query, onClick }) => (
  <Button
    type="button"
    variant="secondary"
    onClick={() => onClick(query)}
    className="w-full justify-start px-3 py-3 text-left text-sm"
  >
    {query}
  </Button>
);
