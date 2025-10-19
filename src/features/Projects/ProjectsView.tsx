import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ProjectsView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 space-y-3">
          <div className="text-4xl">📁</div>
          <p className="text-sm text-muted-foreground font-medium">Project Management</p>
          <p className="text-xs text-muted-foreground max-w-[280px] mx-auto">
            Advanced project organization features will be available in a future update.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
