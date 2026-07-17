import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router-dom';
import {
  Package, ShoppingCart, Star, Plus, Menu, UploadCloud,
  FileText, CheckCircle, Clock, Send, Save, User, Download, FileUp, Zap, Eye
} from 'lucide-react';

interface UserDashboardProps {
  onMenuClick?: () => void;
}

export function EnhancedUserDashboard({ onMenuClick }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || '';
  const userEmail = localStorage.getItem('userEmail') || '';
  const userRole = localStorage.getItem('userRole') || '';

  // Dynamic user's active orders state
  const [activeOrders, setActiveOrders] = useState<any[]>([
    { id: 'ORD-2026-001', name: 'Premium Business Cards', status: 'Printing', date: '2026-06-01' },
    { id: 'ORD-2026-002', name: 'Corporate Letterheads', status: 'Printing', date: '2026-06-02' },
    { id: 'ORD-2026-003', name: 'Custom Envelopes', status: 'Delivered', date: '2026-05-28' },
  ]);

  useEffect(() => {
    const fetchActiveOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('/api/v1/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resData = await response.json();
        if (response.ok && resData.success && resData.data) {
          if (resData.data.length > 0) {
            const mappedOrders = resData.data.map((order: any) => {
              const names = order.items && order.items.length > 0
                ? order.items.map((item: any) => item.product?.name || 'Custom Print').join(', ')
                : 'Custom Print';

              let status = 'In Production';
              if (order.status === 'delivered') status = 'Delivered';
              else if (order.status === 'printing' || order.status === 'ready' || order.status === 'processing') status = 'Printing';

              return {
                id: order.orderNumber || order._id,
                name: names,
                status,
                date: order.createdAt ? order.createdAt.slice(0, 10) : 'N/A'
              };
            });
            setActiveOrders(mappedOrders);
          } else {
            setActiveOrders([]);
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard orders:', err);
      }
    };

    fetchActiveOrders();
  }, []);

  const getProgressBarWidth = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return '100%';
      case 'printing':
      case 'proofing':
      case 'processing':
      case 'ready':
        return '60%';
      default:
        return '30%';
    }
  };

  const libraryItems = [
    { id: 1, name: 'Main Brand Business Card', category: 'Business Cards', lastOrdered: '2026-03-15', image: '/images/premium_business_cards.png' },
    { id: 2, name: 'Q1 Event Flyer', category: 'Flyers', lastOrdered: '2026-02-28', image: '/images/presentation_folders.png' },
    { id: 3, name: 'Executive Letterhead', category: 'Letterhead', lastOrdered: '2026-01-10', image: '/images/corporate_letterheads.png' },
    { id: 4, name: 'Welcome Kits', category: 'Folders', lastOrdered: '2025-12-05', image: '/images/custom_envelopes.png' },
  ];

  return (
    <div className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-950">
      {/* Premium Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 dark:from-emerald-400 dark:via-blue-400 dark:to-violet-400">
                Customer Portal
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Manage all your printing needs seamlessly</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            {userName && (
              <div className="flex items-center gap-3 border-r border-border pr-4 mr-1">
                <div className="text-right">
                  <p className="text-xs font-semibold text-foreground leading-normal">
                    {userName} <span className="text-muted-foreground font-normal">and</span> <span className="text-primary font-mono">{userEmail}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-0.5">
                    Role: Customer
                  </p>
                </div>
                <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20 text-[9px] font-bold uppercase py-0.5">
                  Customer
                </Badge>
              </div>
            )}
            <Button onClick={() => navigate('/customize')} variant="outline" className="shadow-sm border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
              Design Card Online
            </Button>
            <Button onClick={() => setActiveTab("upload")} className="bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 hover:opacity-90 transition-opacity shadow-md">
              <Plus className="mr-2 h-4 w-4" /> New Print Job
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">

          <ScrollArea className="w-full pb-2">
            <TabsList className="flex h-auto p-1.5 bg-muted/50 rounded-xl justify-start sm:justify-center overflow-x-auto border border-border/50 shadow-inner min-w-[max-content]">
              <TabsTrigger value="dashboard" className="rounded-lg px-4 py-2 data-[state=active]:shadow-sm data-[state=active]:bg-background transition-all">Dashboard</TabsTrigger>
              <TabsTrigger value="library" className="rounded-lg px-4 py-2 data-[state=active]:shadow-sm data-[state=active]:bg-background transition-all">Library & Reorder</TabsTrigger>
              <TabsTrigger value="upload" className="rounded-lg px-4 py-2 data-[state=active]:shadow-sm data-[state=active]:bg-background transition-all">Send a File</TabsTrigger>
              <TabsTrigger value="estimate" className="rounded-lg px-4 py-2 data-[state=active]:shadow-sm data-[state=active]:bg-background transition-all">Request Estimate</TabsTrigger>
              <TabsTrigger value="proofing" className="rounded-lg px-4 py-2 data-[state=active]:shadow-sm data-[state=active]:bg-background transition-all">Proofing Room</TabsTrigger>
              <TabsTrigger value="variable" className="rounded-lg px-4 py-2 data-[state=active]:shadow-sm data-[state=active]:bg-background transition-all">Variable Data</TabsTrigger>
              <TabsTrigger value="account" className="rounded-lg px-4 py-2 data-[state=active]:shadow-sm data-[state=active]:bg-background transition-all">Account</TabsTrigger>
            </TabsList>
          </ScrollArea>

          {/* 1. DASHBOARD & ORDERS */}
          <TabsContent value="dashboard" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-card to-muted border-border/50 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
                  <Package className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground mt-1">2 awaiting proofs</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-card to-muted border-border/50 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Saved Documents</CardTitle>
                  <Save className="h-4 w-4 text-indigo-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground mt-1">In your library</p>
                </CardContent>
              </Card>
              <Card className="sm:col-span-2 bg-primary/5 border-primary/20 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-warning fill-warning" /> Quick Action
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">You have a proof ready for review. Approve it to start printing!</p>
                  <Button onClick={() => setActiveTab("proofing")} className="w-full sm:w-auto shadow-sm">Review Proof #PT-9824</Button>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm border-border/50">
              <CardHeader>
                <CardTitle>Recent Orders & Tracking</CardTitle>
                <CardDescription>Track the status of your current print jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl bg-card hover:bg-muted/50 transition-colors gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{order.name}</h4>
                          <p className="text-xs text-muted-foreground">Order {order.id} • {order.date}</p>
                        </div>
                      </div>

                      <div className="flex-1 max-w-md px-4 hidden lg:block">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground mb-1">
                          <span>Request</span>
                          <span>Proofing</span>
                          <span>Printing</span>
                          <span>Shipping or Ready for Pickup</span>
                        </div>
                        <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000"
                            style={{ width: getProgressBarWidth(order.status) }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button onClick={() => navigate('/user-inventory', { state: { selectedOrderId: order.id } })} variant="outline" size="sm" className="ml-auto sm:ml-0">Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 2. DOCUMENT LIBRARY */}
          <TabsContent value="library" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Document Library</h2>
                <p className="text-muted-foreground">Quickly reorder your saved business cards and brochures with one click.</p>
              </div>
              <Button onClick={() => setActiveTab("upload")} variant="outline" className="shadow-sm">
                <UploadCloud className="mr-2 h-4 w-4" /> Save New Asset
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {libraryItems.map((item) => (
                <Card key={item.id} className="group overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" className="scale-0 group-hover:scale-100 transition-transform shadow-lg">
                        <Eye className="mr-2 h-4 w-4" /> Preview
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <Badge variant="outline" className="w-fit mb-1">{item.category}</Badge>
                    <CardTitle className="text-base line-clamp-1">{item.name}</CardTitle>
                    <CardDescription className="text-xs">Last ordered: {item.lastOrdered}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-2">
                    <Button className="w-full bg-primary/90 hover:bg-primary shadow-sm" onClick={() => alert("Redirecting to checkout for " + item.name)}>
                      <ShoppingCart className="mr-2 h-4 w-4" /> 1-Click Reorder
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 3. SEND A FILE (UPLOAD) */}
          <TabsContent value="upload" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <Card className="border-border/50 shadow-md">
              <CardHeader className="bg-muted/30 border-b border-border/50 pb-6">
                <CardTitle className="text-2xl">Send a File</CardTitle>
                <CardDescription>Upload design files securely. We accept PDF, AI, PSD, JPG, and PNG formats.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors rounded-xl p-12 text-center bg-muted/10 cursor-pointer flex flex-col items-center justify-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <FileUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Drag & Drop your files here</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md">Maximum file size: 500MB. Ensure all fonts and images are embedded for best results.</p>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <Button className="shadow-sm">Select Files from Computer</Button>
                    <span className="text-sm text-muted-foreground">or</span>
                    <Button variant="outline" className="text-primary border-primary/20 bg-primary/5 hover:bg-primary/10" onClick={() => navigate('/customize')}>
                      Design Business Card Online
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" /> Printing Instructions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-type">Product Type</Label>
                      <Input id="product-type" placeholder="e.g. Business Cards, Brochure" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity Needed</Label>
                      <Input id="quantity" type="number" placeholder="e.g. 500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Notes / Finishing Options</Label>
                    <Textarea
                      id="notes"
                      placeholder="e.g. I need a glossy finish. Please ensure the colors match the previous order."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 border-t border-border/50 pt-6">
                <Button className="w-full md:w-auto h-11 px-8 text-md font-semibold bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all"><Send className="mr-2 h-5 w-5" /> Submit Files to Print</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 4. REQUEST AN ESTIMATE */}
          <TabsContent value="estimate" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <Card className="border-border/50 shadow-md">
              <CardHeader className="bg-muted/30 border-b border-border/50">
                <CardTitle className="text-2xl">Request an Estimate</CardTitle>
                <CardDescription>Tell us about your custom print job, and our team will get back to you with pricing within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Project Name</Label>
                    <Input placeholder="Marketing Campaign Materials" />
                  </div>
                  <div className="space-y-2">
                    <Label>Dimensions / Size</Label>
                    <Input placeholder="e.g. 8.5 x 11, Custom" />
                  </div>
                  <div className="space-y-2">
                    <Label>Paper Type preferred</Label>
                    <Input placeholder="e.g. 100lb Gloss Text, Uncoated" />
                  </div>
                  <div className="space-y-2">
                    <Label>Required Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Job Description & Finishing Details</Label>
                  <Textarea placeholder="Describe folds, die-cuts, foil stamping, or binding requirements..." rows={5} />
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 border-t border-border/50 pt-6">
                <Button className="h-11 shadow-sm px-6"><FileText className="mr-2 h-4 w-4" /> Request Quote</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 5. PROOFING ROOM */}
          <TabsContent value="proofing" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Proofing Room</h2>
              <p className="text-muted-foreground">Preview your designs and approve them for printing. We won't print until you say it's perfect.</p>
            </div>

            <Card className="overflow-hidden border-warning/30 shadow-lg ring-1 ring-warning/20">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="bg-muted p-8 flex items-center justify-center border-r border-border">
                  <div className="relative group cursor-pointer">
                    {/* Fake Proof Image */}
                    <div className="w-64 h-80 bg-white shadow-xl rotate-[-2deg] rounded-sm flex flex-col p-4 border transition-transform group-hover:rotate-0 group-hover:scale-105 duration-300">
                      <div className="h-12 bg-primary/20 mb-4 rounded w-1/2"></div>
                      <div className="h-4 bg-muted mb-2 rounded"></div>
                      <div className="h-4 bg-muted mb-2 rounded w-5/6"></div>
                      <div className="h-4 bg-muted mb-2 rounded w-4/6"></div>
                      <div className="mt-auto h-20 bg-primary/10 rounded"></div>
                    </div>
                    <Badge className="absolute top-4 right-4 shadow-md pointer-events-none">Click to enlarge</Badge>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center space-y-6">
                  <div>
                    <Badge className="bg-warning text-warning-foreground mb-3">ACTION REQUIRED</Badge>
                    <h3 className="text-2xl font-bold mb-2">Order #PT-9824</h3>
                    <p className="text-muted-foreground text-sm">Please review the digital proof for Premium Business Cards. Ensure all spelling, colors, and layout positioning are correct.</p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <p className="text-sm font-medium flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-success" /> Bleeds configured correctly</p>
                    <p className="text-sm font-medium flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-success" /> High resolution images detected</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <Button className="w-full h-12 text-md font-bold bg-success hover:bg-success/90 text-success-foreground shadow-md transition-transform hover:scale-[1.02]">
                      <CheckCircle className="mr-2 h-5 w-5" /> I Approve This Proof for Printing
                    </Button>
                    <Button variant="outline" className="w-full text-muted-foreground border-border/70 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors">
                      Request Changes
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* 6. VARIABLE DATA */}
          <TabsContent value="variable" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Personalized Printing</h2>
              <p className="text-muted-foreground">Upload your spreadsheet data to print unique names, addresses, or codes on a single batch.</p>
            </div>
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="bg-primary/5 border-b border-primary/10">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-primary flex items-center"><FileText className="mr-2 h-5 w-5" /> Import Data Source</CardTitle>
                    <CardDescription className="text-primary/70 mt-1">Accepts CSV, XLSX files</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary bg-primary/10 hover:bg-primary/20"><Download className="mr-2 h-4 w-4" /> Template.csv</Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/20">
                  <Button variant="secondary" className="mb-3 shadow-sm"><FileUp className="mr-2 h-4 w-4" /> Upload Spreadsheet</Button>
                  <p className="text-xs text-muted-foreground">Column headers must match your design placeholder fields.</p>
                </div>

                <div className="space-y-3">
                  <Label>Map Data Fields</Label>
                  <div className="p-4 border rounded-lg bg-card text-sm text-center text-muted-foreground">
                    Upload a file to map fields like "First Name", "Address" to your design.
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button disabled className="w-full">Continue to Preview</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 7. ACCOUNT MANAGEMENT */}
          <TabsContent value="account" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="text-xl flex items-center"><User className="mr-2 h-5 w-5" /> Account Details</CardTitle>
                <CardDescription>Manage your contact info and saved addresses</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">Personal Info</h4>
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input defaultValue="Alex Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input defaultValue="alex.doe@company.com" disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input defaultValue="+1 (555) 012-3456" />
                    </div>
                    <Button className="mt-2" variant="secondary">Change Password</Button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">Default Shipping Address</h4>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input defaultValue="Acme Corp" />
                    </div>
                    <div className="space-y-2">
                      <Label>Street Address</Label>
                      <Input defaultValue="123 Printing Lane, Suite 100" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input defaultValue="Creative City" />
                      </div>
                      <div className="space-y-2">
                        <Label>Zip / Postal</Label>
                        <Input defaultValue="90210" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 border-t border-border/50 pt-6 justify-end">
                <Button className="shadow-sm"><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
