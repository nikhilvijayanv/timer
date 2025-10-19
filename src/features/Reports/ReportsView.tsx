import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ReportsView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Reports & Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 space-y-3">
          <div className="text-4xl">📊</div>
          <p className="text-sm text-muted-foreground font-medium">Reports & Analytics</p>
          <p className="text-xs text-muted-foreground max-w-[280px] mx-auto">
            Detailed time tracking reports and analytics will be available in a future update.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
