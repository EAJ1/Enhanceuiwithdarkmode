import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Moon, Sun, Mic, MessageSquare, FileText, Sparkles, History, Settings } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { SpeechToText } from './components/SpeechToText';
import { TextToSpeech } from './components/TextToSpeech';
import { TextSimplifier } from './components/TextSimplifier';
import { ChatMode } from './components/ChatMode';
import { SessionHistory } from './components/SessionHistory';
import { AccessibilitySettings } from './components/AccessibilitySettings';
import { AnimatedBackground } from './components/AnimatedBackground';
import { motion } from 'motion/react';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const savedDarkMode = localStorage.getItem('echobridge_darkmode');
    const savedFontSize = localStorage.getItem('echobridge_fontsize');
    const savedHighContrast = localStorage.getItem('echobridge_highcontrast');
    const savedAutoSpeak = localStorage.getItem('echobridge_autospeak');

    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedHighContrast) setHighContrast(JSON.parse(savedHighContrast));
    if (savedAutoSpeak) setAutoSpeak(JSON.parse(savedAutoSpeak));
  }, []);

  useEffect(() => {
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('echobridge_darkmode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    // Save preferences
    localStorage.setItem('echobridge_fontsize', fontSize.toString());
    localStorage.setItem('echobridge_highcontrast', JSON.stringify(highContrast));
    localStorage.setItem('echobridge_autospeak', JSON.stringify(autoSpeak));

    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [fontSize, highContrast, autoSpeak]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 relative">
      <AnimatedBackground />
      <Toaster />
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 dark:bg-background/95 border-b-2 border-orange-500/30 shadow-lg shadow-orange-500/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg blur-lg opacity-70 glow-orange" />
                <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-lg border border-orange-400/50">
                  <MessageSquare className="h-6 w-6 text-black" />
                </div>
              </div>
              <div>
                <h1 className="tracking-tight bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">EchoBridge</h1>
                <p className="text-sm text-orange-200 dark:text-orange-100">AI-Powered Accessibility Assistant</p>
              </div>
            </motion.div>

            {/* Dark Mode Toggle */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                onClick={toggleDarkMode}
                variant="outline"
                size="icon"
                className="rounded-full border-orange-500/50 hover:bg-orange-500/20 hover:border-orange-500 transition-all"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-orange-500" />
                ) : (
                  <Moon className="h-5 w-5 text-orange-500" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="speech-to-text" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-2 bg-orange-50/80 dark:bg-black/40 backdrop-blur-sm mb-8 border-2 border-orange-200 dark:border-orange-500/30 shadow-sm">
              <TabsTrigger value="speech-to-text" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white dark:data-[state=active]:bg-orange-500/20 dark:data-[state=active]:text-orange-500 data-[state=active]:border-orange-500 transition-all text-gray-700 dark:text-gray-300">
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">Speech to Text</span>
                <span className="sm:hidden">STT</span>
              </TabsTrigger>
              
              <TabsTrigger value="text-to-speech" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white dark:data-[state=active]:bg-orange-500/20 dark:data-[state=active]:text-orange-500 data-[state=active]:border-orange-500 transition-all text-gray-700 dark:text-gray-300">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Text to Speech</span>
                <span className="sm:hidden">TTS</span>
              </TabsTrigger>
              
              <TabsTrigger value="simplifier" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white dark:data-[state=active]:bg-orange-500/20 dark:data-[state=active]:text-orange-500 data-[state=active]:border-orange-500 transition-all text-gray-700 dark:text-gray-300">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Simplifier</span>
                <span className="sm:hidden">Simple</span>
              </TabsTrigger>
              
              <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white dark:data-[state=active]:bg-orange-500/20 dark:data-[state=active]:text-orange-500 data-[state=active]:border-orange-500 transition-all text-gray-700 dark:text-gray-300">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">AI Chat</span>
                <span className="sm:hidden">Chat</span>
              </TabsTrigger>
              
              <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white dark:data-[state=active]:bg-orange-500/20 dark:data-[state=active]:text-orange-500 data-[state=active]:border-orange-500 transition-all text-gray-700 dark:text-gray-300">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
                <span className="sm:hidden">Hist</span>
              </TabsTrigger>
              
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white dark:data-[state=active]:bg-orange-500/20 dark:data-[state=active]:text-orange-500 data-[state=active]:border-orange-500 transition-all text-gray-700 dark:text-gray-300">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">Set</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="speech-to-text" className="mt-0">
              <SpeechToText fontSize={fontSize} />
            </TabsContent>

            <TabsContent value="text-to-speech" className="mt-0">
              <TextToSpeech fontSize={fontSize} />
            </TabsContent>

            <TabsContent value="simplifier" className="mt-0">
              <TextSimplifier fontSize={fontSize} />
            </TabsContent>

            <TabsContent value="chat" className="mt-0">
              <ChatMode fontSize={fontSize} />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <SessionHistory fontSize={fontSize} />
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <AccessibilitySettings
                fontSize={fontSize}
                setFontSize={setFontSize}
                highContrast={highContrast}
                setHighContrast={setHighContrast}
                autoSpeak={autoSpeak}
                setAutoSpeak={setAutoSpeak}
              />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-6 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-500/20 dark:to-orange-600/5 border-2 border-orange-300 dark:border-orange-500/30 shadow-md dark:shadow-orange-500/10 backdrop-blur-sm"
          >
            <Mic className="h-8 w-8 text-orange-500 mb-3" />
            <h3 className="text-orange-200 dark:text-orange-100">Real-time Transcription</h3>
            <p className="text-sm text-gray-700 dark:text-orange-50/90 mt-2">
              Convert speech to text instantly with high accuracy using advanced AI models.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-6 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-400/20 dark:to-orange-500/5 border-2 border-orange-300 dark:border-orange-400/30 shadow-md dark:shadow-orange-500/10 backdrop-blur-sm"
          >
            <MessageSquare className="h-8 w-8 text-orange-400 mb-3" />
            <h3 className="text-orange-200 dark:text-orange-100">Natural Voice Output</h3>
            <p className="text-sm text-gray-700 dark:text-orange-50/90 mt-2">
              Transform text into natural-sounding speech for users with visual impairments.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-6 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-600/20 dark:to-orange-700/5 border-2 border-orange-300 dark:border-orange-600/30 shadow-md dark:shadow-orange-500/10 backdrop-blur-sm"
          >
            <Sparkles className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="text-orange-200 dark:text-orange-100">AI Text Simplification</h3>
            <p className="text-sm text-gray-700 dark:text-orange-50/90 mt-2">
              Make complex content easier to understand with intelligent simplification.
            </p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t-2 border-orange-500/30">
          <div className="text-center text-sm text-gray-600 dark:text-orange-100/90">
            <p>
              <strong className="text-orange-500">EchoBridge</strong> - Making communication accessible for everyone
            </p>
            <p className="mt-2 text-gray-600 dark:text-orange-100/80">
              🔐 Privacy-focused | ♿ Accessibility-first | 🚀 AI-powered
            </p>
            <p className="mt-4 text-xs text-gray-500 dark:text-orange-100/60">
              Demo Mode: This is a prototype. Production version would integrate with 
              OpenAI Whisper, ElevenLabs, and GPT-4 APIs for enhanced functionality.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
