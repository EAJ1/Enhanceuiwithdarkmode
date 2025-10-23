import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Send, Mic, Volume2, Bot, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatModeProps {
  fontSize: number;
}

export function ChatMode({ fontSize }: ChatModeProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your EchoBridge AI assistant. I can help you with accessibility features, answer questions, and provide support. You can type or use voice input to chat with me!',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Setup speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('Speech recognition error');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const mockResponses = [
    "I understand. Let me help you with that.",
    "That's a great question! Here's what I can tell you: EchoBridge provides speech-to-text, text-to-speech, and text simplification features to make communication more accessible.",
    "I'm here to assist you. Would you like me to demonstrate any of the accessibility features?",
    "Accessibility is very important. Our tools are designed to help people with hearing, speech, or visual impairments communicate more effectively.",
    "You can use voice commands or type your messages. I'll respond in both text and voice to ensure the information is accessible to everyone.",
    "Is there anything specific you'd like help with? I can explain features, provide tips, or answer questions about accessibility.",
  ];

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock response
    const responseContent = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsProcessing(false);

    // Speak the response
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(responseContent);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoiceInput = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.info('Listening...');
      } catch (error) {
        toast.error('Voice input not available');
      }
    } else {
      toast.error('Speech recognition not supported');
    }
  };

  const speakMessage = (content: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(content);
      window.speechSynthesis.speak(utterance);
      toast.success('Speaking message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-orange-200 dark:border-orange-500/30 shadow-lg shadow-orange-200/50 dark:shadow-orange-500/10 bg-white/80 dark:bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-500">
            <Bot className="h-5 w-5 text-orange-500" />
            AI Chat Assistant
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-orange-100/90">
            Chat with AI using text or voice. Responses are provided in both formats for accessibility.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Chat Messages */}
          <div
            ref={scrollRef}
            className="h-[500px] overflow-y-auto space-y-4 p-4 bg-black/30 rounded-lg mb-4 border border-orange-500/20"
          >
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={message.role === 'user' ? 'bg-orange-500' : 'bg-orange-950 border border-orange-500/30'}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4 text-black" />
                      ) : (
                        <Bot className="h-4 w-4 text-orange-500" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={`flex-1 max-w-[80%] ${
                      message.role === 'user' ? 'items-end' : 'items-start'
                    } flex flex-col gap-1`}
                  >
                    <div
                      className={`p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-orange-500 text-black'
                          : 'bg-gray-100 dark:bg-black/50 border-2 border-orange-500/30 text-gray-900 dark:text-orange-50'
                      }`}
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {message.role === 'assistant' && (
                      <Button
                        onClick={() => speakMessage(message.content)}
                        variant="ghost"
                        size="sm"
                        className="gap-1 h-7"
                      >
                        <Volume2 className="h-3 w-3" />
                        Speak
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-secondary">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-1 items-center p-4 bg-card border-2 border-border rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Button
              onClick={startVoiceInput}
              variant="outline"
              size="icon"
              disabled={isListening}
              className={isListening ? 'bg-red-500/10 border-red-500' : ''}
            >
              <Mic className={`h-4 w-4 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
            </Button>

            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or use voice input..."
              className="flex-1"
              style={{ fontSize: `${fontSize}px` }}
              disabled={isProcessing}
            />

            <Button
              onClick={sendMessage}
              disabled={!inputText.trim() || isProcessing}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>

          {/* Info */}
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm">
              💡 <strong>Tip:</strong> Press Enter to send, or click the microphone to use voice input. AI responses are automatically spoken aloud.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
