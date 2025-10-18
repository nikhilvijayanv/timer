import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { TimeEntry } from "@/types/electron";

interface TodayEntriesProps {
  refreshTrigger?: number;
}

export function TodayEntries({ refreshTrigger }: TodayEntriesProps) {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [totalDuration, setTotalDuration] = useState<string>("0h 0m");

  useEffect(() => {
    loadTodayEntries();
  }, [refreshTrigger]);

  async function loadTodayEntries() {
    const todayEntries = await window.electron.timer.getTodayEntries();
    setEntries(todayEntries);
    calculateTotalDuration(todayEntries);
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
    if (!seconds) return "0m";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  function formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
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
            {entries.map((entry, index) => (
              <div key={entry.id}>
                {index > 0 && <Separator className="my-3" />}
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-none">
                      {entry.task_name || "Untitled Task"}
                    </p>
                    <Badge variant="outline" className="ml-auto shrink-0">
                      {formatDuration(entry.duration_seconds)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(entry.start_time)}
                    {entry.end_time && ` - ${formatTime(entry.end_time)}`}
                  </p>
                  {entry.notes && (
                    <p className="text-xs text-muted-foreground italic">
                      {entry.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
