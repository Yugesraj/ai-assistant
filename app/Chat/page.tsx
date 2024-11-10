'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

const ChatInterface = () => {
    const [mounted, setMounted] = useState(false);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  //const messagesEndRef = useRef(null);
interface message {
    role: string;
    content: string;
}
const [messages, setMessages] = useState<message[]>([]);


useEffect(() => {
    setMounted(true);
    setMessages( [{ role: 'bot', content: 'Hello! How can I help you today?' }]);
},[])

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateBotResponse = async (userMessage: string) => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Example responses based on user input
    let botResponse = "I'm not sure how to respond to that. Could you please rephrase?";
    
    if (userMessage.toLowerCase().includes('hello')) {
      botResponse = "Hi there! How can I assist you today?";
    } else if (userMessage.toLowerCase().includes('help')) {
      botResponse = "I'm here to help! What do you need assistance with?";
    } else if (userMessage.toLowerCase().includes('bye')) {
      botResponse = "Goodbye! Have a great day!";
    }

    setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const messageText = input.trim();
    
    if (messageText) {
      // Add user message
      const userMessage = { role: 'user', content: messageText };
      setMessages(prev => [...prev, userMessage]);
      setInput(''); // Clear input immediately after sending
      
      // Generate bot response
      await simulateBotResponse(messageText);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior of the Enter key
      // Create a synthetic event to pass to handleSubmit
      const formEvent = { 
        preventDefault: () => {}, // Add preventDefault method
        currentTarget: e.currentTarget.form 
      } as React.FormEvent<HTMLFormElement>;
      handleSubmit(formEvent);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 bg-white/20 border-b border-white/20">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-white" />
            <h1 className="text-xl font-semibold text-white">AI Assistant</h1>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] p-3 rounded-2xl
                  ${message.role === 'user'
                    ? 'bg-white/20 text-white ml-12'
                    : 'bg-white/30 text-white mr-12'
                  }
                `}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.role === 'bot' ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="font-medium">
                    {message.role === 'bot' ? 'AI Assistant' : 'You'}
                  </span>
                </div>
                <p className="text-sm break-words">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/30 text-white p-3 rounded-2xl mr-12">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <span className="text-sm">AI is typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 bg-white/20 border-t border-white/20">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 bg-white/10 text-white placeholder-white/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`
                rounded-lg p-2 transition-colors duration-200
                ${isLoading || !input.trim() 
                  ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                  : 'bg-white/20 hover:bg-white/30 text-white'}
              `}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;