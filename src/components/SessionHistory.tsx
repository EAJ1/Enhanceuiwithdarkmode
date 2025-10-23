import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Trash2, Download, Calendar, MessageSquare, Mic, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface Session {
  id: number;
  type: 'speech-to-text' | 'text-to-speech' | 'text-simplifier';
  content: string;
  timestamp: string;
}

interface SessionHistoryProps {
  fontSize: number;
}

export function SessionHistory({ fontSize }: SessionHistoryProps) {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const stored = localStorage.getItem('echobridge_sessions');
    if (stored) {
      setSessions(JSON.parse(stored));
    }
  };

  const deleteSession = (id: number) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    localStorage.setItem('echobridge_sessions', JSON.stringify(updated));
    toast.success('Session deleted');
  };

  const clearAllSessions = () => {
    setSessions([]);
    localStorage.removeItem('echobridge_sessions');
    toast.success('All sessions cleared');
  };

  const downloadSession = (session: Session) => {
    const blob = new Blob([session.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-${session.id}.txt`;
    a.click();
    toast.success('Session downloaded');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'speech-to-text':
        return <Mic className="h-4 w-4" />;
      case 'text-to-speech':
        return <MessageSquare className="h-4 w-4" />;
      case 'text-simplifier':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'speech-to-text':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'text-to-speech':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'text-simplifier':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-orange-200 dark:border-orange-500/30 shadow-lg shadow-orange-200/50 dark:shadow-orange-500/10 bg-white/80 dark:bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-orange-500">Session History</CardTitle>
              <CardDescription className="text-gray-600 dark:text-orange-100/90">
                View and manage your saved transcripts and sessions.
              </CardDescription>
            </div>
            {sessions.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all sessions?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all saved sessions. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAllSessions}>
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3>No sessions yet</h3>
              <p className="text-muted-foreground mt-2">
                Your saved sessions will appear here. Start using the app to create sessions!
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                <AnimatePresence>
                  {sessions.map((session) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="border-2 border-border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getTypeColor(session.type)}>
                            {getTypeIcon(session.type)}
                            <span className="ml-1 capitalize">
                              {session.type.replace(/-/g, ' ')}
                            </span>
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(session.timestamp)}
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <Button
                            onClick={() => downloadSession(session)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete session?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this session. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteSession(session.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      <div
                        className="p-3 bg-muted/50 rounded border border-border max-h-32 overflow-auto"
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        <p className="whitespace-pre-wrap line-clamp-4">
                          {session.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
