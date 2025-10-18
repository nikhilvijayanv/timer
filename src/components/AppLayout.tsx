import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, ListTodo, FolderKanban, BarChart3 } from "@/components/ui/icons";
import { CompactTimerView } from "@/features/Timer/CompactTimerView";
import { QuickTaskEntry } from "@/features/Timer/QuickTaskEntry";
import { TodayEntries } from "@/features/Timer/TodayEntries";
import { TaskManager } from "@/features/Tasks/TaskManager";
import { ProjectsView } from "@/features/Projects/ProjectsView";
import { ReportsView } from "@/features/Reports/ReportsView";

export function AppLayout() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleTimerChange() {
    // Trigger refresh of TodayEntries when timer starts/stops
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="w-full h-full bg-background overflow-hidden">
      <Tabs defaultValue="timer" className="w-full h-full flex flex-col">
        <TabsList className="w-full grid grid-cols-4 rounded-none border-b">
          <TabsTrigger value="timer" className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Timer</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-1.5">
            <ListTodo className="h-4 w-4" />
            <span className="hidden sm:inline">Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-1.5">
            <FolderKanban className="h-4 w-4" />
            <span className="hidden sm:inline">Projects</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="timer" className="m-0 p-4 space-y-4">
            <CompactTimerView onStop={handleTimerChange} />
            <QuickTaskEntry onStart={handleTimerChange} />
            <TodayEntries refreshTrigger={refreshKey} />
          </TabsContent>

          <TabsContent value="tasks" className="m-0 p-4">
            <TaskManager />
          </TabsContent>

          <TabsContent value="projects" className="m-0 p-4">
            <ProjectsView />
          </TabsContent>

          <TabsContent value="reports" className="m-0 p-4">
            <ReportsView />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
