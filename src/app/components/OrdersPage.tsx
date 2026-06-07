import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Package, Clock, CheckCircle, Truck, MapPin } from 'lucide-react';
import { StatusBadge, OrderStatus } from './StatusBadge';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface Order {
  id: string;
  product: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  date: string;
  estimatedDelivery: string;
}

interface TimelineStep {
  label: string;
  date: string;
  completed: boolean;
  active: boolean;
}

interface OrdersPageProps {
  onMenuClick?: () => void;
}

export function OrdersPage({ onMenuClick }: OrdersPageProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const location = useLocation();

  // Dynamic user's orders state with mock fallback defaults
  const [orders, setOrders] = useState<Order[]>([
    { 
      id: 'ORD-2026-001', 
      product: 'Premium Business Cards', 
      quantity: 500, 
      total: 149.99, 
      status: 'delivered', 
      date: '2026-06-01',
      estimatedDelivery: '2026-06-08'
    },
    { 
      id: 'ORD-2026-002', 
      product: 'Corporate Letterheads', 
      quantity: 1000, 
      total: 299.99, 
      status: 'printing', 
      date: '2026-06-02',
      estimatedDelivery: '2026-06-09'
    },
    { 
      id: 'ORD-2026-003', 
      product: 'Envelopes (Standard)', 
      quantity: 500, 
      total: 89.99, 
      status: 'processing', 
      date: '2026-05-28',
      estimatedDelivery: '2026-06-04'
    },
  ]);

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

              return {
                id: order.orderNumber || order._id,
                product: names,
                quantity: quantitySum,
                total: order.total,
                status,
                date: order.createdAt ? order.createdAt.slice(0, 10) : 'N/A',
                estimatedDelivery: estDelivery.toISOString().slice(0, 10)
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

  const selectedOrderData = orders.find(o => o.id === selectedOrder);

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
                      </div>

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
                          <p className="text-sm font-medium text-foreground">Delivery Address</p>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">
                          123 Business Street<br />
                          Suite 456<br />
                          New York, NY 10001
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Order Timeline</CardTitle>
                      <CardDescription>Track your order progress</CardDescription>
                    </CardHeader>
                    <CardContent>
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