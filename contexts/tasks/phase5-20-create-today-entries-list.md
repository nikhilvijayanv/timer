# Task 20: Build TodayEntries List Component

**Phase:** 5 - React UI Components
**Dependencies:** Task 19 (Timer components), Task 16 (IPC bridge)

## Description
Create a scrollable list component that displays all time entries logged today, with options to add notes and delete entries.

## Implementation Steps

1. **Create TodayEntries component**
   Create `src/features/Timer/TodayEntries.tsx`:
   ```typescript
   import { useState, useEffect } from 'react';
   import { ScrollArea } from '@/components/ui/scroll-area';
   import { Card, CardContent } from '@/components/ui/card';
   import { Badge } from '@/components/ui/badge';
   import { Button } from '@/components/ui/button';
   import { Separator } from '@/components/ui/separator';
   import { Trash2, Edit3, CheckCircle2 } from '@/components/ui/icons';
   import { Input } from '@/components/ui/input';

   interface TimeEntry {
     id: number;
     task_id: number;
     start_time: number;
     end_time: number | null;
     duration_seconds: number | null;
     notes: string | null;
     task_name?: string;
   }

   function formatTime(timestamp: number): string {
     const date = new Date(timestamp);
     return date.toLocaleTimeString('en-US', {
       hour: 'numeric',
       minute: '2-digit',
       hour12: true,
     });
   }

   function formatDuration(seconds: number | null): string {
     if (seconds === null) return 'Active';

     const hours = Math.floor(seconds / 3600);
     const minutes = Math.floor((seconds % 3600) / 60);

     if (hours > 0) {
       return `${hours}h ${minutes}m`;
     }
     return `${minutes}m`;
   }

   function TimeEntryItem({
     entry,
     onDelete,
     onUpdateNotes,
   }: {
     entry: TimeEntry;
     onDelete: (id: number) => void;
     onUpdateNotes: (id: number, notes: string) => void;
   }) {
     const [isEditingNotes, setIsEditingNotes] = useState(false);
     const [notesValue, setNotesValue] = useState(entry.notes || '');

     const handleSaveNotes = () => {
       onUpdateNotes(entry.id, notesValue);
       setIsEditingNotes(false);
     };

     return (
       <Card className="mb-2">
         <CardContent className="p-3">
           <div className="flex items-start justify-between gap-2">
             <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                 <p className="font-medium text-sm truncate">
                   {entry.task_name}
                 </p>
                 <Badge variant="secondary" className="text-xs">
                   {formatDuration(entry.duration_seconds)}
                 </Badge>
               </div>

               <p className="text-xs text-muted-foreground">
                 {formatTime(entry.start_time)}
                 {entry.end_time && ` - ${formatTime(entry.end_time)}`}
               </p>

               {isEditingNotes ? (
                 <div className="mt-2 flex gap-1">
                   <Input
                     type="text"
                     value={notesValue}
                     onChange={(e) => setNotesValue(e.target.value)}
                     placeholder="Add notes..."
                     className="h-7 text-xs"
                     autoFocus
                   />
                   <Button
                     size="icon"
                     variant="ghost"
                     className="h-7 w-7 shrink-0"
                     onClick={handleSaveNotes}
                   >
                     <CheckCircle2 className="h-3 w-3" />
                   </Button>
                 </div>
               ) : (
                 entry.notes && (
                   <p className="text-xs text-muted-foreground mt-1 italic">
                     {entry.notes}
                   </p>
                 )
               )}
             </div>

             <div className="flex gap-1 shrink-0">
               <Button
                 size="icon"
                 variant="ghost"
                 className="h-7 w-7"
                 onClick={() => setIsEditingNotes(!isEditingNotes)}
               >
                 <Edit3 className="h-3 w-3" />
               </Button>
               <Button
                 size="icon"
                 variant="ghost"
                 className="h-7 w-7 text-destructive"
                 onClick={() => onDelete(entry.id)}
               >
                 <Trash2 className="h-3 w-3" />
               </Button>
             </div>
           </div>
         </CardContent>
       </Card>
     );
   }

   export function TodayEntries() {
     const [entries, setEntries] = useState<TimeEntry[]>([]);
     const [isLoading, setIsLoading] = useState(true);

     const fetchEntries = async () => {
       try {
         const todayEntries = await window.electron.timer.getTodayEntries();
         setEntries(todayEntries);
       } catch (error) {
         console.error('Error fetching today entries:', error);
       } finally {
         setIsLoading(false);
       }
     };

     useEffect(() => {
       fetchEntries();

       // Listen for timer updates
       const unsubscribe = window.electron.on('timer:updated', () => {
         fetchEntries();
       });

       return () => {
         unsubscribe();
       };
     }, []);

     const handleDelete = async (entryId: number) => {
       try {
         await window.electron.timer.deleteEntry(entryId);
         await fetchEntries();
       } catch (error) {
         console.error('Error deleting entry:', error);
       }
     };

     const handleUpdateNotes = async (entryId: number, notes: string) => {
       try {
         await window.electron.timer.updateNotes(entryId, notes);
         await fetchEntries();
       } catch (error) {
         console.error('Error updating notes:', error);
       }
     };

     const totalDuration = entries.reduce(
       (acc, entry) => acc + (entry.duration_seconds || 0),
       0
     );

     if (isLoading) {
       return (
         <div className="text-center text-sm text-muted-foreground py-4">
           Loading...
         </div>
       );
     }

     if (entries.length === 0) {
       return (
         <div className="text-center text-sm text-muted-foreground py-4">
           No entries today. Start a timer to begin tracking!
         </div>
       );
     }

     return (
       <div className="space-y-3">
         <div className="flex items-center justify-between">
           <h3 className="text-sm font-medium">Today</h3>
           <Badge variant="outline">{formatDuration(totalDuration)} total</Badge>
         </div>

         <Separator />

         <ScrollArea className="h-64">
           <div className="pr-4">
             {entries.map((entry) => (
               <TimeEntryItem
                 key={entry.id}
                 entry={entry}
                 onDelete={handleDelete}
                 onUpdateNotes={handleUpdateNotes}
               />
             ))}
           </div>
         </ScrollArea>
       </div>
     );
   }
   ```

2. **Update Timer feature exports**
   Update `src/features/Timer/index.ts`:
   ```typescript
   export { CompactTimerView } from './CompactTimerView';
   export { QuickTaskEntry } from './QuickTaskEntry';
   export { TodayEntries } from './TodayEntries';
   ```

3. **Add TodayEntries to App**
   Update `src/App.tsx`:
   ```typescript
   import { CompactTimerView, QuickTaskEntry, TodayEntries } from '@/features/Timer';
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
   import { Clock, Settings } from '@/components/ui/icons';
   import { Button } from '@/components/ui/button';

   function App() {
     return (
       <div className="w-full h-full bg-background flex flex-col overflow-hidden">
         <Card className="flex-1 rounded-none border-0 shadow-none flex flex-col overflow-hidden">
           <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0 shrink-0">
             <div className="flex items-center gap-2">
               <Clock className="h-5 w-5" />
               <CardTitle className="text-lg">Timer</CardTitle>
             </div>
             <Button variant="ghost" size="icon">
               <Settings className="h-4 w-4" />
             </Button>
           </CardHeader>

           <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
             <div className="shrink-0 space-y-4">
               <CompactTimerView />
               <QuickTaskEntry />
             </div>

             <div className="flex-1 overflow-hidden">
               <TodayEntries />
             </div>
           </CardContent>
         </Card>
       </div>
     );
   }

   export default App;
   ```

4. **Test TodayEntries component**
   ```bash
   npm run dev
   ```

   Test:
   - Start and stop a few timers
   - Should see entries appear in list
   - Click edit icon to add notes
   - Save notes and verify they persist
   - Click delete icon to remove entry
   - Check total duration calculation
   - Scroll if more entries than fit in view

## Acceptance Criteria
- [ ] Displays all of today's time entries
- [ ] Shows task name, start/end time, duration
- [ ] Entries are scrollable if list is long
- [ ] Can add/edit notes on entries
- [ ] Can delete entries
- [ ] Total duration shown
- [ ] Empty state message when no entries
- [ ] Updates when new timer started/stopped
- [ ] Time formatted as 12-hour format

## UI Features
- **Entry display:**
  - Task name (bold)
  - Duration badge
  - Start-end time range
  - Notes (if any)

- **Actions:**
  - Edit notes (pencil icon)
  - Delete entry (trash icon)

- **Summary:**
  - Total time logged today
  - Entry count

## References
- project_init.md lines 161 (TodayEntries component)
- project_init.md lines 56 (No background setInterval)
