import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { StatusBadge, StockStatus } from './StatusBadge';
import { Search, TrendingDown, TrendingUp, Package, ShoppingBag, Calendar, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  minStock: number;
  unit: string;
  status: StockStatus;
  lastRestocked: string;
}

interface UserInventoryPageProps {
  onMenuClick?: () => void;
}

export function UserInventoryPage({ onMenuClick }: UserInventoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [preOrderAlert, setPreOrderAlert] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Mapping items to actual print products with fallback default stock values
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Premium Business Cards',
      category: 'Business Cards',
      sku: 'BC-PREM',
      stock: 25000,
      minStock: 10000,
      unit: 'cards',
      status: 'in-stock',
      lastRestocked: '2026-05-15'
    },
    {
      id: '2',
      name: 'Corporate Letterheads',
      category: 'Letterheads',
      sku: 'LH-CORP',
      stock: 8500,
      minStock: 10000,
      unit: 'sheets',
      status: 'low-stock',
      lastRestocked: '2026-05-20'
    },
    {
      id: '3',
      name: 'Custom Envelopes',
      category: 'Envelopes',
      sku: 'EV-PROF',
      stock: 12000,
      minStock: 5000,
      unit: 'units',
      status: 'in-stock',
      lastRestocked: '2026-05-10'
    },
    {
      id: '4',
      name: 'Designer Notepads',
      category: 'Notepads',
      sku: 'NP-DESG',
      stock: 0,
      minStock: 1000,
      unit: 'pads',
      status: 'out-of-stock',
      lastRestocked: '2026-05-25'
    },
    {
      id: '5',
      name: 'Presentation Folders',
      category: 'Folders',
      sku: 'FL-PRES',
      stock: 450,
      minStock: 500,
      unit: 'folders',
      status: 'low-stock',
      lastRestocked: '2026-05-18'
    },
    {
      id: '6',
      name: 'Compliment Slips',
      category: 'Slips',
      sku: 'CS-COMP',
      stock: 15000,
      minStock: 2000,
      unit: 'slips',
      status: 'in-stock',
      lastRestocked: '2026-05-28'
    },
  ]);

  // User's order list
  const [orders, setOrders] = useState<any[]>([
    { id: 'ORD-2026-001', name: 'Premium Business Cards', quantity: '500 units', cost: '$112.50', date: '2026-06-01', status: 'In Production' },
    { id: 'ORD-2026-002', name: 'Corporate Letterheads', quantity: '25 reams', cost: '$350.00', date: '2026-06-02', status: 'Printing' },
    { id: 'ORD-2026-003', name: 'Custom Envelopes', quantity: '1000 units', cost: '$350.00', date: '2026-05-28', status: 'Delivered' },
  ]);

  // Fetch real-time stock levels and actual user order history
  useEffect(() => {
    const fetchInventoryAndOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      // 1. Fetch live stock from inventory
      try {
        const invResponse = await fetch('/api/v1/inventory', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const invData = await invResponse.json();
        if (invResponse.ok && invData.success && invData.data && invData.data.length > 0) {
          const mappedInventory = invData.data.map((item: any) => {
            const prod = item.product || {};
            
            // Map units based on SKU
            let unit = 'units';
            if (prod.sku === 'BC-PREM') unit = 'cards';
            else if (prod.sku === 'LH-CORP') unit = 'sheets';
            else if (prod.sku === 'NP-DESG') unit = 'pads';
            else if (prod.sku === 'FL-PRES') unit = 'folders';
            else if (prod.sku === 'CS-COMP') unit = 'slips';

            // Determine stock status
            let status: StockStatus = 'in-stock';
            if (item.quantityAvailable === 0) status = 'out-of-stock';
            else if (item.quantityAvailable < item.reorderPoint) status = 'low-stock';

            return {
              id: item._id,
              name: prod.name || 'Unknown Product',
              category: prod.category || 'General',
              sku: prod.sku || 'N/A',
              stock: item.quantityAvailable,
              minStock: item.reorderPoint,
              unit,
              status,
              lastRestocked: item.lastStockedAt ? item.lastStockedAt.slice(0, 10) : 'N/A'
            };
          });
          
          // Sort mapped inventory by category order
          const categoryOrder = ['Business Cards', 'Letterheads', 'Envelopes', 'Notepads', 'Folders', 'Slips'];
          mappedInventory.sort((a: any, b: any) => {
            const idxA = categoryOrder.indexOf(a.category);
            const idxB = categoryOrder.indexOf(b.category);
            return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
          });

          setInventory(mappedInventory);
        }
      } catch (err) {
        console.error('Error fetching inventory:', err);
      }

      // 2. Fetch live orders
      try {
        const orderResponse = await fetch('/api/v1/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const orderData = await orderResponse.json();
        if (orderResponse.ok && orderData.success) {
          if (orderData.data && orderData.data.length > 0) {
            const mappedOrders = orderData.data.map((order: any) => {
              // Gather product names
              const names = order.items && order.items.length > 0 
                ? order.items.map((item: any) => item.product?.name || 'Custom Print').join(', ')
                : 'Custom Print';
              
              // Gather quantities
              const quantity = order.items && order.items.length > 0
                ? order.items.map((item: any) => `${item.quantity} units`).join(', ')
                : '1 unit';
              
              // Map status
              let status = 'In Production';
              if (order.status === 'delivered') status = 'Delivered';
              else if (order.status === 'printing' || order.status === 'ready' || order.status === 'processing') status = 'Printing';

              // Gather customizations
              const customizations = order.items && order.items.length > 0
                ? order.items.map((item: any) => item.customization || null).filter(Boolean)
                : [];

              return {
                id: order.orderNumber || order._id,
                name: names,
                quantity: quantity,
                cost: `$${order.total.toFixed(2)}`,
                date: order.createdAt ? order.createdAt.slice(0, 10) : 'N/A',
                status,
                customizations
              };
            });
            setOrders(mappedOrders);
          } else {
            // Set orders to empty if the user actually has no orders yet in the DB
            setOrders([]);
          }
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchInventoryAndOrders();
  }, []);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: inventory.length,
    inStock: inventory.filter(i => i.status === 'in-stock').length,
    lowStock: inventory.filter(i => i.status === 'low-stock').length,
    outOfStock: inventory.filter(i => i.status === 'out-of-stock').length,
  };

  const getCustomizerLink = (sku: string) => {
    switch(sku) {
      case 'LH-CORP': return '/customize-letterheads';
      case 'EV-PROF': return '/customize-envelopes';
      case 'NP-DESG': return '/customize-notepads';
      case 'FL-PRES': return '/customize-folders';
      case 'CS-COMP': return '/customize-slips';
      default: return '/customize';
    }
  };

  const handlePreOrder = (itemName: string) => {
    setPreOrderAlert(`Pre-order request successfully placed for ${itemName}. Our stock managers have been notified.`);
    setTimeout(() => {
      setPreOrderAlert(null);
    }, 5000);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <AppHeader onMenuClick={onMenuClick} />
      
      <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto pb-20">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500">My Print Inventory</h1>
              <p className="text-muted-foreground text-sm mt-1">Check stock levels, place print orders, and track your history</p>
            </div>
          </div>

          {/* Feedback/PreOrder Notification Alert */}
          {preOrderAlert && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span className="font-medium">{preOrderAlert}</span>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <Card className="shadow-sm border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Items</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
                  </div>
                  <div className="p-2.5 bg-primary/10 rounded-lg">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">In Stock</p>
                    <p className="text-2xl font-bold text-emerald-500 mt-1">{stats.inStock}</p>
                  </div>
                  <div className="p-2.5 bg-emerald-500/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Low Stock</p>
                    <p className="text-2xl font-bold text-amber-500 mt-1">{stats.lowStock}</p>
                  </div>
                  <div className="p-2.5 bg-amber-500/10 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Out of Stock</p>
                    <p className="text-2xl font-bold text-destructive mt-1">{stats.outOfStock}</p>
                  </div>
                  <div className="p-2.5 bg-destructive/10 rounded-lg">
                    <Package className="h-5 w-5 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Table */}
          <Card className="shadow-md border-border/50">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Available Stock Levels</CardTitle>
                  <CardDescription>Order products or request pre-orders for out of stock items</CardDescription>
                </div>
                <div className="relative w-full sm:w-[300px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search inventory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-input-background"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-border overflow-x-auto bg-background/50">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-semibold text-foreground py-4">Item Name</TableHead>
                      <TableHead className="font-semibold text-foreground py-4">SKU</TableHead>
                      <TableHead className="font-semibold text-foreground py-4">Category</TableHead>
                      <TableHead className="font-semibold text-foreground py-4">Available Stock</TableHead>
                      <TableHead className="font-semibold text-foreground py-4">Status</TableHead>
                      <TableHead className="font-semibold text-foreground py-4 text-center">Order</TableHead>
                      <TableHead className="font-semibold text-foreground py-4 text-center">PreOrder</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/40 transition-colors">
                        <TableCell className="font-semibold text-foreground py-3.5 whitespace-nowrap">{item.name}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono font-medium text-foreground">{item.sku}</code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-medium">{item.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-foreground">
                            {item.stock.toLocaleString()} {item.unit}
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                        </TableCell>
                        <TableCell className="text-center">
                          <Link to={getCustomizerLink(item.sku)}>
                            <Button size="sm" className="h-8 text-xs font-bold px-3">
                              Order
                            </Button>
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs font-semibold px-2 text-primary hover:bg-primary/5"
                            onClick={() => handlePreOrder(item.name)}
                          >
                            PreOrder
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredInventory.length === 0 && (
                <div className="py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg text-foreground mb-2">No materials found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search query
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ACTIVE ORDERS & HISTORY SECTION */}
          <Card className="shadow-md border-border/50 bg-gradient-to-br from-background to-muted/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" /> Active Print Orders & History
              </CardTitle>
              <CardDescription>Track specifications, estimated costs, and real-time print status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3.5">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="flex flex-col p-4 rounded-xl border border-border bg-background hover:bg-muted/10 transition-all gap-1 cursor-pointer"
                    onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-foreground text-sm sm:text-base leading-tight">{order.name}</h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{order.id}</span>
                            <span>•</span>
                            <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {order.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-muted-foreground leading-none">Quantity: <span className="font-medium text-foreground">{order.quantity}</span></p>
                          <p className="text-sm font-bold text-foreground mt-1 flex items-center justify-start sm:justify-end"><CreditCard className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> {order.cost}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          {order.status === 'Delivered' ? (
                            <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Delivered
                            </span>
                          ) : order.status === 'Printing' ? (
                            <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                              Printing
                            </span>
                          ) : (
                            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              In Production
                            </span>
                          )}
                          <ChevronRight className={`h-4 w-4 text-muted-foreground hidden sm:block transition-transform duration-200 ${expandedOrderId === order.id ? 'rotate-90' : ''}`} />
                        </div>
                      </div>
                    </div>

                    {/* EXPANDED SPECIFICATIONS DETAILS */}
                    {expandedOrderId === order.id && order.customizations && order.customizations.length > 0 && (
                      <div 
                        className="mt-4 pt-4 border-t border-dashed border-border text-xs space-y-4 animate-in fade-in slide-in-from-top-1 duration-200" 
                        onClick={(e) => e.stopPropagation()}
                      >
                        {order.customizations.map((customization: any, idx: number) => {
                          if (!customization) return null;
                          return (
                            <div key={idx} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h5 className="font-bold text-primary text-xs uppercase tracking-wider">
                                  Item #{idx + 1} Custom Specifications
                                </h5>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-muted/20 p-3 rounded-lg border border-border/40">
                                {Object.entries(customization).map(([key, val]) => {
                                  if (val === null || val === undefined || val === '' || typeof val === 'object') return null;
                                  
                                  // Skip demo image strings that might clutter the view
                                  if (String(val).startsWith('/images/')) return null;
                                  
                                  const label = key
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/^./, str => str.toUpperCase());
                                  return (
                                    <div key={key} className="space-y-0.5 truncate">
                                      <span className="text-[9px] font-bold text-muted-foreground uppercase block">{label}</span>
                                      <span className="text-[11px] font-semibold text-foreground block truncate" title={String(val)}>{String(val)}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
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
