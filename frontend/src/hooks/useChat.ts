// frontend/src/hooks/useChat.ts
import { useState, useCallback } from 'react';
import { Message, ChatCompletionMessage } from '@/types';
import { searchApi, chatApi } from '@/services/api';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Search for relevant documents
      const searchResults = await searchApi.search(content);
      
      // Create assistant message placeholder
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        sources: searchResults,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Prepare chat messages
      const chatMessages: ChatCompletionMessage[] = [
        ...messages.slice(-10).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: 'user', content },
      ];

      // If we have search results, add context
      if (searchResults.length > 0) {
        const context = searchResults.map(r => 
          `${r.document.title}: ${r.document.content.slice(0, 200)}`
        ).join('\n\n');

        chatMessages.unshift({
          role: 'system',
          content: `Use this context to answer: ${context}`,
        });
      }

      // Get streaming response
      await chatApi.streamMessage(chatMessages, (chunk) => {
        setMessages(prev => {
          const updated = [...prev];
          const lastMessage = updated[updated.length - 1];
          if (lastMessage.role === 'assistant') {
            lastMessage.content += chunk;
          }
          return updated;
        });
      });
    } catch (error) {
      console.error('Chat error:', error);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
