import { AppHeader } from './AppHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Search, Filter, Edit, Trash2, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { useState } from 'react';

interface OrderProcessorDashboardProps {
  onMenuClick?: () => void;
}

export function OrderProcessorDashboard({ onMenuClick }: OrderProcessorDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = [
    { title: 'Pending Orders', value: '24', change: '+8 from yesterday', icon: Clock, color: 'bg-yellow-500' },
    { title: 'Processing', value: '18', change: 'Active orders', icon: AlertCircle, color: 'bg-blue-500' },
    { title: 'Ready to Ship', value: '12', change: '+5 from yesterday', icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Assigned Deliveries', value: '31', change: 'Awaiting pickup', icon: Truck, color: 'bg-purple-500' },
  ];

  const orders = [
    { id: 1, orderNumber: 'ORD-2024-1245', customer: 'Acme Corporation', product: 'Business Cards Premium', quantity: 1000, total: 450.00, status: 'pending', priority: 'high', orderDate: '2026-02-28', dueDate: '2026-03-05' },
    { id: 2, orderNumber: 'ORD-2024-1246', customer: 'TechStart Inc', product: 'Letterheads Corporate', quantity: 500, total: 299.99, status: 'processing', priority: 'medium', orderDate: '2026-02-28', dueDate: '2026-03-07' },
    { id: 3, orderNumber: 'ORD-2024-1247', customer: 'Global Ventures', product: 'Custom Envelopes', quantity: 2000, total: 680.00, status: 'ready', priority: 'high', orderDate: '2026-02-27', dueDate: '2026-03-03' },
    { id: 4, orderNumber: 'ORD-2024-1248', customer: 'Metro Solutions', product: 'Notepads Custom', quantity: 300, total: 189.99, status: 'printing', priority: 'low', orderDate: '2026-02-27', dueDate: '2026-03-08' },
    { id: 5, orderNumber: 'ORD-2024-1249', customer: 'Urban Logistics', product: 'Business Cards Standard', quantity: 500, total: 149.99, status: 'assigned', priority: 'medium', orderDate: '2026-02-26', dueDate: '2026-03-04' },
    { id: 6, orderNumber: 'ORD-2024-1250', customer: 'Bright Ideas Co', product: 'Brochures', quantity: 1500, total: 890.00, status: 'pending', priority: 'high', orderDate: '2026-02-28', dueDate: '2026-03-06' },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
      processing: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Processing' },
      printing: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Printing' },
      ready: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Ready' },
      assigned: { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'Assigned' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={`${config.color} border`}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: Record<string, { color: string; label: string }> = {
      high: { color: 'bg-red-100 text-red-800 border-red-200', label: 'High' },
      medium: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Medium' },
      low: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Low' },
    };
    const config = priorityConfig[priority] || priorityConfig.medium;
    return <Badge className={`${config.color} border`}>{config.label}</Badge>;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <AppHeader 
        title="Order Processing"
        subtitle="Add, modify, delete orders and assign delivery"
        onMenuClick={onMenuClick}
      />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Orders Management */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Process and manage all customer orders</CardDescription>
              </div>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create Order
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders, customers, products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="printing">Printing</SelectItem>
                  <SelectItem value="ready">Ready to Ship</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No orders found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell className="text-center">{order.quantity.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                        <TableCell>{new Date(order.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Truck className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bulk Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Multiple as Ready
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Truck className="h-4 w-4 mr-2" />
                Assign to Delivery
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="h-4 w-4 mr-2" />
                Flag Priority Orders
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Today's Orders</span>
                <span className="font-semibold">14</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Overdue Orders</span>
                <span className="font-semibold text-red-600">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Processing Time</span>
                <span className="font-semibold">2.5 days</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-medium">ORD-2024-1230 completed</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Truck className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="font-medium">Assigned 3 orders to delivery</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Plus className="h-4 w-4 mt-0.5 text-purple-500 flex-shrink-0" />
                <div>
                  <p className="font-medium">New order created</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
