import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { Play, Pause, Settings, Clock } from "@/components/ui/icons";

function App() {
  const { theme, setTheme, effectiveTheme } = useTheme();

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
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')}
            >
              Toggle {effectiveTheme} mode
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
