import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pause, Clock } from '@/components/ui/icons';
import type { TimeEntry } from '@/types/electron';

interface CompactTimerViewProps {
  onStop?: () => void;
}

export function CompactTimerView({ onStop }: CompactTimerViewProps) {
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const [previousTime, setPreviousTime] = useState<number>(0);

  // Fetch active timer on mount
  useEffect(() => {
    loadActiveTimer();

    // Listen for timer updates from main process
    const unsubscribe = window.electron.on('timer:updated', () => {
      loadActiveTimer();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Update elapsed time every second
  useEffect(() => {
    if (!activeTimer) {
      setElapsedTime('00:00:00');
      return;
    }

    const updateElapsed = () => {
      const now = Date.now();
      const currentSessionTime = now - activeTimer.start_time;
      const totalElapsed = previousTime * 1000 + currentSessionTime; // previousTime is in seconds, convert to ms

      const hours = Math.floor(totalElapsed / 3600000);
      const minutes = Math.floor((totalElapsed % 3600000) / 60000);
      const seconds = Math.floor((totalElapsed % 60000) / 1000);

      setElapsedTime(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [activeTimer, previousTime]);

  async function loadActiveTimer() {
    const timer = await window.electron.timer.getActive();
    setActiveTimer(timer);

    if (timer) {
      // Get total previous time for this task
      const totalTime = await window.electron.timer.getTotalTimeForTask(timer.task_id);
      setPreviousTime(totalTime);
    } else {
      setPreviousTime(0);
    }
  }

  async function handleStop() {
    await window.electron.timer.stop();
    setActiveTimer(null);
    onStop?.();
  }

  if (!activeTimer) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{activeTimer.task_name || 'Untitled Task'}</p>
              <p className="text-2xl font-bold tabular-nums">{elapsedTime}</p>
            </div>
          </div>
          <Button onClick={handleStop} variant="destructive" className="w-full">
            <Pause className="h-4 w-4 mr-2" />
            Stop Timer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
