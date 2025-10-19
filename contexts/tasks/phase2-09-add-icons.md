# Task 09: Add Lucide React Icons

**Phase:** 2 - Styling & UI Foundation
**Dependencies:** Task 07 (shadcn/ui configured)

## Description

Install and configure Lucide React icons for use throughout the application UI.

## Implementation Steps

1. **Install lucide-react**

   ```bash
   npm install lucide-react
   ```

2. **Create icon export file for commonly used icons**
   Create `src/components/ui/icons.tsx`:

   ```typescript
   export {
     Play,
     Pause,
     Square,
     Clock,
     Plus,
     X,
     Settings,
     Menu,
     ChevronDown,
     ChevronRight,
     Calendar,
     BarChart3,
     Folder,
     Tag,
     CheckCircle2,
     Circle,
     Trash2,
     Edit3,
     MoreVertical,
     Volume2,
     VolumeX,
   } from 'lucide-react';
   ```

3. **Test icons in App.tsx**

   ```typescript
   import { Button } from "@/components/ui/button";
   import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
   import { Play, Pause, Settings, Clock } from "@/components/ui/icons";

   function App() {
     return (
       <div className="w-full h-full bg-background overflow-hidden">
         <div className="w-full h-full flex flex-col">
           <Card className="flex-1 rounded-none border-0 shadow-none">
             <CardHeader className="pb-3 flex flex-row items-center justify-between">
               <div className="flex items-center gap-2">
                 <Clock className="h-5 w-5" />
                 <CardTitle className="text-lg">Timer</CardTitle>
               </div>
               <Button variant="ghost" size="icon">
                 <Settings className="h-4 w-4" />
               </Button>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex gap-2">
                 <Button className="flex-1">
                   <Play className="h-4 w-4 mr-2" />
                   Start
                 </Button>
                 <Button variant="outline" className="flex-1">
                   <Pause className="h-4 w-4 mr-2" />
                   Pause
                 </Button>
               </div>
             </CardContent>
           </Card>
         </div>
       </div>
     );
   }

   export default App;
   ```

4. **Create icon size utilities (optional)**
   Add to `src/lib/utils.ts`:

   ```typescript
   export const iconSizes = {
     xs: 'h-3 w-3',
     sm: 'h-4 w-4',
     md: 'h-5 w-5',
     lg: 'h-6 w-6',
     xl: 'h-8 w-8',
   } as const;
   ```

5. **Verify icons render correctly**
   ```bash
   npm run dev
   ```
   Should see icons in buttons and header

## Acceptance Criteria

- [ ] lucide-react installed
- [ ] Icon exports file created with commonly used icons
- [ ] Icons render correctly in test components
- [ ] Icons scale properly with different sizes
- [ ] No console errors related to icons

## Icon Reference for Features

The following icons will be used in the app:

- **Timer:** Play, Pause, Square (stop)
- **Time display:** Clock
- **Navigation:** Menu, ChevronDown, ChevronRight
- **Actions:** Plus, X, Edit3, Trash2, MoreVertical
- **Features:** Calendar (tasks), BarChart3 (reports), Folder (projects), Tag
- **Status:** CheckCircle2, Circle
- **Audio:** Volume2, VolumeX
- **Settings:** Settings

## References

- [Lucide Icons](https://lucide.dev/)
- project_init.md line 13
