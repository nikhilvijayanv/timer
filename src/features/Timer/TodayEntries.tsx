import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Play } from '@/components/ui/icons';
import type { TimeEntry } from '@/types/electron';

interface TodayEntriesProps {
  refreshTrigger?: number;
  onTimerStart?: () => void;
}

export function TodayEntries({ refreshTrigger, onTimerStart }: TodayEntriesProps) {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [totalDuration, setTotalDuration] = useState<string>('0h 0m');
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [startingEntryId, setStartingEntryId] = useState<number | null>(null);

  useEffect(() => {
    loadTodayEntries();
    loadActiveTimer();

    // Listen for timer updates from main process
    const unsubscribe = window.electron.on('timer:updated', () => {
      loadActiveTimer();
      loadTodayEntries(); // Reload entries to get updated durations
    });

    return () => {
      unsubscribe();
    };
  }, [refreshTrigger]);

  async function loadTodayEntries() {
    const todayEntries = await window.electron.timer.getTodayEntries();
    setEntries(todayEntries);
    calculateTotalDuration(todayEntries);
  }

  async function loadActiveTimer() {
    const timer = await window.electron.timer.getActive();
    setActiveTimer(timer);
  }

  async function handleStartTimer(taskName: string, entryId: number) {
    setStartingEntryId(entryId);
    try {
      // Stop any existing timer first
      if (activeTimer) {
        await window.electron.timer.stop();
      }

      // Start the new timer
      await window.electron.timer.start(taskName);
      await loadActiveTimer();
      onTimerStart?.();
    } catch (error) {
      console.error('Failed to start timer:', error);
    } finally {
      setStartingEntryId(null);
    }
  }

  function calculateTotalDuration(entries: TimeEntry[]) {
    const total = entries.reduce((acc, entry) => {
      if (entry.duration_seconds) {
        return acc + entry.duration_seconds;
      }
      return acc;
    }, 0);

    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);

    setTotalDuration(`${hours}h ${minutes}m`);
  }

  function formatDuration(seconds: number | null): string {
    if (!seconds) return '0s';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
    }
    return `${secs}s`;
  }

  function formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No entries yet today. Start a timer to begin tracking!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Today's Entries</CardTitle>
          <Badge variant="secondary">{totalDuration}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px]">
          <div className="px-6 pb-4">
            {entries.map((entry, index) => {
              const isActive = activeTimer?.task_name === entry.task_name;
              const isStarting = startingEntryId === entry.id;

              return (
                <div key={entry.id}>
                  {index > 0 && <Separator className="my-3" />}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium leading-none">
                            {entry.task_name || 'Untitled Task'}
                          </p>
                          {isActive && (
                            <Badge variant="default" className="text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(entry.start_time)}
                          {entry.end_time && ` - ${formatTime(entry.end_time)}`}
                        </p>
                        {entry.notes && (
                          <p className="text-xs text-muted-foreground italic">{entry.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline">{formatDuration(entry.duration_seconds)}</Badge>
                        <Button
                          size="sm"
                          variant={isActive ? 'outline' : 'ghost'}
                          onClick={() => handleStartTimer(entry.task_name || 'Untitled Task', entry.id)}
                          disabled={isActive || isStarting}
                          className="h-7 px-2"
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
