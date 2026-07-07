import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Package, Truck, CheckCircle, Clock, MapPin, Upload, Camera, Menu } from 'lucide-react';
import { StatsCard } from './StatsCard';

interface DeliveryPersonDashboardProps {
  onMenuClick?: () => void;
}

export function DeliveryPersonDashboard({ onMenuClick }: DeliveryPersonDashboardProps) {
  const deliveries = [
    { id: 1, orderNumber: 'ORD-2024-1245', customer: 'Acme Corporation', address: '123 Business St, Suite 400', items: 3, status: 'assigned', scheduledDate: '2026-02-28', priority: 'high' },
    { id: 2, orderNumber: 'ORD-2024-1246', customer: 'Tech Solutions Inc', address: '456 Innovation Drive', items: 2, status: 'in_transit', scheduledDate: '2026-02-28', priority: 'normal' },
    { id: 3, orderNumber: 'ORD-2024-1247', customer: 'Global Enterprises', address: '789 Corporate Blvd', items: 5, status: 'assigned', scheduledDate: '2026-03-01', priority: 'normal' },
    { id: 4, orderNumber: 'ORD-2024-1248', customer: 'StartupHub Co', address: '321 Startup Lane', items: 1, status: 'assigned', scheduledDate: '2026-03-01', priority: 'low' },
  ];

  const completedToday = [
    { id: 1, orderNumber: 'ORD-2024-1240', customer: 'Design Studio', deliveredAt: '10:30 AM', proofUploaded: true },
    { id: 2, orderNumber: 'ORD-2024-1241', customer: 'Marketing Agency', deliveredAt: '11:45 AM', proofUploaded: true },
    { id: 3, orderNumber: 'ORD-2024-1242', customer: 'Finance Corp', deliveredAt: '2:15 PM', proofUploaded: true },
  ];

  const assignedCount = deliveries.filter(d => d.status === 'assigned').length;
  const inTransitCount = deliveries.filter(d => d.status === 'in_transit').length;

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
              <h1 className="text-2xl font-semibold">My Deliveries</h1>
              <p className="text-sm text-muted-foreground">Manage your delivery schedule</p>
            </div>
          </div>
          <Button>
            <MapPin className="h-4 w-4 mr-2" />
            Optimize Route
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Today's Deliveries"
            value={deliveries.filter(d => d.scheduledDate === '2026-02-28').length.toString()}
            icon={Package}
          />
          <StatsCard
            title="Assigned"
            value={assignedCount.toString()}
            icon={Clock}
            iconColor="text-blue-500"
          />
          <StatsCard
            title="In Transit"
            value={inTransitCount.toString()}
            icon={Truck}
            iconColor="text-orange-500"
          />
          <StatsCard
            title="Completed Today"
            value={completedToday.length.toString()}
            icon={CheckCircle}
            iconColor="text-green-500"
          />
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Deliveries</TabsTrigger>
            <TabsTrigger value="completed">Completed Today</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Deliveries</CardTitle>
                <CardDescription>Your scheduled deliveries for today and upcoming</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveries.map((delivery) => (
                    <div key={delivery.id} className="border border-border rounded-lg p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">{delivery.customer}</span>
                            {delivery.priority === 'high' && (
                              <Badge variant="destructive">High Priority</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground font-mono">{delivery.orderNumber}</div>
                        </div>
                        {delivery.status === 'assigned' ? (
                          <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                            <Clock className="h-3 w-3 mr-1" />
                            Assigned
                          </Badge>
                        ) : (
                          <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-400">
                            <Truck className="h-3 w-3 mr-1" />
                            In Transit
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{delivery.address}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          {delivery.items} items
                        </div>
                        <div>Scheduled: {new Date(delivery.scheduledDate).toLocaleDateString()}</div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        {delivery.status === 'assigned' && (
                          <Button size="sm" className="flex-1">
                            <Truck className="h-4 w-4 mr-2" />
                            Start Delivery
                          </Button>
                        )}
                        {delivery.status === 'in_transit' && (
                          <>
                            <Button size="sm" className="flex-1">
                              <Camera className="h-4 w-4 mr-2" />
                              Upload Proof
                            </Button>
                            <Button size="sm" className="flex-1" variant="outline">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Delivered
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Deliveries</CardTitle>
                <CardDescription>Successfully delivered orders today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Number</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Delivered At</TableHead>
                        <TableHead>Proof</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedToday.map((delivery) => (
                        <TableRow key={delivery.id}>
                          <TableCell className="font-mono">{delivery.orderNumber}</TableCell>
                          <TableCell className="font-medium">{delivery.customer}</TableCell>
                          <TableCell>{delivery.deliveredAt}</TableCell>
                          <TableCell>
                            {delivery.proofUploaded ? (
                              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Uploaded
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                <Upload className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline">View Details</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}