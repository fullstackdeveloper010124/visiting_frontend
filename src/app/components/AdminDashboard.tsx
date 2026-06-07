import { useState, useEffect } from 'react';
import { AppHeader } from './AppHeader';
import { StatsCard } from './StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { TrendingUp, Users, Package, DollarSign, ShoppingCart, AlertCircle, Eye, Loader2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatusBadge, OrderStatus } from './StatusBadge';
import { Button } from './ui/button';

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

interface AdminDashboardProps {
  onMenuClick?: () => void;
}

export function AdminDashboard({ onMenuClick }: AdminDashboardProps) {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loadingApprovals, setLoadingApprovals] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState<any | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/customize-config/approvals', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          setApprovals(resData.data);
        }
      } catch (err) {
        console.error('Error fetching card approvals:', err);
      } finally {
        setLoadingApprovals(false);
      }
    };

    fetchApprovals();
  }, []);

  const stats = [
    {
      title: 'Total Revenue',
      value: '$48,574',
      description: 'This month',
      icon: DollarSign,
      trend: { value: '+18.2%', isPositive: true },
      iconColor: 'bg-success'
    },
    {
      title: 'Total Orders',
      value: '342',
      description: 'This month',
      icon: ShoppingCart,
      trend: { value: '+12.5%', isPositive: true },
      iconColor: 'bg-primary'
    },
    {
      title: 'Active Users',
      value: '1,248',
      description: 'Registered customers',
      icon: Users,
      trend: { value: '+8.3%', isPositive: true },
      iconColor: 'bg-info'
    },
    {
      title: 'Low Stock Items',
      value: '12',
      description: 'Need attention',
      icon: AlertCircle,
      iconColor: 'bg-warning'
    },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 35000, orders: 245 },
    { month: 'Feb', revenue: 42000, orders: 289 },
    { month: 'Mar', revenue: 38000, orders: 267 },
    { month: 'Apr', revenue: 45000, orders: 312 },
    { month: 'May', revenue: 52000, orders: 356 },
    { month: 'Jun', revenue: 48574, orders: 342 },
  ];

  const productDistribution = [
    { name: 'Business Cards', value: 35, color: '#2563eb' },
    { name: 'Letterheads', value: 25, color: '#06b6d4' },
    { name: 'Envelopes', value: 20, color: '#8b5cf6' },
    { name: 'Notepads', value: 12, color: '#10b981' },
    { name: 'Others', value: 8, color: '#f59e0b' },
  ];

  const recentOrders: RecentOrder[] = [
    { id: 'ORD-2024-087', customer: 'TechCorp Inc.', product: 'Business Cards (Premium)', amount: 299.99, status: 'processing', date: '2024-02-02' },
    { id: 'ORD-2024-086', customer: 'Design Studio', product: 'Letterheads (Corporate)', amount: 449.99, status: 'printing', date: '2024-02-02' },
    { id: 'ORD-2024-085', customer: 'Startup Co.', product: 'Complete Stationery Set', amount: 899.99, status: 'delivered', date: '2024-02-01' },
    { id: 'ORD-2024-084', customer: 'Law Firm LLC', product: 'Envelopes (Premium)', amount: 189.99, status: 'shipped', date: '2024-02-01' },
    { id: 'ORD-2024-083', customer: 'Marketing Agency', product: 'Notepads (Custom)', amount: 349.99, status: 'processing', date: '2024-02-01' },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader onMenuClick={onMenuClick} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground">Overview of your printing business performance</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatsCard key={stat.title} {...stat} />
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            {/* Revenue & Orders Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Revenue & Orders Trend</CardTitle>
                <CardDescription>Monthly performance over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
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
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} name="Revenue ($)" />
                    <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} name="Orders" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Product Distribution */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Product Distribution</CardTitle>
                <CardDescription>Sales by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {productDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Card Design Approvals */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Card Design Approvals</CardTitle>
                <CardDescription>Approval status of customized client designs</CardDescription>
              </div>
              <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-semibold">
                Total Requests: {approvals.length}
              </span>
            </CardHeader>
            <CardContent>
              {loadingApprovals ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : approvals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No card design approval requests found.
                </div>
              ) : (
                <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                  {approvals.map((app) => (
                    <div key={app._id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/40 transition-all shadow-sm bg-background">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="font-semibold text-foreground text-sm truncate">{app.userEmail}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          Design: <span className="font-medium text-foreground">
                            {app.designType === 'letterhead' ? `Letterhead Stationery (${app.designDetails?.measurement})` :
                             app.designType === 'envelope' ? `Custom Envelope (${app.designDetails?.measurement})` :
                             app.designType === 'notepad' ? `Designer Notepad (${app.designDetails?.measurement})` :
                             app.designType === 'folder' ? `Presentation Folder (${app.designDetails?.measurement})` :
                             app.designType === 'slip' ? `Compliment Slip (${app.designDetails?.measurement})` :
                             `Business Card - ${app.designDetails?.companyName || 'N/A'}`}
                          </span>
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Requested: {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {app.status === 'approved' ? (
                          <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            Approved
                          </span>
                        ) : (
                          <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 animate-pulse">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                            Pending User
                          </span>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-xs font-semibold px-2.5 flex items-center"
                          onClick={() => {
                            setSelectedApproval(app);
                            setDetailModalOpen(true);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> View Design
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{order.customer}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {order.id} • {order.product}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-foreground text-sm">${order.amount}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* CARD DESIGN DETAILS MODAL (SUPER ADMIN VIEW) */}
      {detailModalOpen && selectedApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg bg-background border border-border shadow-2xl overflow-hidden rounded-xl animate-in zoom-in-95 duration-200">
            <div className="h-2 bg-gradient-to-r from-emerald-500 to-blue-600"></div>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold">Client Card Design Specs</CardTitle>
                  <CardDescription className="text-xs mt-1">Submitted by <span className="font-semibold text-foreground">{selectedApproval.userEmail}</span></CardDescription>
                </div>
                {selectedApproval.status === 'approved' ? (
                  <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Approved by User
                  </span>
                ) : (
                  <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                    Pending User Approval
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-6 max-h-[60vh] overflow-y-auto">
              <div className="p-4 rounded-lg bg-muted/40 border border-border text-sm space-y-2.5">
                {selectedApproval.designType === 'letterhead' ? (
                  /* LETTERHEAD DETAIL VIEW */
                  <>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Product Type:</span>
                      <span className="font-bold text-foreground text-xs">Letterhead Stationery</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Measurement:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.measurement || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Number of Reams:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.reams || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Cost per Ream:</span>
                      <span className="font-medium text-foreground text-xs">${selectedApproval.designDetails?.costPerReam || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Quantity in Stock:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.inStock || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Quantity Balance:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.balance || 'N/A'}</span>
                    </div>
                  </>
                ) : selectedApproval.designType === 'envelope' ? (
                  /* ENVELOPE DETAIL VIEW */
                  <>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Product Type:</span>
                      <span className="font-bold text-foreground text-xs">Custom Envelopes</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Measurement:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.measurement || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Number of Boxes:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.boxes || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Cost per Box:</span>
                      <span className="font-medium text-foreground text-xs">${selectedApproval.designDetails?.costPerBox || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Quantity in Stock:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.inStock || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Quantity Balance:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.balance || 'N/A'}</span>
                    </div>
                  </>
                ) : selectedApproval.designType === 'notepad' ? (
                  /* NOTEPAD DETAIL VIEW */
                  <>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Product Type:</span>
                      <span className="font-bold text-foreground text-xs">Designer Notepads</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Measurement:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.measurement || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Number of Pads:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.pads || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Cost per Pad:</span>
                      <span className="font-medium text-foreground text-xs">${selectedApproval.designDetails?.costPerPad || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Quantity in Stock:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.inStock || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Quantity Balance:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.balance || 'N/A'}</span>
                    </div>
                  </>
                ) : selectedApproval.designType === 'folder' ? (
                  /* FOLDER DETAIL VIEW */
                  <>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Product Type:</span>
                      <span className="font-bold text-foreground text-xs">Presentation Folders</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Measurement:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.measurement || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Number of Boxes:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.boxes || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Cost per Box:</span>
                      <span className="font-medium text-foreground text-xs">${selectedApproval.designDetails?.costPerBox || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Quantity in Stock:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.inStock || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Quantity Balance:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.balance || 'N/A'}</span>
                    </div>
                  </>
                ) : selectedApproval.designType === 'slip' ? (
                  /* SLIP DETAIL VIEW */
                  <>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Product Type:</span>
                      <span className="font-bold text-foreground text-xs">Compliment Slips</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Measurement:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.measurement || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Number of Boxes:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.boxes || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Cost per Box:</span>
                      <span className="font-medium text-foreground text-xs">${selectedApproval.designDetails?.costPerBox || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Quantity in Stock:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.inStock || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Quantity Balance:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.balance || 'N/A'}</span>
                    </div>
                  </>
                ) : (
                  /* BUSINESS CARD DETAIL VIEW */
                  <>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Company Name:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.companyName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Tagline:</span>
                      <span className="font-medium text-foreground text-xs italic">{selectedApproval.designDetails?.tagline || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Person Name:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.personName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Job Title:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.jobTitle || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Primary color:</span>
                      <div className="flex items-center gap-1 text-xs font-mono">
                        <span className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: selectedApproval.designDetails?.primaryColor }}></span>
                        {selectedApproval.designDetails?.primaryColor || 'N/A'}
                      </div>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Secondary color:</span>
                      <div className="flex items-center gap-1 text-xs font-mono">
                        <span className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: selectedApproval.designDetails?.secondaryColor }}></span>
                        {selectedApproval.designDetails?.secondaryColor || 'N/A'}
                      </div>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Finished Size:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.finishedSize || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/30">
                      <span className="text-muted-foreground text-xs">Print Config:</span>
                      <span className="font-medium text-foreground text-xs">{selectedApproval.designDetails?.printConfig || 'N/A'}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border px-6 py-4 flex justify-end">
              <Button 
                variant="outline" 
                className="font-medium h-9 text-xs"
                onClick={() => setDetailModalOpen(false)}
              >
                Close Details
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}