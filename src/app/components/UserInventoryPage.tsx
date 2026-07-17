import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { StatusBadge, StockStatus } from './StatusBadge';
import { Search, TrendingDown, TrendingUp, Package, ShoppingBag, Calendar, CreditCard, ChevronRight, CheckCircle2, Clock, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Link, useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [preOrderAlert, setPreOrderAlert] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const renderDesignPreview = (customization: any, productName: string) => {
    if (!customization) {
      return (
        <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-lg p-6 bg-muted/20 text-muted-foreground w-full max-w-[250px] mx-auto text-center">
          <Package className="h-8 w-8 mb-2 opacity-40 text-primary" />
          <p className="text-xs font-semibold text-foreground">Standard Printed Item</p>
          <p className="text-[10px]">{productName}</p>
        </div>
      );
    }

    const getFontFamily = (family: string) => {
      switch(family) {
        case 'serif': return 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
        case 'mono': return 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
        default: return 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      }
    };

    // Envelope
    if (customization.uploadedFront || customization.uploadedBack) {
      return (
        <div className="space-y-3 w-full max-w-[280px] mx-auto">
          {customization.uploadedFront && (
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Front Side</span>
              <div 
                className="w-full aspect-[9.5/4.125] rounded border border-border shadow-sm bg-white bg-no-repeat bg-center"
                style={{
                  backgroundImage: customization.uploadedFront !== '/images/envelope_front_demo.png' && customization.uploadedFront.startsWith('/') ? `url(${customization.uploadedFront})` : 'none',
                  backgroundSize: 'cover',
                }}
              >
                {(customization.uploadedFront === '/images/envelope_front_demo.png' || !customization.uploadedFront.startsWith('/')) && (
                  <div className="h-full flex items-center justify-center text-[10px] text-muted-foreground">Front Preview</div>
                )}
              </div>
            </div>
          )}
          {customization.uploadedBack && (
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Back Side</span>
              <div 
                className="w-full aspect-[9.5/4.125] rounded border border-border shadow-sm bg-white bg-no-repeat bg-center"
                style={{
                  backgroundImage: customization.uploadedBack !== '/images/envelope_back_demo.png' && customization.uploadedBack.startsWith('/') ? `url(${customization.uploadedBack})` : 'none',
                  backgroundSize: 'cover',
                }}
              >
                {(customization.uploadedBack === '/images/envelope_back_demo.png' || !customization.uploadedBack.startsWith('/')) && (
                  <div className="h-full flex items-center justify-center text-[10px] text-muted-foreground">Back Preview</div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Letterhead
    if (customization.uploadedLetterhead) {
      return (
        <div className="w-full max-w-[200px] mx-auto space-y-1">
          <span className="text-[9px] font-bold text-muted-foreground uppercase">Letterhead Design</span>
          <div 
            className="w-full aspect-[8.5/11] rounded border border-border shadow-sm bg-white bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(${customization.uploadedLetterhead})`,
              backgroundSize: 'cover',
            }}
          />
        </div>
      );
    }

    // Notepad
    if (customization.uploadedNotepad) {
      return (
        <div className="w-full max-w-[200px] mx-auto space-y-1">
          <span className="text-[9px] font-bold text-muted-foreground uppercase">Notepad Design</span>
          <div 
            className="w-full aspect-[5.5/8.5] rounded border border-border shadow-sm bg-white bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(${customization.uploadedNotepad})`,
              backgroundSize: 'cover',
            }}
          />
        </div>
      );
    }

    // Folder
    if (customization.uploadedFolder) {
      return (
        <div className="w-full max-w-[200px] mx-auto space-y-1">
          <span className="text-[9px] font-bold text-muted-foreground uppercase">Presentation Folder</span>
          <div 
            className="w-full aspect-[9/12] rounded border border-border shadow-sm bg-white bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(${customization.uploadedFolder})`,
              backgroundSize: 'cover',
            }}
          />
        </div>
      );
    }

    // Compliment Slip
    if (customization.uploadedSlip) {
      return (
        <div className="w-full max-w-[250px] mx-auto space-y-1">
          <span className="text-[9px] font-bold text-muted-foreground uppercase">Compliment Slip</span>
          <div 
            className="w-full aspect-[8.5/3.5] rounded border border-border shadow-sm bg-white bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(${customization.uploadedSlip})`,
              backgroundSize: 'cover',
            }}
          />
        </div>
      );
    }

    // Business Card
    if (customization.companyName || customization.personName) {
      return (
        <div className="space-y-3 w-full max-w-[250px] mx-auto">
          {/* Front Side */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-muted-foreground uppercase">Front Side</span>
            <div 
              className="w-full aspect-[3.5/2] rounded border border-border shadow-sm relative overflow-hidden text-left"
              style={{
                backgroundColor: customization.secondaryColor || '#ffffff',
                fontFamily: getFontFamily(customization.fontFamily),
                color: customization.textColor || '#1e293b',
              }}
            >
              {/* Scaled down business card front content */}
              <div className="absolute top-0 right-0 p-2 text-right flex flex-col items-end scale-75 origin-top-right">
                <span className="text-[8px] font-bold tracking-wider uppercase opacity-75">{customization.companyName}</span>
                <span className="text-[6px] tracking-wider opacity-60 italic">{customization.tagline}</span>
              </div>
              <div className="absolute bottom-0 left-0 p-2 space-y-0.5 max-w-[70%] scale-[0.7] origin-bottom-left leading-tight">
                <h3 className="text-sm font-bold">{customization.personName}</h3>
                <p className="text-[7px] font-medium tracking-wide opacity-85">{customization.jobTitle}</p>
                <div className="pt-0.5 text-[5px] space-y-0.2 opacity-85 leading-normal">
                  {customization.phone && <div>📞 {customization.phone}</div>}
                  {customization.email && <div>✉️ {customization.email}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-muted-foreground uppercase">Back Side</span>
            <div 
              className="w-full aspect-[3.5/2] rounded border border-border shadow-sm relative overflow-hidden flex flex-col items-center justify-center p-2"
              style={{
                backgroundColor: customization.primaryColor || '#10b981',
                fontFamily: getFontFamily(customization.fontFamily),
              }}
            >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none"></div>
              <div className="text-center scale-[0.7] origin-center bg-black/10 backdrop-blur-sm p-1.5 rounded border border-white/10 w-fit">
                <h2 className="text-xs font-bold leading-none" style={{ color: customization.secondaryColor || '#ffffff' }}>{customization.companyName}</h2>
                <p className="text-[6px] tracking-widest uppercase opacity-95 leading-none mt-0.5" style={{ color: customization.secondaryColor || '#ffffff' }}>{customization.tagline}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default Fallback
    return (
      <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-lg p-6 bg-muted/20 text-muted-foreground w-full max-w-[250px] mx-auto text-center">
        <Package className="h-8 w-8 mb-2 opacity-40 text-primary" />
        <p className="text-xs font-semibold text-foreground">Custom Ordered Product</p>
        <p className="text-[10px]">{productName}</p>
      </div>
    );
  };

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
    { id: 'ORD-2026-001', dbId: 'mock1', name: 'Premium Business Cards', quantity: '500 units', cost: '$112.50', date: '2026-06-01', status: 'In Production', paymentStatus: 'paid', allowedPaymentMethod: 'paypal' },
    { id: 'ORD-2026-002', dbId: 'mock2', name: 'Corporate Letterheads', quantity: '25 reams', cost: '$350.00', date: '2026-06-02', status: 'Printing', paymentStatus: 'paid', allowedPaymentMethod: 'credit_card' },
    { id: 'ORD-2026-003', dbId: 'mock3', name: 'Custom Envelopes', quantity: '1000 units', cost: '$350.00', date: '2026-05-28', status: 'Delivered', paymentStatus: 'pending', allowedPaymentMethod: 'none' },
  ]);

  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const handlePayNow = async (orderId: string, paymentMethod: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setPaying(true);
    setPayError(null);

    try {
      const response = await fetch(`/api/v1/orders/${orderId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentMethod })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        setOrders(prev => prev.map(o => o.dbId === orderId ? { ...o, paymentStatus: 'paid' } : o));
        setPayingOrderId(null);
      } else {
        setPayError(resData.error || 'Payment failed.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPayError('Connection error. Failed to complete payment.');
    } finally {
      setPaying(false);
    }
  };

  const getTimelineSteps = (order: any) => {
    const orderDate = new Date(order.date === 'N/A' ? Date.now() : order.date);
    
    // Format timeline process step dates relative to order creation date
    const formatDateOffset = (days: number) => {
      const d = new Date(orderDate.getTime() + days * 24 * 60 * 60 * 1000);
      return d.toISOString().slice(0, 10);
    };

    const allSteps = [
      { label: 'Order Placed', date: formatDateOffset(0), status: 'pending' },
      { label: 'Payment Confirmed', date: formatDateOffset(0), status: 'pending' },
      { label: 'In Production', date: formatDateOffset(1), status: 'processing' },
      { label: 'Printing', date: formatDateOffset(2), status: 'printing' },
      { label: 'Quality Check', date: formatDateOffset(3), status: 'printing' },
      { label: 'Shipped', date: formatDateOffset(4), status: 'shipped' },
      { label: 'Delivered', date: formatDateOffset(6), status: 'delivered' },
    ];

    const statusOrder = ['pending', 'processing', 'printing', 'shipped', 'delivered'];
    const currentStatus = order.rawStatus || 'pending';
    const currentIndex = statusOrder.indexOf(currentStatus);

    return allSteps.map((step, index) => {
      const stepIndex = statusOrder.indexOf(step.status);
      return {
        ...step,
        completed: stepIndex < currentIndex || (step.label === 'Payment Confirmed' && order.paymentStatus === 'paid') || currentStatus === 'delivered',
        active: stepIndex === currentIndex && (step.label !== 'Payment Confirmed' || order.paymentStatus !== 'paid'),
      };
    });
  };

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
                dbId: order._id,
                name: names,
                quantity: quantity,
                cost: `$${order.total.toFixed(2)}`,
                date: order.createdAt ? order.createdAt.slice(0, 10) : 'N/A',
                status,
                rawStatus: order.status || 'pending',
                paymentStatus: order.paymentStatus || 'pending',
                allowedPaymentMethod: order.allowedPaymentMethod || 'none',
                customizations,
                subtotal: order.subtotal || 0,
                tax: order.tax || 0,
                shipping: order.shipping || 0,
                total: order.total || 0,
                deliveryNotes: order.delivery?.notes || '',
                pickupAddress: order.delivery?.pickupAddress || ''
              };

            });
            setOrders(mappedOrders);

            // Auto-expand selected order passed from dashboard router state
            const targetId = location.state?.selectedOrderId;
            if (targetId) {
              const matched = mappedOrders.find((o: any) => o.id === targetId || o.dbId === targetId);
              if (matched) {
                setExpandedOrderId(matched.id);
              }
            }
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
  }, [location.state?.selectedOrderId]);

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
                            <span>•</span>
                            <span className={`font-semibold ${order.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500 animate-pulse'}`}>
                              {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                            </span>
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
                    {expandedOrderId === order.id && (
                      <div 
                        className="mt-4 pt-4 border-t border-dashed border-border text-xs space-y-4 animate-in fade-in slide-in-from-top-1 duration-200" 
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Pay Now Section */}
                        {order.paymentStatus === 'pending' && (
                          order.allowedPaymentMethod === 'none' ? (
                            <div className="p-3 bg-amber-500/5 rounded-lg border border-amber-500/10 space-y-1">
                              <p className="text-[11px] font-bold text-amber-600 flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-amber-500" /> Payment Selection Pending
                              </p>
                              <p className="text-[10px] text-muted-foreground">The Administrator has not yet assigned a payment method for your order. Once the Administrator configures your payment options, you will be able to complete payment here.</p>
                            </div>
                          ) : (
                            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 space-y-2">
                              <p className="text-[11px] font-bold text-foreground">Complete Payment</p>
                              <div className="p-2.5 bg-background rounded-md border border-border space-y-1">
                                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Assigned Payment Method</p>
                                <p className="text-xs font-semibold text-foreground">
                                  {order.allowedPaymentMethod === 'paypal' && 'PayPal Sandbox'}
                                  {order.allowedPaymentMethod === 'credit_card' && 'Credit Card'}
                                  {order.allowedPaymentMethod === 'cod' && 'Cash on Delivery (COD)'}
                                  {order.allowedPaymentMethod === 'bank_transfer' && 'Bank Transfer'}
                                </p>
                              </div>

                              {payingOrderId === order.dbId ? (
                                <div className="space-y-2 pt-1">
                                  {order.allowedPaymentMethod === 'credit_card' && (
                                    <div className="p-2 bg-muted/40 rounded border border-border space-y-2">
                                      <div className="space-y-1">
                                        <Label className="text-[9px]">Name on Card</Label>
                                        <input className="w-full rounded border border-input bg-background px-2.5 py-1 text-xs focus:outline-none" placeholder="John Doe" />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-[9px]">Card Number</Label>
                                        <input className="w-full rounded border border-input bg-background px-2.5 py-1 text-xs focus:outline-none" placeholder="1234 5678 1234 5678" />
                                      </div>
                                    </div>
                                  )}
                                  
                                  {payError && <p className="text-[9px] text-destructive">{payError}</p>}
                                  
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      className="w-1/2 text-[10px] py-1 h-7"
                                      onClick={() => setPayingOrderId(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      className="w-1/2 text-[10px] py-1 h-7 bg-primary text-white font-bold"
                                      disabled={paying}
                                      onClick={() => handlePayNow(order.dbId, order.allowedPaymentMethod)}
                                    >
                                      {paying ? 'Processing...' : 'Confirm & Pay'}
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <Button 
                                  className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-1.5 text-[10px]"
                                  onClick={() => {
                                    setPayingOrderId(order.dbId);
                                  }}
                                >
                                  Pay Now
                                </Button>
                              )}
                            </div>
                          )
                        )}

                        {/* Order Timeline Section & Print Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 bg-muted/40 rounded-xl border border-border/50">
                          <div className="md:col-span-7 space-y-4">
                            <h5 className="font-bold text-primary text-[10px] uppercase tracking-wider">
                              Order Delivery & Production Timeline
                            </h5>
                            <div className="relative pl-2">
                              {getTimelineSteps(order).map((step, index, array) => (
                                <div key={index} className="relative pb-6 last:pb-0">
                                  {index < array.length - 1 && (
                                    <div 
                                      className={`absolute left-3 top-6 w-0.5 h-full -ml-px ${
                                        step.completed ? 'bg-emerald-500' : 'bg-border'
                                      }`}
                                    />
                                  )}
                                  <div className="relative flex items-start gap-4">
                                    <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                                      step.completed 
                                        ? 'bg-emerald-500 border-emerald-500' 
                                        : step.active 
                                        ? 'bg-primary border-primary animate-pulse' 
                                        : 'bg-background border-border'
                                    }`}>
                                      {step.completed ? (
                                        <CheckCircle className="h-3 w-3 text-white" />
                                      ) : step.active ? (
                                        <Clock className="h-3 w-3 text-white" />
                                      ) : (
                                        <div className="h-1.5 w-1.5 rounded-full bg-border" />
                                      )}
                                    </div>
                                    <div className="flex-1 pt-0.5">
                                      <p className={`text-xs font-semibold ${
                                        step.completed || step.active ? 'text-foreground' : 'text-muted-foreground'
                                      }`}>
                                        {step.label}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground mt-0.5">{step.date}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-6 flex flex-col items-center justify-start text-left">
                            <h5 className="font-bold text-primary text-[10px] uppercase tracking-wider mb-4 self-start">
                              Print Preview
                            </h5>
                            {renderDesignPreview(order.customizations?.[0], order.name)}
                          </div>
                        </div>


                        {order.customizations && order.customizations.length > 0 && order.customizations.map((customization: any, idx: number) => {
                          if (!customization) return null;
                          return (
                            <div key={idx} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h5 className="font-bold text-primary text-[10px] uppercase tracking-wider">
                                  Item #{idx + 1} Custom Specifications
                                </h5>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-muted/20 p-3 rounded-lg border border-border/40">
                                {Object.entries(customization).map(([key, val]) => {
                                  if (val === null || val === undefined || val === '' || typeof val === 'object') return null;
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

                        {/* Delivery Location & Notes (Kothai) */}
                        <div className="space-y-3">
                          {order.pickupAddress && (
                            <div className="space-y-1 text-left">
                              <h5 className="font-bold text-amber-600 text-[10px] uppercase tracking-wider">
                                Assigned Pickup Address (Super Admin)
                              </h5>
                              <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg text-xs font-semibold leading-relaxed font-sans">
                                <p className="text-slate-900">{order.pickupAddress}</p>
                                <p className="text-[10px] text-muted-foreground font-normal mt-1">Please pick up your order items from this location.</p>
                              </div>
                            </div>
                          )}
                          <div className="space-y-2">
                            <h5 className="font-bold text-primary text-[10px] uppercase tracking-wider">
                              Delivery Notes & Location (Kothai)
                            </h5>
                            <div className="p-3 bg-muted/40 border border-border rounded-lg text-xs leading-relaxed whitespace-pre-wrap font-sans text-left">
                              {order.deliveryNotes || 'No shipping or pickup details specified.'}
                            </div>
                          </div>
                        </div>


                        {/* Invoice Breakdown */}
                        <div className="space-y-2">
                          <h5 className="font-bold text-primary text-[10px] uppercase tracking-wider">
                            Order Invoice Breakdown
                          </h5>
                          <div className="p-3 bg-muted/20 border border-border rounded-lg text-xs space-y-1.5 w-full max-w-md text-left">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-[10px]">Subtotal</span>
                              <span className="font-medium text-foreground">${order.subtotal?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-[10px]">Tax</span>
                              <span className="font-medium text-foreground">${order.tax?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground text-[10px]">Shipping</span>
                              <span className="font-medium text-foreground">${order.shipping?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-xs border-t border-border/60 pt-1.5 mt-1 text-primary">
                              <span>Grand Total</span>
                              <span>${order.total?.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
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
