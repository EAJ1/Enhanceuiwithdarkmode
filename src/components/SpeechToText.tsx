import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Mic, MicOff, Download, Copy, Trash2, Settings } from 'lucide-react';
import { WaveformVisualizer } from './WaveformVisualizer';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface SpeechToTextProps {
  fontSize: number;
}

export function SpeechToText({ fontSize }: SpeechToTextProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [useRealMicrophone, setUseRealMicrophone] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const [showSettings, setShowSettings] = useState(false);
  const recognitionRef = useRef<any>(null);
  const mockIntervalRef = useRef<any>(null);
  const isRecordingRef = useRef(false);

  // Demo phrases for mock transcription
  const demoTranscripts = [
    "Hello, this is a demonstration of the speech to text feature.",
    "The quick brown fox jumps over the lazy dog.",
    "Accessibility is important for creating inclusive applications.",
    "This AI-powered tool helps people with hearing or speech difficulties.",
    "Real-time transcription makes communication easier for everyone.",
    "Welcome to EchoBridge, your accessibility companion.",
    "Speech recognition technology is advancing rapidly.",
    "Creating accessible applications benefits everyone in society.",
  ];

  // Keep ref in sync with state
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Initialize speech recognition
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setPermissionStatus(result.state);
        
        result.addEventListener('change', () => {
          setPermissionStatus(result.state);
        });
      } catch (error) {
        setPermissionStatus('unknown');
      }
    };

    checkPermissions();

    // Setup Web Speech API if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptPart + ' ';
          } else {
            interim += transcriptPart;
          }
        }

        if (final) {
          setTranscript(prev => prev + final);
          setInterimTranscript('');
        } else if (interim) {
          setInterimTranscript(interim);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          toast.error('Microphone access denied. Switching to demo mode.', {
            duration: 4000,
          });
          setPermissionStatus('denied');
          setUseRealMicrophone(false);
          setIsRecording(false);
        } else if (event.error === 'no-speech') {
          toast.info('No speech detected. Try speaking closer to the microphone.');
        } else if (event.error === 'network') {
          toast.error('Network error occurred. Switching to demo mode.');
          setUseRealMicrophone(false);
          setIsRecording(false);
        } else if (event.error === 'aborted') {
          // Normal stop, don't show error
          setIsRecording(false);
        } else {
          toast.error(`Error: ${event.error}`);
          setIsRecording(false);
        }
      };

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setInterimTranscript('');
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        // Only restart if we're supposed to be recording
        if (isRecordingRef.current && useRealMicrophone) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.log('Could not restart recognition');
            setIsRecording(false);
          }
        } else {
          setIsRecording(false);
          setInterimTranscript('');
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Already stopped
        }
      }
      if (mockIntervalRef.current) {
        clearInterval(mockIntervalRef.current);
      }
    };
  }, [useRealMicrophone]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
      return;
    }

    // Demo mode (default)
    if (!useRealMicrophone) {
      startMockRecording();
      return;
    }

    // Real microphone mode
    if (permissionStatus === 'denied') {
      toast.error('Microphone access is blocked. Please enable it in browser settings or use demo mode.', {
        duration: 5000,
      });
      return;
    }

    if (!recognitionRef.current) {
      toast.info('Speech Recognition not supported in this browser. Using demo mode.');
      setUseRealMicrophone(false);
      startMockRecording();
      return;
    }

    try {
      recognitionRef.current.start();
      setIsRecording(true);
      toast.success('🎤 Listening... Speak now!');
    } catch (error: any) {
      console.error('Recognition start error:', error);
      
      if (error.message?.includes('already started')) {
        setIsRecording(true);
      } else {
        toast.error('Could not start microphone. Using demo mode.');
        setUseRealMicrophone(false);
        startMockRecording();
      }
    }
  }, [isRecording, useRealMicrophone, permissionStatus]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    isRecordingRef.current = false;

    if (recognitionRef.current && useRealMicrophone) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Recognition already stopped');
      }
    }

    if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current);
      mockIntervalRef.current = null;
    }

    setInterimTranscript('');
    toast.success('Recording stopped');
  }, [useRealMicrophone]);

  const startMockRecording = useCallback(() => {
    setIsRecording(true);
    isRecordingRef.current = true;
    setInterimTranscript('');
    
    const demoText = demoTranscripts[Math.floor(Math.random() * demoTranscripts.length)];
    const words = demoText.split(' ');
    let currentIndex = 0;

    toast.success('🎬 Demo mode - Simulating speech recognition');

    mockIntervalRef.current = setInterval(() => {
      if (currentIndex < words.length && isRecordingRef.current) {
        // Show current word as interim
        setInterimTranscript(words[currentIndex]);
        
        // After a short delay, add to final transcript
        setTimeout(() => {
          if (isRecordingRef.current) {
            setTranscript(prev => prev + (prev ? ' ' : '') + words[currentIndex]);
            setInterimTranscript('');
          }
        }, 200);
        
        currentIndex++;
      } else {
        if (mockIntervalRef.current) {
          clearInterval(mockIntervalRef.current);
          mockIntervalRef.current = null;
        }
        setIsRecording(false);
        isRecordingRef.current = false;
        setInterimTranscript('');
        toast.success('✓ Demo recording complete');
      }
    }, 400);
  }, [demoTranscripts]);

  const copyToClipboard = () => {
    const fullText = transcript + (interimTranscript ? interimTranscript : '');
    navigator.clipboard.writeText(fullText);
    toast.success('📋 Transcript copied to clipboard');
  };

  const downloadTranscript = () => {
    const fullText = transcript + (interimTranscript ? interimTranscript : '');
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('💾 Transcript downloaded');
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    toast.info('🗑️ Transcript cleared');
  };

  const saveSession = () => {
    const fullText = transcript + (interimTranscript ? interimTranscript : '');
    
    if (!fullText.trim()) {
      toast.error('No transcript to save');
      return;
    }

    const sessions = JSON.parse(localStorage.getItem('echobridge_sessions') || '[]');
    const newSession = {
      id: Date.now(),
      type: 'speech-to-text',
      content: fullText,
      timestamp: new Date().toISOString(),
    };
    sessions.push(newSession);
    localStorage.setItem('echobridge_sessions', JSON.stringify(sessions));
    toast.success('💾 Session saved successfully');
  };

  const displayText = transcript + (interimTranscript ? ' ' + interimTranscript : '');

  return (
    <div className="space-y-6">
      <Card className="border-2 border-orange-200 dark:border-orange-500/30 shadow-lg shadow-orange-200/50 dark:shadow-orange-500/10 bg-white/80 dark:bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-orange-500">Speech to Text</CardTitle>
              <CardDescription className="text-gray-600 dark:text-orange-100/90">
                {useRealMicrophone 
                  ? '🎤 Real microphone mode - Speak to transcribe'
                  : '🎬 Demo mode - Click to simulate speech recognition'
                }
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="hover:bg-orange-500/20 text-orange-400 shrink-0"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-500/10 border-2 border-orange-200 dark:border-orange-500/30 rounded-lg space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5 flex-1">
                      <Label htmlFor="real-mic" className="text-gray-900 dark:text-orange-50">
                        Use Real Microphone
                      </Label>
                      <p className="text-sm text-gray-700 dark:text-orange-100/80">
                        Enable actual speech recognition (requires browser permission)
                      </p>
                    </div>
                    <Switch
                      id="real-mic"
                      checked={useRealMicrophone}
                      onCheckedChange={setUseRealMicrophone}
                      disabled={isRecording}
                    />
                  </div>

                  {useRealMicrophone && permissionStatus === 'denied' && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/30 rounded"
                    >
                      <p className="text-sm text-red-300">
                        ⚠️ Microphone access blocked. Enable it in your browser settings.
                      </p>
                    </motion.div>
                  )}

                  {!useRealMicrophone && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-blue-500/10 border border-blue-500/30 rounded"
                    >
                      <p className="text-sm text-blue-200">
                        💡 Demo mode simulates speech recognition - no microphone needed!
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Waveform Visualizer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-500/10 dark:to-orange-600/5 rounded-xl p-6 backdrop-blur-sm border-2 border-orange-200 dark:border-orange-500/20 shadow-sm"
          >
            <WaveformVisualizer isActive={isRecording} color={isRecording ? '#f97316' : '#fb923c'} />
          </motion.div>

          {/* Recording Controls */}
          <div className="flex flex-col items-center gap-4">
            <motion.div
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button
                onClick={toggleRecording}
                size="lg"
                className={`rounded-full h-24 w-24 shadow-2xl transition-all duration-300 ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/50'
                    : 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/50'
                }`}
              >
                {isRecording ? (
                  <MicOff className="h-10 w-10 text-white" />
                ) : (
                  <Mic className="h-10 w-10 text-black" />
                )}
              </Button>
            </motion.div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-gray-700 dark:text-orange-100/90">
                {isRecording ? (
                  <span className="text-red-500 dark:text-red-400 animate-pulse inline-flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    {useRealMicrophone ? 'Recording... Speak now' : 'Demo recording...'}
                  </span>
                ) : (
                  <span className="text-gray-700 dark:text-orange-100">
                    {useRealMicrophone 
                      ? 'Click to start recording with your microphone'
                      : 'Click to start demo recording'
                    }
                  </span>
                )}
              </p>
            </motion.div>
          </div>

          {/* Transcript Display */}
          <AnimatePresence>
            {displayText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div
                  className="min-h-[200px] max-h-[400px] p-6 bg-orange-50/50 dark:bg-black/30 rounded-lg border-2 border-orange-200 dark:border-orange-500/30 overflow-auto shadow-inner"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  <p className="whitespace-pre-wrap text-gray-900 dark:text-orange-50">
                    {transcript}
                    {interimTranscript && (
                      <span className="text-gray-600 dark:text-orange-200/70 italic">
                        {' '}{interimTranscript}
                      </span>
                    )}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={copyToClipboard} 
                    variant="outline" 
                    size="sm" 
                    className="border-orange-300 dark:border-orange-500/50 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:border-orange-500 text-gray-700 dark:text-orange-200"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button 
                    onClick={downloadTranscript} 
                    variant="outline" 
                    size="sm" 
                    className="border-orange-300 dark:border-orange-500/50 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:border-orange-500 text-gray-700 dark:text-orange-200"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    onClick={saveSession} 
                    variant="outline" 
                    size="sm" 
                    className="border-orange-300 dark:border-orange-500/50 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:border-orange-500 text-gray-700 dark:text-orange-200"
                  >
                    Save Session
                  </Button>
                  <Button 
                    onClick={clearTranscript} 
                    variant="outline" 
                    size="sm" 
                    className="border-orange-300 dark:border-orange-500/50 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:border-orange-500 text-gray-700 dark:text-orange-200"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
