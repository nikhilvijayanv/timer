import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Play } from '@/components/ui/icons';
import type { Task, TimeEntry } from '@/types/electron';

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [startingTaskId, setStartingTaskId] = useState<number | null>(null);
  const [taskTimes, setTaskTimes] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    loadTasks();
    loadActiveTimer();

    // Listen for timer updates from main process
    const unsubscribe = window.electron.on('timer:updated', () => {
      loadActiveTimer();
      loadTasks(); // Reload to update times
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function loadTasks() {
    const allTasks = await window.electron.tasks.getAll();
    setTasks(allTasks);

    // Load total time for each task
    const times = new Map<number, number>();
    for (const task of allTasks) {
      const totalSeconds = await window.electron.timer.getTotalTimeForTask(task.id);
      times.set(task.id, totalSeconds);
    }
    setTaskTimes(times);
  }

  async function loadActiveTimer() {
    const timer = await window.electron.timer.getActive();
    setActiveTimer(timer);
  }

  async function handleStartTimer(taskName: string, taskId: number) {
    setStartingTaskId(taskId);
    try {
      // Stop any existing timer first
      if (activeTimer) {
        await window.electron.timer.stop();
      }

      // Start the new timer
      await window.electron.timer.start(taskName);
      await loadActiveTimer();
    } catch (error) {
      console.error('Failed to start timer:', error);
    } finally {
      setStartingTaskId(null);
    }
  }

  async function handleCreateTask() {
    if (!newTaskName.trim()) {
      return;
    }

    setIsCreating(true);
    try {
      await window.electron.tasks.create(newTaskName.trim());
      setNewTaskName('');
      await loadTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsCreating(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreateTask();
    }
  }

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function formatDuration(seconds: number): string {
    if (seconds === 0) return '0s';

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Task Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="new-task" className="text-sm font-medium">
            Create New Task
          </label>
          <div className="flex gap-2">
            <Input
              id="new-task"
              type="text"
              placeholder="Task name..."
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isCreating}
              className="flex-1"
            />
            <Button onClick={handleCreateTask} disabled={!newTaskName.trim() || isCreating}>
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm font-medium">
            All Tasks{' '}
            <Badge variant="secondary" className="ml-2">
              {tasks.length}
            </Badge>
          </div>
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No tasks yet. Create your first task above!
            </p>
          ) : (
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {tasks.map((task) => {
                  const isActive = activeTimer?.task_name === task.name;
                  const isStarting = startingTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        isActive
                          ? 'bg-primary/10 border-primary'
                          : 'bg-card hover:bg-accent/50'
                      }`}
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium leading-none">{task.name}</p>
                          {isActive && (
                            <Badge variant="default" className="text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            Created {formatDate(task.created_at)}
                          </p>
                          {taskTimes.get(task.id) !== undefined && taskTimes.get(task.id)! > 0 && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <Badge variant="secondary" className="text-xs">
                                {formatDuration(taskTimes.get(task.id)!)}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={isActive ? 'outline' : 'default'}
                        onClick={() => handleStartTimer(task.name, task.id)}
                        disabled={isActive || isStarting}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        {isStarting ? 'Starting...' : isActive ? 'Running' : 'Start'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
