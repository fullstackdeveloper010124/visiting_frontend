import { AppHeader } from './AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart3, TrendingUp, Users, Package } from 'lucide-react';

interface UserAnalyticsPageProps {
  onMenuClick?: () => void;
}

export function UserAnalyticsPage({ onMenuClick }: UserAnalyticsPageProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader onMenuClick={onMenuClick} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Analytics & Stats</h1>
            <p className="text-muted-foreground mt-2">View your personal activity and performance metrics.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold">1,234</p>
                  </div>
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement</p>
                    <p className="text-2xl font-bold">85%</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Products</p>
                    <p className="text-2xl font-bold">42</p>
                  </div>
                  <Package className="h-5 w-5 text-indigo-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Followers</p>
                    <p className="text-2xl font-bold">5.2k</p>
                  </div>
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg border border-dashed border-border">
                <p className="text-muted-foreground">Chart visualizer would render here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
