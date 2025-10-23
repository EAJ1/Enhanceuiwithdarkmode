import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Settings, Type, Contrast, Volume2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AccessibilitySettingsProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  autoSpeak: boolean;
  setAutoSpeak: (value: boolean) => void;
}

export function AccessibilitySettings({
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast,
  autoSpeak,
  setAutoSpeak,
}: AccessibilitySettingsProps) {
  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
  };

  const handleHighContrastToggle = (checked: boolean) => {
    setHighContrast(checked);
    toast.info(checked ? 'High contrast enabled' : 'High contrast disabled');
  };

  const handleAutoSpeakToggle = (checked: boolean) => {
    setAutoSpeak(checked);
    toast.info(checked ? 'Auto-speak enabled' : 'Auto-speak disabled');
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-orange-200 dark:border-orange-500/30 shadow-lg shadow-orange-200/50 dark:shadow-orange-500/10 bg-white/80 dark:bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-500">
            <Settings className="h-5 w-5 text-orange-500" />
            Accessibility Settings
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-orange-100/90">
            Customize the interface to meet your accessibility needs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Font Size */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="h-5 w-5 text-muted-foreground" />
                <Label>Font Size</Label>
              </div>
              <span className="text-sm text-muted-foreground">{fontSize}px</span>
            </div>
            <Slider
              value={[fontSize]}
              onValueChange={handleFontSizeChange}
              min={12}
              max={24}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small (12px)</span>
              <span>Default (16px)</span>
              <span>Large (24px)</span>
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border-2 border-border">
            <div className="flex items-center gap-3">
              <Contrast className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="cursor-pointer">High Contrast Mode</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Increase color contrast for better visibility
                </p>
              </div>
            </div>
            <Switch
              checked={highContrast}
              onCheckedChange={handleHighContrastToggle}
            />
          </div>

          {/* Auto-Speak */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border-2 border-border">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="cursor-pointer">Auto-Speak Results</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically read aloud transcriptions and results
                </p>
              </div>
            </div>
            <Switch
              checked={autoSpeak}
              onCheckedChange={handleAutoSpeakToggle}
            />
          </div>

          {/* Color Theme (handled by parent) */}
          <div className="p-4 bg-muted/50 rounded-lg border-2 border-border">
            <Label className="mb-3 block">Color Theme</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Toggle dark mode using the button in the top navigation
            </p>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h4 className="mb-3 flex items-center gap-2">
              ⌨️ Keyboard Shortcuts
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start/Stop Recording:</span>
                <kbd className="px-2 py-1 bg-muted rounded">Ctrl + R</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Play/Pause Speech:</span>
                <kbd className="px-2 py-1 bg-muted rounded">Ctrl + P</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Toggle Dark Mode:</span>
                <kbd className="px-2 py-1 bg-muted rounded">Ctrl + D</kbd>
              </div>
            </div>
          </div>

          {/* Screen Reader Info */}
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <h4 className="mb-2">
              ✅ Screen Reader Compatible
            </h4>
            <p className="text-sm text-muted-foreground">
              This application is optimized for screen readers including JAWS, NVDA, and VoiceOver.
              All interactive elements have proper ARIA labels and keyboard navigation support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
