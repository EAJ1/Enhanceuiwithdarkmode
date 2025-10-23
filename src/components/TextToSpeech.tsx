import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Play, Pause, Volume2, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import { WaveformVisualizer } from './WaveformVisualizer';

interface TextToSpeechProps {
  fontSize: number;
}

export function TextToSpeech({ fontSize }: TextToSpeechProps) {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState('default');
  const [rate, setRate] = useState([1]);
  const [pitch, setPitch] = useState([1]);

  const speakText = () => {
    if (!text.trim()) {
      toast.error('Please enter some text to speak');
      return;
    }

    // Check if browser supports Speech Synthesis
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate[0];
      utterance.pitch = pitch[0];

      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      if (voice !== 'default' && voices.length > 0) {
        const selectedVoice = voices.find(v => v.name === voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error', event);
        toast.error('Speech synthesis error');
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
      toast.success('Speaking...');
    } else {
      toast.error('Text-to-speech not supported in this browser');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      toast.info('Speech stopped');
    }
  };

  const downloadAudio = () => {
    toast.info('Audio download is a demo feature. In production, this would use ElevenLabs or Azure Speech API to generate and download audio files.');
  };

  const saveSession = () => {
    if (!text.trim()) {
      toast.error('No text to save');
      return;
    }

    const sessions = JSON.parse(localStorage.getItem('echobridge_sessions') || '[]');
    const newSession = {
      id: Date.now(),
      type: 'text-to-speech',
      content: text,
      timestamp: new Date().toISOString(),
    };
    sessions.push(newSession);
    localStorage.setItem('echobridge_sessions', JSON.stringify(sessions));
    toast.success('Session saved');
  };

  const getVoices = () => {
    if ('speechSynthesis' in window) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-orange-200 dark:border-orange-500/30 shadow-lg shadow-orange-200/50 dark:shadow-orange-500/10 bg-white/80 dark:bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-orange-500">Text to Speech</CardTitle>
          <CardDescription className="text-gray-600 dark:text-orange-100/90">
            Enter text below and click play to hear it spoken aloud.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Text Input */}
          <div className="space-y-2">
            <Label>Text to Speak</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="min-h-[200px] resize-none"
              style={{ fontSize: `${fontSize}px` }}
            />
          </div>

          {/* Voice Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Voice</Label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Voice</SelectItem>
                  {getVoices().slice(0, 5).map((v, i) => (
                    <SelectItem key={i} value={v.name}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Speed: {rate[0]}x</Label>
              <Slider
                value={rate}
                onValueChange={setRate}
                min={0.5}
                max={2}
                step={0.1}
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label>Pitch: {pitch[0]}</Label>
              <Slider
                value={pitch}
                onValueChange={setPitch}
                min={0.5}
                max={2}
                step={0.1}
                className="mt-2"
              />
            </div>
          </div>

          {/* Waveform Visualizer */}
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-xl p-6 backdrop-blur-sm border border-orange-500/20"
            >
              <WaveformVisualizer isActive={isSpeaking} color="#fb923c" />
            </motion.div>
          )}

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2">
            {!isSpeaking ? (
              <Button onClick={speakText} className="gap-2 bg-orange-500 hover:bg-orange-600 text-black">
                <Play className="h-4 w-4" />
                Play
              </Button>
            ) : (
              <Button onClick={stopSpeaking} variant="destructive" className="gap-2">
                <Pause className="h-4 w-4" />
                Stop
              </Button>
            )}
            <Button onClick={downloadAudio} variant="outline" className="gap-2 border-orange-500/50 hover:bg-orange-500/20 hover:border-orange-500">
              <Download className="h-4 w-4" />
              Download Audio
            </Button>
            <Button onClick={saveSession} variant="outline" className="border-orange-500/50 hover:bg-orange-500/20 hover:border-orange-500">
              Save Session
            </Button>
          </div>

          {/* Info */}
          <div className="p-4 bg-orange-50 dark:bg-orange-500/10 border-2 border-orange-200 dark:border-orange-500/30 rounded-lg shadow-sm">
            <div className="flex gap-2">
              <Volume2 className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700 dark:text-orange-50/90">
                  <strong className="text-orange-500 dark:text-orange-200">Demo Mode:</strong> Using browser's built-in text-to-speech. 
                  In production, this would integrate with ElevenLabs or Azure Speech for high-quality, natural-sounding voices.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
