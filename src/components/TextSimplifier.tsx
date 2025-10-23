import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Sparkles, Copy, ArrowRight } from 'lucide-react';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { Progress } from './ui/progress';

interface TextSimplifierProps {
  fontSize: number;
}

export function TextSimplifier({ fontSize }: TextSimplifierProps) {
  const [inputText, setInputText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mock LLM simplification
  const simplifyText = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to simplify');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simulate API processing with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock simplification logic
    let simplified = inputText;
    
    // Simple transformations to simulate LLM simplification
    const complexWords: { [key: string]: string } = {
      'utilize': 'use',
      'implement': 'do',
      'facilitate': 'help',
      'approximately': 'about',
      'consequently': 'so',
      'therefore': 'so',
      'nevertheless': 'but',
      'furthermore': 'also',
      'additionally': 'also',
      'subsequent': 'next',
      'commence': 'start',
      'terminate': 'end',
      'acquire': 'get',
      'demonstrate': 'show',
      'sufficient': 'enough',
    };

    Object.entries(complexWords).forEach(([complex, simple]) => {
      const regex = new RegExp('\\b' + complex + '\\b', 'gi');
      simplified = simplified.replace(regex, simple);
    });

    // Break long sentences
    simplified = simplified.replace(/([.!?])\s+/g, '$1\n\n');

    // Add a mock LLM prefix
    simplified = `Here's a simpler version:\n\n${simplified}`;

    clearInterval(interval);
    setProgress(100);
    setSimplifiedText(simplified);
    setIsProcessing(false);
    
    toast.success('Text simplified successfully');

    // Save to session
    const sessions = JSON.parse(localStorage.getItem('echobridge_sessions') || '[]');
    const newSession = {
      id: Date.now(),
      type: 'text-simplifier',
      content: `Original: ${inputText}\n\nSimplified: ${simplified}`,
      timestamp: new Date().toISOString(),
    };
    sessions.push(newSession);
    localStorage.setItem('echobridge_sessions', JSON.stringify(sessions));
  };

  const copySimplified = () => {
    navigator.clipboard.writeText(simplifiedText);
    toast.success('Simplified text copied to clipboard');
  };

  const loadExample = () => {
    const examples = [
      "The implementation of this comprehensive methodology facilitates the optimization of operational efficiency and consequently enhances organizational productivity.",
      "Subsequently, we must acquire sufficient resources to commence the project and demonstrate substantial progress.",
      "Nevertheless, the utilization of advanced technological solutions will facilitate the achievement of our objectives.",
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setInputText(randomExample);
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-orange-200 dark:border-orange-500/30 shadow-lg shadow-orange-200/50 dark:shadow-orange-500/10 bg-white/80 dark:bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-500">
            <Sparkles className="h-5 w-5 text-orange-500" />
            Text Simplifier
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-orange-100/90">
            Convert complex text into plain, easy-to-understand language using AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Complex Text</Label>
              <Button onClick={loadExample} variant="ghost" size="sm">
                Load Example
              </Button>
            </div>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste complex or difficult-to-read text here..."
              className="min-h-[150px] resize-none"
              style={{ fontSize: `${fontSize}px` }}
            />
          </div>

          {/* Process Button */}
          <div className="flex justify-center">
            <Button
              onClick={simplifyText}
              disabled={isProcessing || !inputText.trim()}
              className="gap-2 bg-orange-500 hover:bg-orange-600 text-black"
              size="lg"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Simplify Text
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {/* Progress */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-gray-600 dark:text-orange-100/90">
                AI is simplifying your text...
              </p>
            </motion.div>
          )}

          {/* Output Section */}
          <AnimatePresence>
            {simplifiedText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-2"
              >
                <Label>Simplified Text</Label>
                <div
                  className="min-h-[150px] p-6 bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-lg border-2 border-green-500/20"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  <p className="whitespace-pre-wrap">{simplifiedText}</p>
                </div>

                <Button onClick={copySimplified} variant="outline" size="sm" className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copy Simplified Text
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info */}
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex gap-2">
              <Sparkles className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm">
                  <strong>Demo Mode:</strong> Using basic text simplification. 
                  In production, this would integrate with GPT-4 or Claude API for intelligent text simplification and readability improvement.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
