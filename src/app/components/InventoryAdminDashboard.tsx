import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Package, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Menu } from 'lucide-react';
import { StatsCard } from './StatsCard';

interface InventoryAdminDashboardProps {
  onMenuClick?: () => void;
}

export function InventoryAdminDashboard({ onMenuClick }: InventoryAdminDashboardProps) {
  const stockItems = [
    { id: 1, sku: 'BC-001', name: 'Business Cards Premium', category: 'Business Cards', available: 1250, reserved: 150, warehouse: 'WH-A', reorderPoint: 500, status: 'healthy' },
    { id: 2, sku: 'LH-002', name: 'Letterhead A4', category: 'Letterheads', available: 380, reserved: 80, warehouse: 'WH-A', reorderPoint: 500, status: 'low' },
    { id: 3, sku: 'ENV-003', name: 'Envelopes DL', category: 'Envelopes', available: 2100, reserved: 200, warehouse: 'WH-B', reorderPoint: 1000, status: 'healthy' },
    { id: 4, sku: 'NB-004', name: 'Notepads A5', category: 'Notepads', available: 150, reserved: 50, warehouse: 'WH-A', reorderPoint: 300, status: 'critical' },
    { id: 5, sku: 'FOL-005', name: 'Presentation Folders', category: 'Folders', available: 850, reserved: 100, warehouse: 'WH-B', reorderPoint: 400, status: 'healthy' },
  ];

  const recentMovements = [
    { id: 1, type: 'add', product: 'Business Cards Premium', quantity: 500, warehouse: 'WH-A', user: 'John Smith', time: '2 hours ago' },
    { id: 2, type: 'release', product: 'Letterhead A4', quantity: -200, warehouse: 'WH-A', user: 'Sarah Johnson', time: '3 hours ago' },
    { id: 3, type: 'adjust', product: 'Envelopes DL', quantity: -50, warehouse: 'WH-B', user: 'Mike Davis', time: '5 hours ago' },
    { id: 4, type: 'reserve', product: 'Notepads A5', quantity: -100, warehouse: 'WH-A', user: 'System', time: '1 day ago' },
  ];

  const healthyCount = stockItems.filter(i => i.status === 'healthy').length;
  const lowCount = stockItems.filter(i => i.status === 'low').length;
  const criticalCount = stockItems.filter(i => i.status === 'critical').length;

  return (
    <div className="flex-1 overflow-auto bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Inventory Management</h1>
              <p className="text-sm text-muted-foreground">Monitor and manage stock levels</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Add Stock
            </Button>
            <Button>
              <TrendingDown className="h-4 w-4 mr-2" />
              Release Stock
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Items"
            value={stockItems.length.toString()}
            icon={Package}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Healthy Stock"
            value={healthyCount.toString()}
            icon={CheckCircle}
            iconColor="text-green-500"
          />
          <StatsCard
            title="Low Stock"
            value={lowCount.toString()}
            icon={AlertTriangle}
            iconColor="text-yellow-500"
          />
          <StatsCard
            title="Critical"
            value={criticalCount.toString()}
            icon={AlertTriangle}
            iconColor="text-red-500"
          />
        </div>

        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">Current Inventory</TabsTrigger>
            <TabsTrigger value="movements">Stock Movements</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Current stock levels across all warehouses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Available</TableHead>
                        <TableHead className="text-right">Reserved</TableHead>
                        <TableHead>Warehouse</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-muted-foreground">{item.category}</TableCell>
                          <TableCell className="text-right font-medium">{item.available}</TableCell>
                          <TableCell className="text-right text-muted-foreground">{item.reserved}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.warehouse}</Badge>
                          </TableCell>
                          <TableCell>
                            {item.status === 'healthy' && (
                              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Healthy
                              </Badge>
                            )}
                            {item.status === 'low' && (
                              <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Low Stock
                              </Badge>
                            )}
                            {item.status === 'critical' && (
                              <Badge className="bg-red-500/10 text-red-700 dark:text-red-400">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Critical
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline">Add</Button>
                              <Button size="sm" variant="outline">Release</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="movements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Stock Movements</CardTitle>
                <CardDescription>Latest inventory transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMovements.map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          movement.type === 'add' ? 'bg-green-500/10' :
                          movement.type === 'release' ? 'bg-red-500/10' :
                          movement.type === 'adjust' ? 'bg-yellow-500/10' :
                          'bg-blue-500/10'
                        }`}>
                          {movement.type === 'add' ? <TrendingUp className="h-5 w-5 text-green-600" /> :
                           movement.type === 'release' ? <TrendingDown className="h-5 w-5 text-red-600" /> :
                           <Package className="h-5 w-5 text-yellow-600" />}
                        </div>
                        <div>
                          <div className="font-medium">{movement.product}</div>
                          <div className="text-sm text-muted-foreground">
                            {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)} · {movement.warehouse} · By {movement.user}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </div>
                        <div className="text-sm text-muted-foreground">{movement.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Stock Alerts</CardTitle>
                <CardDescription>Items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stockItems.filter(i => i.status !== 'healthy').map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <AlertTriangle className={`h-5 w-5 ${item.status === 'critical' ? 'text-red-500' : 'text-yellow-500'}`} />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Available: {item.available} · Reorder Point: {item.reorderPoint}
                          </div>
                        </div>
                      </div>
                      <Button size="sm">Reorder Now</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}