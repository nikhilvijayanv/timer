# Task 21: Implement Task Management (CRUD) UI

**Phase:** 5 - React UI Components
**Dependencies:** Task 20 (TodayEntries created), Task 16 (IPC bridge)

## Description
Create a UI for managing tasks - viewing all tasks, creating new ones, and quick access to recently used tasks.

## Implementation Steps

1. **Create TaskList component**
   Create `src/features/Tasks/TaskList.tsx`:
   ```typescript
   import { useState, useEffect } from 'react';
   import { Button } from '@/components/ui/button';
   import { Card, CardContent } from '@/components/ui/card';
   import { Input } from '@/components/ui/input';
   import { Badge } from '@/components/ui/badge';
   import { ScrollArea } from '@/components/ui/scroll-area';
   import { Plus, Tag } from '@/components/ui/icons';

   interface Task {
     id: number;
     name: string;
     created_at: number;
   }

   function formatDate(timestamp: number): string {
     const date = new Date(timestamp);
     return date.toLocaleDateString('en-US', {
       month: 'short',
       day: 'numeric',
       year: 'numeric',
     });
   }

   export function TaskList({ onTaskSelect }: { onTaskSelect?: (taskName: string) => void }) {
     const [tasks, setTasks] = useState<Task[]>([]);
     const [newTaskName, setNewTaskName] = useState('');
     const [isCreating, setIsCreating] = useState(false);
     const [isLoading, setIsLoading] = useState(true);

     const fetchTasks = async () => {
       try {
         const allTasks = await window.electron.tasks.getAll();
         setTasks(allTasks);
       } catch (error) {
         console.error('Error fetching tasks:', error);
       } finally {
         setIsLoading(false);
       }
     };

     useEffect(() => {
       fetchTasks();
     }, []);

     const handleCreateTask = async () => {
       if (!newTaskName.trim()) return;

       setIsCreating(true);
       try {
         await window.electron.tasks.create(newTaskName.trim());
         setNewTaskName('');
         await fetchTasks();
       } catch (error) {
         console.error('Error creating task:', error);
       } finally {
         setIsCreating(false);
       }
     };

     const handleKeyPress = (e: React.KeyboardEvent) => {
       if (e.key === 'Enter') {
         handleCreateTask();
       }
     };

     if (isLoading) {
       return (
         <div className="text-center text-sm text-muted-foreground py-4">
           Loading tasks...
         </div>
       );
     }

     return (
       <div className="space-y-3">
         <div className="flex gap-2">
           <Input
             type="text"
             placeholder="New task name..."
             value={newTaskName}
             onChange={(e) => setNewTaskName(e.target.value)}
             onKeyPress={handleKeyPress}
             disabled={isCreating}
             className="flex-1"
           />
           <Button
             onClick={handleCreateTask}
             disabled={!newTaskName.trim() || isCreating}
             size="icon"
           >
             <Plus className="h-4 w-4" />
           </Button>
         </div>

         {tasks.length === 0 ? (
           <div className="text-center text-sm text-muted-foreground py-8">
             No tasks yet. Create one above to get started.
           </div>
         ) : (
           <ScrollArea className="h-64">
             <div className="space-y-2 pr-4">
               {tasks.map((task) => (
                 <Card
                   key={task.id}
                   className="cursor-pointer hover:bg-accent transition-colors"
                   onClick={() => onTaskSelect?.(task.name)}
                 >
                   <CardContent className="p-3">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 min-w-0">
                         <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                         <p className="font-medium text-sm truncate">
                           {task.name}
                         </p>
                       </div>
                       <Badge variant="outline" className="text-xs shrink-0">
                         {formatDate(task.created_at)}
                       </Badge>
                     </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
           </ScrollArea>
         )}
       </div>
     );
   }
   ```

2. **Create QuickTaskSelector component**
   Create `src/features/Tasks/QuickTaskSelector.tsx`:
   ```typescript
   import { useState, useEffect } from 'react';
   import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
   } from '@/components/ui/dropdown-menu';
   import { Button } from '@/components/ui/button';
   import { ChevronDown, Tag } from '@/components/ui/icons';

   interface Task {
     id: number;
     name: string;
     created_at: number;
   }

   export function QuickTaskSelector({
     onSelect,
     currentTask,
   }: {
     onSelect: (taskName: string) => void;
     currentTask?: string;
   }) {
     const [tasks, setTasks] = useState<Task[]>([]);

     useEffect(() => {
       const fetchTasks = async () => {
         try {
           const allTasks = await window.electron.tasks.getAll();
           // Show only 5 most recent
           setTasks(allTasks.slice(0, 5));
         } catch (error) {
           console.error('Error fetching tasks:', error);
         }
       };

       fetchTasks();
     }, []);

     return (
       <DropdownMenu>
         <DropdownMenuTrigger asChild>
           <Button variant="outline" className="w-full justify-between">
             <span className="truncate">
               {currentTask || 'Select a task...'}
             </span>
             <ChevronDown className="h-4 w-4 ml-2 shrink-0" />
           </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent className="w-56">
           <DropdownMenuLabel>Recent Tasks</DropdownMenuLabel>
           <DropdownMenuSeparator />
           {tasks.length === 0 ? (
             <div className="p-2 text-sm text-muted-foreground text-center">
               No tasks yet
             </div>
           ) : (
             tasks.map((task) => (
               <DropdownMenuItem
                 key={task.id}
                 onClick={() => onSelect(task.name)}
                 className="cursor-pointer"
               >
                 <Tag className="h-4 w-4 mr-2" />
                 <span className="truncate">{task.name}</span>
               </DropdownMenuItem>
             ))
           )}
         </DropdownMenuContent>
       </DropdownMenu>
     );
   }
   ```

3. **Update QuickTaskEntry to use QuickTaskSelector**
   Update `src/features/Timer/QuickTaskEntry.tsx`:
   ```typescript
   import { useState } from 'react';
   import { Button } from '@/components/ui/button';
   import { Input } from '@/components/ui/input';
   import { Play } from '@/components/ui/icons';
   import { useTimer } from '@/contexts/TimerContext';
   import { QuickTaskSelector } from '@/features/Tasks/QuickTaskSelector';
   import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

   export function QuickTaskEntry() {
     const { activeTimer, refreshTimer } = useTimer();
     const [taskName, setTaskName] = useState('');
     const [isStarting, setIsStarting] = useState(false);

     const handleStart = async (name?: string) => {
       const taskToStart = name || taskName;
       if (!taskToStart.trim() || activeTimer) return;

       setIsStarting(true);
       try {
         await window.electron.timer.start(taskToStart.trim());
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

     if (activeTimer) {
       return null;
     }

     return (
       <Tabs defaultValue="new" className="w-full">
         <TabsList className="grid w-full grid-cols-2">
           <TabsTrigger value="new">New Task</TabsTrigger>
           <TabsTrigger value="recent">Recent</TabsTrigger>
         </TabsList>

         <TabsContent value="new" className="space-y-2">
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
               onClick={() => handleStart()}
               disabled={!taskName.trim() || isStarting}
               className="shrink-0"
             >
               <Play className="h-4 w-4 mr-2" />
               Start
             </Button>
           </div>
         </TabsContent>

         <TabsContent value="recent" className="space-y-2">
           <QuickTaskSelector
             onSelect={(name) => handleStart(name)}
             currentTask={taskName}
           />
         </TabsContent>
       </Tabs>
     );
   }
   ```

4. **Create Tasks feature exports**
   Create `src/features/Tasks/index.ts`:
   ```typescript
   export { TaskList } from './TaskList';
   export { QuickTaskSelector } from './QuickTaskSelector';
   ```

5. **Test task management**
   ```bash
   npm run dev
   ```

   Test:
   - Create a few tasks using the input
   - Tasks should appear in the list
   - Switch to "Recent" tab in QuickTaskEntry
   - Select a task from dropdown
   - Timer should start with that task name

## Acceptance Criteria
- [ ] Can create new tasks
- [ ] All tasks displayed in scrollable list
- [ ] Recent tasks (5 most recent) shown in dropdown
- [ ] Can select task to start timer
- [ ] Task creation validates for empty names
- [ ] Task names are unique (enforced by database)
- [ ] Tabs switch between new task and recent
- [ ] UI responsive and smooth

## Task Management Features
- **Create:** Input + button to add new task
- **List:** Scrollable list of all tasks with creation date
- **Quick select:** Dropdown with 5 most recent tasks
- **Integration:** Selected task auto-fills timer start

## Future Enhancements (Not in this task)
- Edit task names
- Delete tasks
- Archive/hide tasks
- Task categories/tags
- Task-specific settings

## References
- project_init.md lines 32, 161 (Tasks feature)
- project_init.md lines 25, 177-181 (Tasks table)
