import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function App() {
  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Timer App</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Menu bar timer application</p>
          <Button>Start Timer</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
