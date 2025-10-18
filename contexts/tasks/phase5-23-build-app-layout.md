# Task 23: Build Main App Layout with Navigation

**Phase:** 5 - React UI Components
**Dependencies:** Task 19-22 (All feature components created)

## Description
Create the main app layout with navigation between Timer, Tasks, Projects, and Reports views. Implement a clean tab-based navigation system.

## Implementation Steps

1. **Create navigation component**
   Create `src/components/Navigation.tsx`:
   ```typescript
   import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
   import { Clock, Tag, Folder, BarChart3 } from '@/components/ui/icons';

   export function Navigation({
     value,
     onValueChange,
   }: {
     value: string;
     onValueChange: (value: string) => void;
   }) {
     return (
       <Tabs value={value} onValueChange={onValueChange} className="w-full">
         <TabsList className="grid w-full grid-cols-4">
           <TabsTrigger value="timer" className="flex items-center gap-1.5">
             <Clock className="h-4 w-4" />
             <span className="hidden sm:inline">Timer</span>
           </TabsTrigger>
           <TabsTrigger value="tasks" className="flex items-center gap-1.5">
             <Tag className="h-4 w-4" />
             <span className="hidden sm:inline">Tasks</span>
           </TabsTrigger>
           <TabsTrigger value="projects" className="flex items-center gap-1.5">
             <Folder className="h-4 w-4" />
             <span className="hidden sm:inline">Projects</span>
           </TabsTrigger>
           <TabsTrigger value="reports" className="flex items-center gap-1.5">
             <BarChart3 className="h-4 w-4" />
             <span className="hidden sm:inline">Reports</span>
           </TabsTrigger>
         </TabsList>
       </Tabs>
     );
   }
   ```

2. **Create view container component**
   Create `src/components/ViewContainer.tsx`:
   ```typescript
   import { ReactNode } from 'react';

   export function ViewContainer({ children }: { children: ReactNode }) {
     return (
       <div className="flex-1 overflow-auto p-4">
         {children}
       </div>
     );
   }
   ```

3. **Create AppHeader component**
   Create `src/components/AppHeader.tsx`:
   ```typescript
   import { Button } from '@/components/ui/button';
   import { Settings, X } from '@/components/ui/icons';

   export function AppHeader() {
     const handleClose = () => {
       window.electron.window.hide();
     };

     const handleSettings = () => {
       // TODO: Implement settings dialog in Phase 6
       console.log('Settings clicked');
     };

     return (
       <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
         <h1 className="text-lg font-semibold">Timer</h1>
         <div className="flex gap-1">
           <Button
             variant="ghost"
             size="icon"
             className="h-8 w-8"
             onClick={handleSettings}
           >
             <Settings className="h-4 w-4" />
           </Button>
           <Button
             variant="ghost"
             size="icon"
             className="h-8 w-8"
             onClick={handleClose}
           >
             <X className="h-4 w-4" />
           </Button>
         </div>
       </div>
     );
   }
   ```

4. **Update App.tsx with complete layout**
   ```typescript
   import { useState } from 'react';
   import { CompactTimerView, QuickTaskEntry, TodayEntries } from '@/features/Timer';
   import { TaskList } from '@/features/Tasks';
   import { ProjectsView } from '@/features/Projects';
   import { ReportsView } from '@/features/Reports';
   import { AppHeader } from '@/components/AppHeader';
   import { Navigation } from '@/components/Navigation';
   import { ViewContainer } from '@/components/ViewContainer';

   type View = 'timer' | 'tasks' | 'projects' | 'reports';

   function App() {
     const [currentView, setCurrentView] = useState<View>('timer');

     return (
       <div className="w-full h-full bg-background flex flex-col overflow-hidden">
         <AppHeader />

         <div className="px-4 pt-3 shrink-0">
           <Navigation value={currentView} onValueChange={(v) => setCurrentView(v as View)} />
         </div>

         {currentView === 'timer' && (
           <ViewContainer>
             <div className="space-y-4 max-w-md mx-auto">
               <CompactTimerView />
               <QuickTaskEntry />
               <TodayEntries />
             </div>
           </ViewContainer>
         )}

         {currentView === 'tasks' && (
           <ViewContainer>
             <div className="max-w-md mx-auto">
               <h2 className="text-xl font-bold mb-4">Tasks</h2>
               <TaskList />
             </div>
           </ViewContainer>
         )}

         {currentView === 'projects' && (
           <ViewContainer>
             <ProjectsView />
           </ViewContainer>
         )}

         {currentView === 'reports' && (
           <ViewContainer>
             <ReportsView />
           </ViewContainer>
         )}
       </div>
     );
   }

   export default App;
   ```

5. **Add keyboard shortcuts for navigation**
   Update `src/hooks/useKeyboardShortcuts.ts` (create if doesn't exist):
   ```typescript
   import { useEffect } from 'react';

   export function useKeyboardShortcuts(handlers: Record<string, () => void>) {
     useEffect(() => {
       const handleKeyDown = (e: KeyboardEvent) => {
         // Cmd/Ctrl + number for navigation
         if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '4') {
           e.preventDefault();
           const views = ['timer', 'tasks', 'projects', 'reports'];
           const index = parseInt(e.key) - 1;
           handlers[views[index]]?.();
         }

         // Cmd/Ctrl + W to close window
         if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
           e.preventDefault();
           window.electron.window.hide();
         }
       };

       window.addEventListener('keydown', handleKeyDown);
       return () => window.removeEventListener('keydown', handleKeyDown);
     }, [handlers]);
   }
   ```

6. **Use keyboard shortcuts in App**
   ```typescript
   import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

   function App() {
     const [currentView, setCurrentView] = useState<View>('timer');

     useKeyboardShortcuts({
       timer: () => setCurrentView('timer'),
       tasks: () => setCurrentView('tasks'),
       projects: () => setCurrentView('projects'),
       reports: () => setCurrentView('reports'),
     });

     // ... rest of component
   }
   ```

7. **Test complete app layout**
   ```bash
   npm run dev
   ```

   Test:
   - All four tabs are visible
   - Clicking tabs switches views
   - Timer view shows timer components
   - Tasks view shows task list
   - Projects and Reports show placeholders
   - Settings button exists (does nothing yet)
   - Close button hides window
   - Keyboard shortcuts work (Cmd+1, Cmd+2, etc.)

## Acceptance Criteria
- [ ] Navigation tabs for all 4 views
- [ ] Views switch correctly
- [ ] Timer view shows all timer components
- [ ] Tasks view shows task management
- [ ] Projects/Reports show placeholders
- [ ] App header with title and buttons
- [ ] Close button hides window
- [ ] Keyboard shortcuts work
- [ ] Layout responsive to 360x480 window
- [ ] No scroll issues or overflow

## Layout Structure
```
┌─────────────────────────────┐
│  Timer          [⚙] [✕]    │ ← AppHeader
├─────────────────────────────┤
│ [Timer][Tasks][Proj][Rep]  │ ← Navigation
├─────────────────────────────┤
│                             │
│    ViewContainer            │
│    (scrollable content)     │
│                             │
│                             │
│                             │
└─────────────────────────────┘
```

## Keyboard Shortcuts
- `Cmd/Ctrl + 1` - Timer view
- `Cmd/Ctrl + 2` - Tasks view
- `Cmd/Ctrl + 3` - Projects view
- `Cmd/Ctrl + 4` - Reports view
- `Cmd/Ctrl + W` - Close window
- `Escape` - Close window (future)

## References
- project_init.md lines 158-162 (Renderer components)
- project_init.md lines 64-78 (Window configuration - 360x480)
