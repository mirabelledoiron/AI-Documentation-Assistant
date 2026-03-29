// frontend/src/components/ChatInterface.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, SearchResult, ChatCompletionMessage } from '@/types';
import { searchApi, chatApi } from '@/services/api';
import { Send, Bot, User, Search, ExternalLink } from 'lucide-react';

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
      // Search for relevant documents
      const searchResults = await searchApi.search(input);
      
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

      // Stream the response
      await streamResponse(chatMessages, searchResults);

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
    <div className={`flex flex-col h-full bg-white rounded-lg shadow-lg ${className}`}>
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          AI Documentation Assistant
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Ask me anything about Indeed's design system
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Welcome to AI Documentation Assistant
              </h3>
              <p className="text-gray-600 mb-6">
                I can help you find information about design components, patterns, and guidelines.
              </p>
              <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
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
            </motion.div>
          )}

          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' ? 'bg-blue-600' : 'bg-gray-600'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div className={`flex-1 max-w-[70%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.isStreaming && (
                    <div className="flex space-x-1 mt-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                    </div>
                  )}
                </div>
                
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2 text-xs">
                    <div className="flex items-center gap-1 text-gray-500 mb-1">
                      <Search className="w-3 h-3" />
                      <span>Sources:</span>
                    </div>
                    <div className="space-y-1">
                      {message.sources.map((source, index) => (
                        <a
                          key={index}
                          href={source.document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{source.document.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className={`text-xs text-gray-500 mt-1 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex-shrink-0 p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about design system components, patterns, or guidelines..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

const ExampleQueryButton: React.FC<{ query: string; onClick: (query: string) => void }> = ({ query, onClick }) => (
  <button
    onClick={() => onClick(query)}
    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
  >
    {query}
  </button>
);
