import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';

interface AnalyticsPageProps {
  onMenuClick?: () => void;
}

export function AnalyticsPage({ onMenuClick }: AnalyticsPageProps) {
  const monthlyRevenue = [
    { month: 'Jul', revenue: 32000, orders: 215, customers: 142 },
    { month: 'Aug', revenue: 35000, orders: 245, customers: 168 },
    { month: 'Sep', revenue: 42000, orders: 289, customers: 195 },
    { month: 'Oct', revenue: 38000, orders: 267, customers: 178 },
    { month: 'Nov', revenue: 45000, orders: 312, customers: 203 },
    { month: 'Dec', revenue: 52000, orders: 356, customers: 234 },
    { month: 'Jan', revenue: 48574, orders: 342, customers: 221 },
  ];

  const productSales = [
    { name: 'Business Cards', sales: 15240, percentage: 35 },
    { name: 'Letterheads', sales: 10890, percentage: 25 },
    { name: 'Envelopes', sales: 8712, percentage: 20 },
    { name: 'Notepads', sales: 5227, percentage: 12 },
    { name: 'Others', sales: 3485, percentage: 8 },
  ];

  const customerSegments = [
    { segment: 'Enterprise', value: 45, color: '#2563eb' },
    { segment: 'Small Business', value: 30, color: '#06b6d4' },
    { segment: 'Startups', value: 15, color: '#8b5cf6' },
    { segment: 'Individual', value: 10, color: '#10b981' },
  ];

  const orderStatusData = [
    { status: 'Completed', count: 1842, color: '#10b981' },
    { status: 'Processing', count: 234, color: '#3b82f6' },
    { status: 'Pending', count: 156, color: '#f59e0b' },
    { status: 'Cancelled', count: 89, color: '#ef4444' },
  ];

  const topProducts = [
    { rank: 1, name: 'Premium Business Cards', sales: 5240, revenue: 262000, trend: 12 },
    { rank: 2, name: 'Corporate Letterheads', sales: 3890, revenue: 349100, trend: 8 },
    { rank: 3, name: 'Custom Envelopes', sales: 3212, revenue: 128480, trend: -3 },
    { rank: 4, name: 'Designer Notepads', sales: 2527, revenue: 75810, trend: 15 },
    { rank: 5, name: 'Presentation Folders', sales: 1985, revenue: 138950, trend: 5 },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader onMenuClick={onMenuClick} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
            </div>
            <Select defaultValue="30">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <div className="p-2 bg-success/10 rounded-lg">
                    <DollarSign className="h-4 w-4 text-success" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground mb-2">$293,574</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-sm font-medium">+18.2%</span>
                  </div>
                  <span className="text-sm text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground mb-2">2,026</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-sm font-medium">+12.5%</span>
                  </div>
                  <span className="text-sm text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">Active Customers</p>
                  <div className="p-2 bg-info/10 rounded-lg">
                    <Users className="h-4 w-4 text-info" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground mb-2">1,341</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-sm font-medium">+8.3%</span>
                  </div>
                  <span className="text-sm text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Package className="h-4 w-4 text-warning" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground mb-2">$144.92</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-destructive">
                    <TrendingDown className="h-3 w-3" />
                    <span className="text-sm font-medium">-2.4%</span>
                  </div>
                  <span className="text-sm text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Revenue Trend */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue and order volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyRevenue}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      name="Revenue ($)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Order Status Distribution */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
                <CardDescription>Current orders by status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Product Sales Performance */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Product Sales Performance</CardTitle>
                <CardDescription>Sales volume by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productSales} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis dataKey="name" type="category" stroke="#64748b" width={120} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar dataKey="sales" fill="#2563eb" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Customer Segments */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Revenue distribution by customer type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ segment, value }) => `${segment} ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Products Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best selling products this period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProducts.map((product) => (
                  <div key={product.rank} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                        #{product.rank}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales.toLocaleString()} units sold</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-bold text-foreground">${product.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                      </div>
                      <div className={`flex items-center gap-1 ${product.trend >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {product.trend >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-medium">{Math.abs(product.trend)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}