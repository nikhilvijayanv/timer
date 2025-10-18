import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "@/components/ui/icons";
import { useSound } from "@/hooks/useSound";

interface QuickTaskEntryProps {
  onStart?: () => void;
}

export function QuickTaskEntry({ onStart }: QuickTaskEntryProps) {
  const [taskName, setTaskName] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const { playStart } = useSound();

  async function handleStart() {
    if (!taskName.trim()) {
      return;
    }

    setIsStarting(true);
    try {
      await window.electron.timer.start(taskName.trim());
      playStart();
      setTaskName("");
      onStart?.();
    } catch (error) {
      console.error("Failed to start timer:", error);
    } finally {
      setIsStarting(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleStart();
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="task-input" className="text-sm font-medium">
              What are you working on?
            </label>
            <Input
              id="task-input"
              type="text"
              placeholder="Enter task name..."
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStarting}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleStart}
            disabled={!taskName.trim() || isStarting}
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            {isStarting ? "Starting..." : "Start Timer"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
