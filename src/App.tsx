import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";

function App() {
  const { theme, setTheme, effectiveTheme } = useTheme();

  return (
    <div className="w-full h-full bg-background overflow-hidden">
      <div className="w-full h-full flex flex-col">
        <Card className="flex-1 rounded-none border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Timer App</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Menu bar timer application
            </p>
            <Button className="w-full mb-2">Start Timer</Button>
            <Button
              variant="outline"
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
