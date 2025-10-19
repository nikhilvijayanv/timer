# Task 19: Create Timer Feature Components (CompactTimerView, QuickTaskEntry)

**Phase:** 5 - React UI Components
**Dependencies:** Task 07, 08, 09 (shadcn/ui, theme, icons configured), Task 16 (IPC bridge)

## Description

Build the core timer UI components: CompactTimerView (shows active timer with stop button) and QuickTaskEntry (start new timer input).

## Implementation Steps

1. **Create Timer context for state management**
   Create `src/contexts/TimerContext.tsx`:

   ```typescript
   import React, { createContext, useContext, useState, useEffect } from 'react';

   interface TimeEntry {
     id: number;
     task_id: number;
     start_time: number;
     end_time: number | null;
     duration_seconds: number | null;
     notes: string | null;
     task_name?: string;
   }

   interface TimerContextType {
     activeTimer: TimeEntry | null;
     isLoading: boolean;
     refreshTimer: () => Promise<void>;
   }

   const TimerContext = createContext<TimerContextType | undefined>(undefined);

   export function TimerProvider({ children }: { children: React.ReactNode }) {
     const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
     const [isLoading, setIsLoading] = useState(true);

     const refreshTimer = async () => {
       try {
         const timer = await window.electron.timer.getActive();
         setActiveTimer(timer);
       } catch (error) {
         console.error('Error fetching active timer:', error);
       } finally {
         setIsLoading(false);
       }
     };

     useEffect(() => {
       refreshTimer();

       // Listen for timer updates from main process
       const unsubscribe = window.electron.on('timer:updated', () => {
         refreshTimer();
       });

       return () => {
         unsubscribe();
       };
     }, []);

     return (
       <TimerContext.Provider value={{ activeTimer, isLoading, refreshTimer }}>
         {children}
       </TimerContext.Provider>
     );
   }

   export function useTimer() {
     const context = useContext(TimerContext);
     if (context === undefined) {
       throw new Error('useTimer must be used within a TimerProvider');
     }
     return context;
   }
   ```

2. **Create CompactTimerView component**
   Create `src/features/Timer/CompactTimerView.tsx`:

   ```typescript
   import { useState, useEffect } from 'react';
   import { Button } from '@/components/ui/button';
   import { Card, CardContent } from '@/components/ui/card';
   import { Badge } from '@/components/ui/badge';
   import { Square, Clock } from '@/components/ui/icons';
   import { useTimer } from '@/contexts/TimerContext';

   function formatElapsedTime(startTime: number): string {
     const elapsed = Math.floor((Date.now() - startTime) / 1000);
     const hours = Math.floor(elapsed / 3600);
     const minutes = Math.floor((elapsed % 3600) / 60);
     const seconds = elapsed % 60;

     if (hours > 0) {
       return `${hours}:${pad(minutes)}:${pad(seconds)}`;
     }
     return `${minutes}:${pad(seconds)}`;
   }

   function pad(num: number): string {
     return num.toString().padStart(2, '0');
   }

   export function CompactTimerView() {
     const { activeTimer, refreshTimer } = useTimer();
     const [elapsedTime, setElapsedTime] = useState('0:00');

     useEffect(() => {
       if (!activeTimer) {
         setElapsedTime('0:00');
         return;
       }

       // Update elapsed time every second
       const updateTime = () => {
         setElapsedTime(formatElapsedTime(activeTimer.start_time));
       };

       updateTime();
       const interval = setInterval(updateTime, 1000);

       return () => clearInterval(interval);
     }, [activeTimer]);

     const handleStop = async () => {
       try {
         await window.electron.timer.stop();
         await refreshTimer();
       } catch (error) {
         console.error('Error stopping timer:', error);
       }
     };

     if (!activeTimer) {
       return null;
     }

     return (
       <Card className="border-primary/20 bg-primary/5">
         <CardContent className="p-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Clock className="h-5 w-5 text-primary animate-pulse" />
               <div>
                 <p className="text-sm font-medium text-muted-foreground">
                   {activeTimer.task_name}
                 </p>
                 <p className="text-2xl font-bold tabular-nums">
                   {elapsedTime}
                 </p>
               </div>
             </div>
             <Button
               variant="outline"
               size="icon"
               onClick={handleStop}
               className="shrink-0"
             >
               <Square className="h-4 w-4" />
             </Button>
           </div>
         </CardContent>
       </Card>
     );
   }
   ```

3. **Create QuickTaskEntry component**
   Create `src/features/Timer/QuickTaskEntry.tsx`:

   ```typescript
   import { useState } from 'react';
   import { Button } from '@/components/ui/button';
   import { Input } from '@/components/ui/input';
   import { Play } from '@/components/ui/icons';
   import { useTimer } from '@/contexts/TimerContext';

   export function QuickTaskEntry() {
     const { activeTimer, refreshTimer } = useTimer();
     const [taskName, setTaskName] = useState('');
     const [isStarting, setIsStarting] = useState(false);

     const handleStart = async () => {
       if (!taskName.trim() || activeTimer) return;

       setIsStarting(true);
       try {
         await window.electron.timer.start(taskName.trim());
         setTaskName('');
         await refreshTimer();
       } catch (error) {
         console.error('Error starting timer:', error);
       } finally {
         setIsStarting(false);
       }
     };

     const handleKeyPress = (e: React.KeyboardEvent) => {
       if (e.key === 'Enter') {
         handleStart();
       }
     };

     // Hide if timer is already running
     if (activeTimer) {
       return null;
     }

     return (
       <div className="flex gap-2">
         <Input
           type="text"
           placeholder="What are you working on?"
           value={taskName}
           onChange={(e) => setTaskName(e.target.value)}
           onKeyPress={handleKeyPress}
           disabled={isStarting}
           className="flex-1"
         />
         <Button
           onClick={handleStart}
           disabled={!taskName.trim() || isStarting}
           className="shrink-0"
         >
           <Play className="h-4 w-4 mr-2" />
           Start
         </Button>
       </div>
     );
   }
   ```

4. **Create Timer feature index**
   Create `src/features/Timer/index.ts`:

   ```typescript
   export { CompactTimerView } from './CompactTimerView';
   export { QuickTaskEntry } from './QuickTaskEntry';
   ```

5. **Update App.tsx to use timer components**

   ```typescript
   import { CompactTimerView, QuickTaskEntry } from '@/features/Timer';
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
   import { Clock, Settings } from '@/components/ui/icons';
   import { Button } from '@/components/ui/button';

   function App() {
     return (
       <div className="w-full h-full bg-background flex flex-col">
         <Card className="flex-1 rounded-none border-0 shadow-none">
           <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
             <div className="flex items-center gap-2">
               <Clock className="h-5 w-5" />
               <CardTitle className="text-lg">Timer</CardTitle>
             </div>
             <Button variant="ghost" size="icon">
               <Settings className="h-4 w-4" />
             </Button>
           </CardHeader>

           <CardContent className="space-y-4">
             <CompactTimerView />
             <QuickTaskEntry />
           </CardContent>
         </Card>
       </div>
     );
   }

   export default App;
   ```

6. **Wrap App with TimerProvider**
   Update `src/main.tsx`:

   ```typescript
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import { ThemeProvider } from './contexts/ThemeContext';
   import { TimerProvider } from './contexts/TimerContext';
   import './index.css';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <ThemeProvider>
         <TimerProvider>
           <App />
         </TimerProvider>
       </ThemeProvider>
     </React.StrictMode>
   );
   ```

7. **Test timer components**

   ```bash
   npm run dev
   ```

   Test:
   - Enter a task name and click Start
   - CompactTimerView should appear with running time
   - QuickTaskEntry should hide when timer is active
   - Time should update every second
   - Click stop button to end timer
   - QuickTaskEntry should reappear

## Acceptance Criteria

- [ ] TimerContext provides active timer state
- [ ] CompactTimerView shows when timer is running
- [ ] Elapsed time updates every second
- [ ] Time formatted as MM:SS or H:MM:SS
- [ ] Stop button works correctly
- [ ] QuickTaskEntry accepts task name input
- [ ] Enter key starts timer
- [ ] QuickTaskEntry hidden when timer active
- [ ] UI updates when timer starts/stops

## Component Behavior

- **CompactTimerView:**
  - Only visible when timer is active
  - Shows task name and elapsed time
  - Updates time display every second
  - Stop button ends timer

- **QuickTaskEntry:**
  - Only visible when no timer is active
  - Text input for task name
  - Start button (disabled if input empty)
  - Enter key submits

## References

- project_init.md lines 158-161 (Renderer components)
- project_init.md lines 56 (No background setInterval - UI calculates on demand)
