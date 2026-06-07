import { AppHeader } from './AppHeader';
import { StatsCard } from './StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Package, ShoppingCart, Clock, CheckCircle, ArrowRight, FileText } from 'lucide-react';
import { StatusBadge, OrderStatus } from './StatusBadge';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  product: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  date: string;
}

interface RecentProduct {
  id: string;
  name: string;
  category: string;
  image: string;
}

interface UserDashboardProps {
  onMenuClick?: () => void;
}

export function UserDashboard({ onMenuClick }: UserDashboardProps) {
  const stats = [
    {
      title: 'Total Orders',
      value: '24',
      description: 'All time orders',
      icon: ShoppingCart,
      trend: { value: '+12%', isPositive: true },
      iconColor: 'bg-primary'
    },
    {
      title: 'Active Orders',
      value: '3',
      description: 'Currently processing',
      icon: Clock,
      iconColor: 'bg-warning'
    },
    {
      title: 'Completed',
      value: '19',
      description: 'Successfully delivered',
      icon: CheckCircle,
      trend: { value: '+8%', isPositive: true },
      iconColor: 'bg-success'
    },
    {
      title: 'Draft Designs',
      value: '5',
      description: 'Saved customizations',
      icon: FileText,
      iconColor: 'bg-info'
    },
  ];

  const recentOrders: Order[] = [
    { id: 'ORD-2024-001', product: 'Business Cards (Premium)', quantity: 500, total: 149.99, status: 'delivered', date: '2024-01-28' },
    { id: 'ORD-2024-002', product: 'Letterheads (Corporate)', quantity: 1000, total: 299.99, status: 'printing', date: '2024-01-30' },
    { id: 'ORD-2024-003', product: 'Envelopes (Standard)', quantity: 500, total: 89.99, status: 'processing', date: '2024-02-01' },
    { id: 'ORD-2024-004', product: 'Notepads (Custom)', quantity: 100, total: 79.99, status: 'pending', date: '2024-02-02' },
  ];

  const recentProducts: RecentProduct[] = [
    { id: '1', name: 'Business Cards', category: 'Cards', image: 'business cards premium' },
    { id: '2', name: 'Letterheads', category: 'Paper', image: 'corporate letterhead stationery' },
    { id: '3', name: 'Envelopes', category: 'Paper', image: 'professional envelopes' },
    { id: '4', name: 'Notepads', category: 'Books', image: 'custom notepads branded' },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader onMenuClick={onMenuClick} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Welcome back, John!</h1>
            <p className="text-sm md:text-base text-muted-foreground">Here's what's happening with your orders today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatsCard key={stat.title} {...stat} />
            ))}
          </div>

          <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            {/* Recent Orders */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Your latest stationery orders</CardDescription>
                  </div>
                  <Link to="/orders">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{order.product}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.id} • Qty: {order.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-foreground text-sm">${order.total}</p>
                          <p className="text-xs text-muted-foreground">{order.date}</p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Start creating your custom stationery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/customize" className="block">
                  <Button className="w-full justify-start h-auto py-4" size="lg">
                    <Package className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Create New Design</div>
                      <div className="text-xs font-normal opacity-90">Customize business cards, letterheads & more</div>
                    </div>
                  </Button>
                </Link>
                
                <Link to="/products" className="block">
                  <Button variant="outline" className="w-full justify-start h-auto py-4" size="lg">
                    <ShoppingCart className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Browse Products</div>
                      <div className="text-xs font-normal text-muted-foreground">Explore our stationery catalog</div>
                    </div>
                  </Button>
                </Link>

                <Link to="/orders" className="block">
                  <Button variant="outline" className="w-full justify-start h-auto py-4" size="lg">
                    <Clock className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Track Orders</div>
                      <div className="text-xs font-normal text-muted-foreground">Check status of your orders</div>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Popular Products */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Popular Products</CardTitle>
              <CardDescription>Most ordered stationery items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {recentProducts.map((product) => (
                  <Link key={product.id} to="/products" className="group">
                    <div className="rounded-lg border border-border overflow-hidden hover:shadow-md transition-all">
                      <div className="aspect-square bg-muted relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <Package className="h-12 w-12 text-primary/40" />
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{product.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}