# Task 25: Add Real-Time Elapsed Time Calculation in UI

**Phase:** 6 - Timer Logic & Integration
**Dependencies:** Task 19 (Timer components), Task 24 (Timer integration)

## Description
Implement on-demand elapsed time calculation in the UI (no background intervals in main process) as specified in project requirements.

## Implementation Steps

1. **Create time utilities hook**
   Create `src/hooks/useElapsedTime.ts`:
   ```typescript
   import { useState, useEffect } from 'react';

   /**
    * Hook to calculate elapsed time from a start timestamp
    * Updates every second while mounted
    */
   export function useElapsedTime(startTime: number | null): number {
     const [elapsed, setElapsed] = useState(0);

     useEffect(() => {
       if (!startTime) {
         setElapsed(0);
         return;
       }

       // Calculate immediately
       const calculateElapsed = () => {
         const now = Date.now();
         const seconds = Math.floor((now - startTime) / 1000);
         setElapsed(seconds);
       };

       calculateElapsed();

       // Update every second
       const interval = setInterval(calculateElapsed, 1000);

       return () => clearInterval(interval);
     }, [startTime]);

     return elapsed;
   }
   ```

2. **Create time formatting utilities**
   Create `src/lib/timeFormat.ts`:
   ```typescript
   /**
    * Format seconds into human-readable time string
    */
   export function formatDuration(seconds: number): string {
     const hours = Math.floor(seconds / 3600);
     const minutes = Math.floor((seconds % 3600) / 60);
     const secs = seconds % 60;

     if (hours > 0) {
       return `${hours}:${pad(minutes)}:${pad(secs)}`;
     }
     return `${minutes}:${pad(secs)}`;
   }

   /**
    * Format seconds into short duration (e.g., "1h 23m")
    */
   export function formatDurationShort(seconds: number): string {
     const hours = Math.floor(seconds / 3600);
     const minutes = Math.floor((seconds % 3600) / 60);

     if (hours > 0) {
       return `${hours}h ${minutes}m`;
     }
     if (minutes > 0) {
       return `${minutes}m`;
     }
     return `${seconds}s`;
   }

   /**
    * Format seconds into compact duration (e.g., "1:23:45")
    */
   export function formatDurationCompact(seconds: number): string {
     const hours = Math.floor(seconds / 3600);
     const minutes = Math.floor((seconds % 3600) / 60);
     const secs = seconds % 60;

     const parts: string[] = [];

     if (hours > 0) {
       parts.push(hours.toString());
       parts.push(pad(minutes));
       parts.push(pad(secs));
     } else {
       parts.push(minutes.toString());
       parts.push(pad(secs));
     }

     return parts.join(':');
   }

   /**
    * Pad number with leading zero
    */
   function pad(num: number): string {
     return num.toString().padStart(2, '0');
   }

   /**
    * Get elapsed seconds from start time
    */
   export function getElapsedSeconds(startTime: number): number {
     return Math.floor((Date.now() - startTime) / 1000);
   }
   ```

3. **Update CompactTimerView to use hook**
   Update `src/features/Timer/CompactTimerView.tsx`:
   ```typescript
   import { useElapsedTime } from '@/hooks/useElapsedTime';
   import { formatDurationCompact } from '@/lib/timeFormat';

   export function CompactTimerView() {
     const { activeTimer, refreshTimer } = useTimer();
     const elapsed = useElapsedTime(activeTimer?.start_time || null);
     const [error, setError] = useState<string | null>(null);
     const [isStopping, setIsStopping] = useState(false);

     const handleStop = async () => {
       setError(null);
       setIsStopping(true);
       try {
         await window.electron.timer.stop();
         await refreshTimer();
       } catch (err) {
         console.error('Error stopping timer:', err);
         setError('Failed to stop timer.');
       } finally {
         setIsStopping(false);
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
                   {formatDurationCompact(elapsed)}
                 </p>
               </div>
             </div>
             <Button
               variant="outline"
               size="icon"
               onClick={handleStop}
               disabled={isStopping}
               className="shrink-0"
             >
               {isStopping ? (
                 <Loader className="h-4 w-4 animate-spin" />
               ) : (
                 <Square className="h-4 w-4" />
               )}
             </Button>
           </div>
           {error && (
             <p className="text-xs text-destructive mt-2">{error}</p>
           )}
         </CardContent>
       </Card>
     );
   }
   ```

4. **Update TodayEntries to use formatting**
   Update the formatDuration function in `TodayEntries.tsx`:
   ```typescript
   import { formatDurationShort } from '@/lib/timeFormat';

   function TimeEntryItem({ entry, onDelete, onUpdateNotes }: Props) {
     // ... existing code ...

     return (
       <Card className="mb-2">
         <CardContent className="p-3">
           {/* ... existing code ... */}
           <Badge variant="secondary" className="text-xs">
             {entry.duration_seconds
               ? formatDurationShort(entry.duration_seconds)
               : 'Active'}
           </Badge>
           {/* ... rest of component ... */}
         </CardContent>
       </Card>
     );
   }
   ```

5. **Add tabular-nums font for time display**
   Update `src/index.css`:
   ```css
   /* Add tabular numbers for consistent time display */
   .tabular-nums {
     font-variant-numeric: tabular-nums;
   }
   ```

6. **Test elapsed time accuracy**
   Create test component (temporary):
   ```typescript
   // src/components/TimeTest.tsx
   import { useElapsedTime } from '@/hooks/useElapsedTime';
   import { formatDurationCompact } from '@/lib/timeFormat';

   export function TimeTest() {
     const testStart = Date.now() - 3661000; // 1h 1m 1s ago
     const elapsed = useElapsedTime(testStart);

     return (
       <div className="p-4 border rounded">
         <h3>Time Test</h3>
         <p>Elapsed: {elapsed}s</p>
         <p>Formatted: {formatDurationCompact(elapsed)}</p>
         <p>Expected: ~1:01:01 and counting</p>
       </div>
     );
   }
   ```

7. **Verify no background intervals in main process**
   Review main process code to ensure:
   - No setInterval for time tracking in TimerService
   - Only tray update interval exists (1 second for display)
   - All time calculations are on-demand

8. **Performance test**
   ```bash
   npm run dev
   ```

   Test:
   - Start a timer
   - Watch for 5 minutes
   - Check CPU usage (should be minimal)
   - Verify time updates smoothly every second
   - Stop and start multiple times
   - Check no memory leaks (use browser DevTools)

## Acceptance Criteria
- [ ] useElapsedTime hook calculates time correctly
- [ ] Time formats display properly (MM:SS and H:MM:SS)
- [ ] Time updates every second in UI
- [ ] No background interval in main process (except tray)
- [ ] CPU usage minimal when timer running
- [ ] Time accurate to the second
- [ ] Works correctly across window hide/show
- [ ] Tabular nums font for consistent width

## Time Display Examples
```
0 seconds:    0:00
59 seconds:   0:59
1 minute:     1:00
10 minutes:   10:00
1 hour:       1:00:00
10 hours:     10:00:00
```

## Performance Targets
- **CPU usage:** < 1% when idle with timer running
- **Memory:** No memory growth over time
- **Accuracy:** ±1 second (acceptable for UI)
- **Update lag:** < 16ms (60fps)

## Architectural Note
Per project requirements:
> "No background setInterval; UI calculates elapsed time on demand"

This means:
- ✅ Renderer process: setInterval in React hooks (ok)
- ✅ Main process tray: setInterval for display only (ok)
- ❌ Main process timer: NO setInterval for time tracking

## References
- project_init.md line 56 (No background setInterval requirement)
- project_init.md lines 158-161 (Renderer components)
