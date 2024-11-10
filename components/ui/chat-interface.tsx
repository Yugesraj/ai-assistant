'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Settings, Maximize2, Minimize2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { v4 as uuidv4 } from 'uuid'; // Import a UUID library




// Create a client-side only wrapper using dynamic import
const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return children;
};


if(ClientOnly.length > 0){

}

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: "initial", text: "👋 Hello! How can I help you today?", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [domLoaded, setDomLoaded] = useState(false);

  

  useEffect(() => {
    scrollToBottom();
    setDomLoaded(true);
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const simulateTypingAndResponse = async (response: string) => {
    setIsTyping(true);
    scrollToBottom();
    
    // Fixed typing duration to avoid hydration issues
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsTyping(false);
    const messageId = uuidv4();
    setMessages(prev => [...prev, { 
      
      id: messageId, 
      text: response, 
      sender: "bot" 
    }]);
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      const userMessage = inputValue;
      const messageId = uuidv4(); // Use a consistent UUID
      setMessages(prev => [...prev, { 
        id: messageId, 
        text: userMessage, 
        sender: "user" 
      }]);
      setInputValue("");
      
      // Fixed response to avoid hydration issues
      const botResponse = "I understand what you're asking. Let me help you with that!";
      simulateTypingAndResponse(botResponse);
    }
  };


  // Separate the TypingIndicator into a client component
const TypingIndicator = () => (
    <div className="flex space-x-2 p-3 bg-white rounded-lg items-center max-w-[80%] mr-4">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
      </div>
    </div>
    
  );

  return  (
    
   domLoaded && (<div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <ClientOnly>
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        </div>
      </ClientOnly>

      <div className={`fixed ${isExpanded ? 'inset-0' : 'inset-4 md:inset-auto'} 
        transition-all duration-500 ease-out
        ${isExpanded ? '' : 'md:w-1/3 md:h-[90vh] md:left-1/2 md:-translate-x-1/2'}`}>
        <Card className="h-full w-full flex flex-col bg-white/95 backdrop-blur-lg shadow-2xl 
          rounded-xl border border-white/20 transition-all duration-500">
          <CardHeader className="border-b border-white/10 flex flex-row items-center justify-between p-4 bg-white/50">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 bg-gradient-to-r from-indigo-500 to-purple-500">
                <img 
                  src="aiavtar.webp" // Replace with your image URL
                  alt="User Avatar" 
                  className="h-full w-full object-cover rounded-full" // Ensures the image covers the avatar area
                />
              </Avatar>
              <div>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  AI Assistant
                </CardTitle>
                <ClientOnly>
                  {isTyping && (
                    <span className="text-xs text-gray-500">typing...</span>
                  )}
                </ClientOnly>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsExpanded(!isExpanded)}
                className="hover:bg-white/20 transition-colors"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            
            </div>
          </CardHeader>

          <ScrollArea className="flex-grow p-4 bg-white/50">
            <div className="space-y-4">
              <ClientOnly>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 shadow-lg
                        ${message.sender === 'user' 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white ml-4' 
                          : 'bg-white text-gray-800 mr-4'
                        }
                        hover:scale-[1.02] transition-transform duration-200
                        break-words`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <TypingIndicator />
                  </div>
                )}
              </ClientOnly>
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <CardFooter className="border-t border-white/10 p-4 bg-white/50">
            <div className="flex w-full space-x-2">
              
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                className="flex-grow bg-white/50 backdrop-blur-lg border-white/20 
                  focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              />
              <Button 
                onClick={handleSend}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 
                  transition-opacity duration-200"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>)

            

  );
};

export default ChatInterface;