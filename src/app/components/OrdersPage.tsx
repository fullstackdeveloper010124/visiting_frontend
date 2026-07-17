import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Input } from './ui/input';

import { Package, Clock, CheckCircle, Truck, MapPin } from 'lucide-react';
import { StatusBadge, OrderStatus } from './StatusBadge';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface Order {
  id: string;
  dbId: string;
  product: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  allowedPaymentMethod: 'none' | 'paypal' | 'credit_card' | 'cod' | 'bank_transfer';
  date: string;
  estimatedDelivery: string;
  deliveryNotes: string;
  pickupAddress?: string;
  customizations?: any[];
}




interface TimelineStep {
  label: string;
  date: string;
  completed: boolean;
  active: boolean;
}

interface OrdersPageProps {
  onMenuClick?: () => void;
  userRole?: string;
}

export function OrdersPage({ onMenuClick, userRole }: OrdersPageProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const location = useLocation();

  // Dynamic user's orders state with mock fallback defaults
  const [orders, setOrders] = useState<Order[]>([
    { 
      id: 'ORD-2026-001', 
      dbId: 'mock1',
      product: 'Premium Business Cards', 
      quantity: 500, 
      total: 149.99, 
      status: 'delivered', 
      paymentStatus: 'paid',
      allowedPaymentMethod: 'paypal',
      date: '2026-06-01',
      estimatedDelivery: '2026-06-08',
      deliveryNotes: '',
      customizations: []
    },
    { 
      id: 'ORD-2026-002', 
      dbId: 'mock2',
      product: 'Corporate Letterheads', 
      quantity: 1000, 
      total: 299.99, 
      status: 'printing', 
      paymentStatus: 'paid',
      allowedPaymentMethod: 'credit_card',
      date: '2026-06-02',
      estimatedDelivery: '2026-06-09',
      deliveryNotes: '',
      customizations: []
    },
    { 
      id: 'ORD-2026-003', 
      dbId: 'mock3',
      product: 'Envelopes (Standard)', 
      quantity: 500, 
      total: 89.99, 
      status: 'processing', 
      paymentStatus: 'pending',
      allowedPaymentMethod: 'none',
      date: '2026-05-28',
      estimatedDelivery: '2026-06-04',
      deliveryNotes: '',
      customizations: []
    },

  ]);

  const selectedOrderData = orders.find(o => o.id === selectedOrder);

  const [globalConfig, setGlobalConfig] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paypal');
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // Fetch customize config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/v1/customize-config');
        const resData = await response.json();
        if (response.ok && resData.success) {
          setGlobalConfig(resData.data);
        }
      } catch (err) {
        console.error('Failed to load customize config:', err);
      }
    };
    fetchConfig();
  }, []);

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

  const [adminSetPaymentMethod, setAdminSetPaymentMethod] = useState('none');
  const [savingPaymentOption, setSavingPaymentOption] = useState(false);
  const [adminSaveSuccess, setAdminSaveSuccess] = useState(false);
  const [adminSaveError, setAdminSaveError] = useState<string | null>(null);

  // States for Admin status update control
  const [adminOrderStatus, setAdminOrderStatus] = useState('pending');
  const [adminPaymentStatus, setAdminPaymentStatus] = useState('pending');
  const [adminNotes, setAdminNotes] = useState('');
  const [adminPickupAddress, setAdminPickupAddress] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);

  // States for Pickup Locations Management
  const [pickupLocations, setPickupLocations] = useState<any[]>([]);
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationAddress, setNewLocationAddress] = useState('');
  const [newLocationPhone, setNewLocationPhone] = useState('');
  const [addingLocation, setAddingLocation] = useState(false);

  useEffect(() => {
    if (selectedOrderData) {
      setAdminSetPaymentMethod(selectedOrderData.allowedPaymentMethod || 'none');
      setAdminOrderStatus(selectedOrderData.status || 'pending');
      setAdminPaymentStatus(selectedOrderData.paymentStatus || 'pending');
      setAdminNotes(selectedOrderData.deliveryNotes || '');
      setAdminPickupAddress(selectedOrderData.pickupAddress || '');
      setAdminSaveSuccess(false);
      setAdminSaveError(null);
      setStatusUpdateSuccess(false);
      setStatusUpdateError(null);
    }
  }, [selectedOrder, selectedOrderData]);



  const handleSavePaymentOption = async () => {
    if (!selectedOrderData) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    setSavingPaymentOption(true);
    setAdminSaveSuccess(false);
    setAdminSaveError(null);

    try {
      const response = await fetch(`/api/v1/orders/${selectedOrderData.dbId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          allowedPaymentMethod: adminSetPaymentMethod
        })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        setAdminSaveSuccess(true);
        setOrders(prev => prev.map(o => o.dbId === selectedOrderData.dbId ? { ...o, allowedPaymentMethod: adminSetPaymentMethod as Order['allowedPaymentMethod'] } : o));
      } else {
        setAdminSaveError(resData.error || 'Failed to save payment option.');
      }
    } catch (err) {
      console.error('Save error:', err);
      setAdminSaveError('Network error. Failed to save.');
    } finally {
      setSavingPaymentOption(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrderData) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    setUpdatingStatus(true);
    setStatusUpdateSuccess(false);
    setStatusUpdateError(null);

    try {
      const response = await fetch(`/api/v1/orders/${selectedOrderData.dbId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: adminOrderStatus,
          paymentStatus: adminPaymentStatus,
          notes: adminNotes,
          pickupAddress: adminPickupAddress
        })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        setStatusUpdateSuccess(true);
        setOrders(prev => prev.map(o => o.dbId === selectedOrderData.dbId ? { 
          ...o, 
          status: adminOrderStatus as OrderStatus, 
          paymentStatus: adminPaymentStatus as 'pending' | 'paid' | 'refunded',
          deliveryNotes: adminNotes,
          pickupAddress: adminPickupAddress
        } : o));
      } else {
        setStatusUpdateError(resData.error || 'Failed to update status.');
      }
    } catch (err) {
      console.error('Update status error:', err);
      setStatusUpdateError('Network error. Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Fetch Pickup Locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('/api/v1/pickup-locations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          setPickupLocations(resData.data);
        }
      } catch (err) {
        console.error('Failed to load pickup locations:', err);
      }
    };
    fetchLocations();
  }, []);

  const handleAddPickupLocation = async () => {
    if (!newLocationName.trim() || !newLocationAddress.trim()) {
      alert('Name and Address are required.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    setAddingLocation(true);
    try {
      const response = await fetch('/api/v1/pickup-locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newLocationName,
          address: newLocationAddress,
          phone: newLocationPhone
        })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        setPickupLocations(prev => [...prev, resData.data]);
        const fullAddress = `${resData.data.name} - ${resData.data.address}${resData.data.phone ? ` (Phone: ${resData.data.phone})` : ''}`;
        setAdminPickupAddress(fullAddress);
        setNewLocationName('');
        setNewLocationAddress('');
        setNewLocationPhone('');
        alert('Pickup location added and selected successfully!');
      } else {
        alert(resData.error || 'Failed to add pickup location.');
      }
    } catch (err) {
      console.error('Error adding pickup location:', err);
      alert('Network error. Failed to add.');
    } finally {
      setAddingLocation(false);
    }
  };

  // Fetch live order list from API
  useEffect(() => {
    const fetchOrders = async () => {
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

              const quantitySum = order.items && order.items.length > 0
                ? order.items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
                : 1;

              // Estimated delivery is order date + 7 days
              const createdDate = order.createdAt ? new Date(order.createdAt) : new Date();
              const estDelivery = new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000);

              let status: OrderStatus = 'pending';
              if (order.status === 'delivered') status = 'delivered';
              else if (order.status === 'shipped') status = 'shipped';
              else if (order.status === 'printing') status = 'printing';
              else if (order.status === 'ready' || order.status === 'processing') status = 'processing';

              // Gather customizations
              const customizations = order.items && order.items.length > 0
                ? order.items.map((item: any) => item.customization || null).filter(Boolean)
                : [];

              return {
                id: order.orderNumber || order._id,
                dbId: order._id,
                product: names,
                quantity: quantitySum,
                total: order.total,
                status,
                paymentStatus: order.paymentStatus || 'pending',
                allowedPaymentMethod: order.allowedPaymentMethod || 'none',
                date: order.createdAt ? order.createdAt.slice(0, 10) : 'N/A',
                estimatedDelivery: estDelivery.toISOString().slice(0, 10),
                deliveryNotes: order.delivery?.notes || '',
                pickupAddress: order.delivery?.pickupAddress || '',
                customizations
              };

            });

            setOrders(mappedOrders);

            // Auto-select order passed from dashboard router state
            const targetId = location.state?.selectedOrderId;
            if (targetId) {
              const matched = mappedOrders.find((o: Order) => o.id === targetId);
              if (matched) {
                setSelectedOrder(targetId);
              } else {
                setSelectedOrder(mappedOrders[0].id);
              }
            } else {
              setSelectedOrder(mappedOrders[0].id);
            }
          } else {
            // Set orders to empty if user actually has no orders yet in the DB
            setOrders([]);
          }
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, [location.state?.selectedOrderId]);

  const getTimelineSteps = (order: Order): TimelineStep[] => {
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
    const currentIndex = statusOrder.indexOf(order.status);

    return allSteps.map((step, index) => {
      const stepIndex = statusOrder.indexOf(step.status as OrderStatus);
      return {
        ...step,
        completed: stepIndex < currentIndex || (step.label === 'Payment Confirmed' && order.status !== 'pending') || order.status === 'delivered',
        active: stepIndex === currentIndex && (step.label !== 'Payment Confirmed' || order.status === 'pending'),
      };
    });
  };

  const renderDesignPreview = (customization: any, productName: string) => {
    if (!customization) {
      return (
        <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-lg p-6 bg-muted/20 text-muted-foreground w-full max-w-[220px] mx-auto text-center">
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
        <div className="space-y-3 w-full max-w-[240px] mx-auto">
          {customization.uploadedFront && (
            <div className="space-y-1 text-left">
              <span className="text-[8px] font-bold text-muted-foreground uppercase">Front Side</span>
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
            <div className="space-y-1 text-left">
              <span className="text-[8px] font-bold text-muted-foreground uppercase">Back Side</span>
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
        <div className="w-full max-w-[160px] mx-auto space-y-1 text-left">
          <span className="text-[8px] font-bold text-muted-foreground uppercase">Letterhead Design</span>
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
        <div className="w-full max-w-[160px] mx-auto space-y-1 text-left">
          <span className="text-[8px] font-bold text-muted-foreground uppercase">Notepad Design</span>
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
        <div className="w-full max-w-[160px] mx-auto space-y-1 text-left">
          <span className="text-[8px] font-bold text-muted-foreground uppercase">Presentation Folder</span>
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
        <div className="w-full max-w-[200px] mx-auto space-y-1 text-left">
          <span className="text-[8px] font-bold text-muted-foreground uppercase">Compliment Slip</span>
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
        <div className="space-y-3 w-full max-w-[200px] mx-auto">
          {/* Front Side */}
          <div className="space-y-1 text-left">
            <span className="text-[8px] font-bold text-muted-foreground uppercase">Front Side</span>
            <div 
              className="w-full aspect-[3.5/2] rounded border border-border shadow-sm relative overflow-hidden text-left"
              style={{
                backgroundColor: customization.secondaryColor || '#ffffff',
                fontFamily: getFontFamily(customization.fontFamily),
                color: customization.textColor || '#1e293b',
              }}
            >
              <div className="absolute top-0 right-0 p-1 text-right flex flex-col items-end scale-[0.6] origin-top-right">
                <span className="text-[8px] font-bold tracking-wider uppercase opacity-75">{customization.companyName}</span>
                <span className="text-[6px] tracking-wider opacity-60 italic">{customization.tagline}</span>
              </div>
              <div className="absolute bottom-0 left-0 p-1 space-y-0.5 max-w-[70%] scale-[0.6] origin-bottom-left leading-tight">
                <h3 className="text-xs font-bold">{customization.personName}</h3>
                <p className="text-[7px] font-medium tracking-wide opacity-85">{customization.jobTitle}</p>
                <div className="pt-0.5 text-[5px] space-y-0.2 opacity-85 leading-normal">
                  {customization.phone && <div>📞 {customization.phone}</div>}
                  {customization.email && <div>✉️ {customization.email}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="space-y-1 text-left">
            <span className="text-[8px] font-bold text-muted-foreground uppercase">Back Side</span>
            <div 
              className="w-full aspect-[3.5/2] rounded border border-border shadow-sm relative overflow-hidden flex flex-col items-center justify-center p-2"
              style={{
                backgroundColor: customization.primaryColor || '#10b981',
                fontFamily: getFontFamily(customization.fontFamily),
              }}
            >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none"></div>
              <div className="text-center scale-[0.6] origin-center bg-black/10 backdrop-blur-sm p-1.5 rounded border border-white/10 w-fit">
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
      <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-lg p-6 bg-muted/20 text-muted-foreground w-full max-w-[200px] mx-auto text-center">
        <Package className="h-8 w-8 mb-2 opacity-40 text-primary" />
        <p className="text-xs font-semibold text-foreground">Custom Ordered Product</p>
        <p className="text-[10px]">{productName}</p>
      </div>
    );
  };

  return (

    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader onMenuClick={onMenuClick} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
            <p className="text-muted-foreground">Track and manage your printing orders</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Orders List */}
            <div className="space-y-4">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>All Orders</CardTitle>
                  <CardDescription>Click on an order to view details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedOrder === order.id
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:bg-accent/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm">{order.id}</p>
                            <p className="text-xs text-muted-foreground">{order.date}</p>
                          </div>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-foreground font-medium">{order.product}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">Qty: {order.quantity} units</p>
                          <p className="font-semibold text-foreground">${order.total}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Details & Timeline */}
            <div className="space-y-4">
              {selectedOrderData ? (
                <>
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Order Details</CardTitle>
                      <CardDescription>{selectedOrderData.id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Product</p>
                          <p className="font-medium text-foreground text-sm">{selectedOrderData.product}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                          <p className="font-medium text-foreground text-sm">{selectedOrderData.quantity} units</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Order Date</p>
                          <p className="font-medium text-foreground text-sm">{selectedOrderData.date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                          <p className="font-medium text-foreground text-sm">${selectedOrderData.total}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Payment Status</p>
                          <Badge className={selectedOrderData.paymentStatus === 'paid' ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'}>
                            {selectedOrderData.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                          </Badge>
                        </div>
                        {/* Admin Payment Option Assignment Selector */}
                        {userRole && ['super_user', 'accounting', 'order_processor'].includes(userRole) && selectedOrderData.paymentStatus === 'pending' && (
                          <div className="col-span-2 mt-2 p-3 bg-primary/5 rounded-lg border border-primary/20 space-y-2">
                            <Label className="text-[10px] font-bold text-foreground">Set Allowed Payment Method for User</Label>
                            <div className="flex gap-2">
                              <select 
                                value={adminSetPaymentMethod} 
                                onChange={e => setAdminSetPaymentMethod(e.target.value)}
                                className="flex-1 rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              >
                                <option value="none">Pending Admin Assignment (None)</option>
                                <option value="paypal">PayPal</option>
                                <option value="credit_card">Stripe / Credit Card</option>
                                <option value="cod">Cash on Delivery (COD)</option>
                                <option value="bank_transfer">Bank Transfer</option>
                              </select>
                              <Button 
                                className="bg-primary text-white text-[10px] px-3 font-semibold h-7.5 py-1"
                                onClick={handleSavePaymentOption}
                                disabled={savingPaymentOption}
                              >
                                {savingPaymentOption ? 'Saving...' : 'Save'}
                              </Button>
                            </div>
                            {adminSaveSuccess && <p className="text-[10px] text-emerald-600 font-medium">Payment option updated successfully!</p>}
                            {adminSaveError && <p className="text-[10px] text-destructive">{adminSaveError}</p>}
                          </div>
                        )}
                      </div>

                      {/* Admin Order Status & Payment Status Control */}
                      {userRole && ['super_user', 'order_processor', 'accounting'].includes(userRole) && (
                        <div className="mt-4 p-4 bg-muted/60 border border-border rounded-xl space-y-4 text-left">
                          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Admin Status Controller</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Order Status Select */}
                            <div className="space-y-1">
                              <Label className="text-[10px] font-bold text-muted-foreground uppercase">Order Production Status</Label>
                              <select 
                                value={adminOrderStatus} 
                                onChange={e => setAdminOrderStatus(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">In Production (Processing)</option>
                                <option value="printing">Printing</option>
                                <option value="ready">Ready to Ship</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                              </select>
                            </div>

                            {/* Payment Status Select */}
                            <div className="space-y-1">
                              <Label className="text-[10px] font-bold text-muted-foreground uppercase">Payment Status</Label>
                              <select 
                                value={adminPaymentStatus} 
                                onChange={e => setAdminPaymentStatus(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              >
                                <option value="pending">Pending / Unpaid</option>
                                <option value="paid">Paid</option>
                              </select>
                            </div>
                          </div>

                          {/* Delivery Notes / Shipping Address */}
                          <div className="space-y-1 mt-3">
                            <Label className="text-[10px] font-bold text-muted-foreground uppercase">Delivery Notes / Shipping Address</Label>
                            <textarea 
                              value={adminNotes} 
                              onChange={e => setAdminNotes(e.target.value)}
                              rows={5}
                              className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans whitespace-pre-wrap"
                              placeholder="Enter shipping address or delivery instructions..."
                            />
                          </div>

                          {/* Pickup Address Select & Management */}
                          <div className="space-y-2 mt-4 pt-3 border-t border-border/50">
                            <div className="space-y-1">
                              <Label className="text-[10px] font-bold text-muted-foreground uppercase">Assign Pickup Location Address</Label>
                              <select 
                                value={adminPickupAddress} 
                                onChange={e => setAdminPickupAddress(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              >
                                <option value="">-- No Pickup Location Assigned --</option>
                                {pickupLocations.map((loc) => {
                                  const fullAddress = `${loc.name} - ${loc.address}${loc.phone ? ` (Phone: ${loc.phone})` : ''}`;
                                  return (
                                    <option key={loc._id} value={fullAddress}>
                                      {loc.name} ({loc.address.substring(0, 20)}...)
                                    </option>
                                  );
                                })}
                              </select>
                            </div>

                            {/* Add New Pickup Location Option */}
                            <div className="p-3 bg-muted/40 rounded-lg border border-border/50 space-y-2 mt-2">
                              <p className="text-[10px] font-bold text-foreground uppercase">Add New Pickup Location</p>
                              <div className="grid grid-cols-1 gap-2">
                                <Input 
                                  placeholder="Location Name (e.g. Manhattan Hub)" 
                                  value={newLocationName} 
                                  onChange={(e: any) => setNewLocationName(e.target.value)}
                                  className="text-xs h-8 bg-background"
                                />
                                <Input 
                                  placeholder="Full Street Address" 
                                  value={newLocationAddress} 
                                  onChange={(e: any) => setNewLocationAddress(e.target.value)}
                                  className="text-xs h-8 bg-background"
                                />
                                <div className="flex gap-2">
                                  <Input 
                                    placeholder="Phone (Optional)" 
                                    value={newLocationPhone} 
                                    onChange={(e: any) => setNewLocationPhone(e.target.value)}
                                    className="text-xs h-8 bg-background flex-1"
                                  />
                                  <Button 
                                    onClick={handleAddPickupLocation}

                                    disabled={addingLocation}
                                    type="button"
                                    className="bg-secondary hover:bg-secondary/90 text-[10px] h-8 px-3 text-foreground font-semibold"
                                  >
                                    {addingLocation ? 'Adding...' : 'Add'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Button 
                            className="bg-primary hover:bg-primary/90 text-white text-xs px-4 py-2 font-semibold h-9 mt-2"
                            onClick={handleUpdateStatus}
                            disabled={updatingStatus}
                          >
                            {updatingStatus ? 'Updating...' : 'Update Status & Address'}
                          </Button>


                          {statusUpdateSuccess && <p className="text-[10px] text-emerald-600 font-medium mt-1">Order status updated successfully!</p>}
                          {statusUpdateError && <p className="text-[10px] text-destructive mt-1">{statusUpdateError}</p>}
                        </div>
                      )}

                      {/* Pay Now Section */}
                      {selectedOrderData.paymentStatus === 'pending' && (
                        selectedOrderData.allowedPaymentMethod === 'none' ? (
                          <div className="mt-4 pt-4 border-t border-border space-y-2 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10">
                            <p className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-amber-500" /> Payment Selection Pending
                            </p>
                            <p className="text-[11px] text-muted-foreground">The Administrator has not yet assigned a payment method for your order. Once the Administrator configures your payment options, you will be able to complete payment here.</p>
                          </div>
                        ) : (
                          <div className="mt-4 pt-4 border-t border-border space-y-3 p-3 bg-primary/5 rounded-lg border border-primary/20 animate-in fade-in duration-200">
                            <p className="text-xs font-bold text-foreground">Complete Payment Now</p>
                            <div className="p-2.5 bg-background rounded-md border border-border space-y-1.5">
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Assigned Payment Method</p>
                              <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                                {selectedOrderData.allowedPaymentMethod === 'paypal' && 'PayPal Sandbox'}
                                {selectedOrderData.allowedPaymentMethod === 'credit_card' && 'Credit Card'}
                                {selectedOrderData.allowedPaymentMethod === 'cod' && 'Cash on Delivery (COD)'}
                                {selectedOrderData.allowedPaymentMethod === 'bank_transfer' && 'Bank Transfer'}
                              </p>
                              <p className="text-[10px] text-muted-foreground leading-normal">
                                {selectedOrderData.allowedPaymentMethod === 'paypal' && 'Simulated express checkout sandbox payment.'}
                                {selectedOrderData.allowedPaymentMethod === 'credit_card' && 'Secure instant credit card approval.'}
                                {selectedOrderData.allowedPaymentMethod === 'cod' && 'You will pay in cash upon receiving the order.'}
                                {selectedOrderData.allowedPaymentMethod === 'bank_transfer' && 'Wire transfer details will be shown.'}
                              </p>
                            </div>

                            {payingOrderId === selectedOrderData.dbId ? (
                              <div className="space-y-2">
                                {selectedOrderData.allowedPaymentMethod === 'credit_card' && (
                                  <div className="p-2 bg-muted/40 rounded border border-border space-y-2 mb-2">
                                    <div className="space-y-1">
                                      <Label className="text-[10px]">Name on Card</Label>
                                      <input className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs focus:outline-none" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-[10px]">Card Number</Label>
                                      <input className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs focus:outline-none" placeholder="1234 5678 1234 5678" />
                                    </div>
                                  </div>
                                )}
                                
                                {payError && <p className="text-[10px] text-destructive">{payError}</p>}
                                
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    className="w-1/2 text-[10px] py-1.5 h-auto"
                                    onClick={() => setPayingOrderId(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    className="w-1/2 text-[10px] py-1.5 h-auto bg-primary text-white font-bold"
                                    disabled={paying}
                                    onClick={() => handlePayNow(selectedOrderData.dbId, selectedOrderData.allowedPaymentMethod)}
                                  >
                                    {paying ? 'Processing...' : 'Confirm & Pay'}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button 
                                className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-2 text-xs"
                                onClick={() => {
                                  setPayingOrderId(selectedOrderData.dbId);
                                }}
                              >
                                Pay Now
                              </Button>
                            )}
                          </div>
                        )
                      )}

                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-medium text-foreground">Estimated Delivery</p>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">{selectedOrderData.estimatedDelivery}</p>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-medium text-foreground">Delivery / Pickup Details</p>
                        </div>
                        <pre className="text-sm text-muted-foreground ml-6 font-sans whitespace-pre-wrap">
                          {selectedOrderData.deliveryNotes || 'No delivery details provided.'}
                        </pre>
                      </div>

                      {selectedOrderData.pickupAddress && (
                        <div className="pt-4 border-t border-border">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-amber-500" />
                            <p className="text-sm font-semibold text-amber-600">Assigned Pickup Location</p>
                          </div>
                          <p className="text-sm text-slate-800 ml-6 font-medium font-sans whitespace-pre-wrap bg-amber-500/5 p-3 rounded-lg border border-amber-500/20">
                            {selectedOrderData.pickupAddress}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Order Timeline & Print Preview</CardTitle>
                      <CardDescription>Track your order progress and review design proof</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-muted/10 p-3 rounded-xl border border-border/50">
                        {/* Timeline */}
                        <div className="md:col-span-7 space-y-4">
                          <div className="relative">
                            {getTimelineSteps(selectedOrderData).map((step, index, array) => (
                              <div key={index} className="relative pb-8 last:pb-0">
                                {index < array.length - 1 && (
                                  <div 
                                    className={`absolute left-4 top-8 w-0.5 h-full -ml-px ${
                                      step.completed ? 'bg-success' : 'bg-border'
                                    }`}
                                  />
                                )}
                                <div className="relative flex items-start gap-4">
                                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                                    step.completed 
                                      ? 'bg-success border-success' 
                                      : step.active 
                                      ? 'bg-primary border-primary' 
                                      : 'bg-background border-border'
                                  }`}>
                                    {step.completed ? (
                                      <CheckCircle className="h-4 w-4 text-white" />
                                    ) : step.active ? (
                                      <Clock className="h-4 w-4 text-white" />
                                    ) : (
                                      <div className="h-2 w-2 rounded-full bg-border" />
                                    )}
                                  </div>
                                  <div className="flex-1 pt-0.5">
                                    <p className={`text-sm font-medium ${
                                      step.completed || step.active ? 'text-foreground' : 'text-muted-foreground'
                                    }`}>
                                      {step.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{step.date}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Print Preview */}
                        <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-6 flex flex-col items-center justify-start text-left">
                          <h5 className="font-bold text-primary text-[10px] uppercase tracking-wider mb-4 self-start">
                            Design Print Preview
                          </h5>
                          {renderDesignPreview(selectedOrderData.customizations?.[0], selectedOrderData.product)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                </>
              ) : (
                <Card className="shadow-sm">
                  <CardContent className="py-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg text-foreground mb-2">Select an Order</h3>
                    <p className="text-sm text-muted-foreground">
                      Click on an order to view details and tracking information
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}