import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  CheckCircle, Globe, MapPin, Smartphone, Mail, Linkedin, Instagram, 
  Facebook, Twitter, Video, Image as ImageIcon, ArrowLeft, Loader2, AlertCircle,
  ShoppingCart, CreditCard
} from 'lucide-react';

export function ApproveCardDesignPage() {
  const { approvalId } = useParams<{ approvalId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [design, setDesign] = useState<any>(null);

  // Products state for matching product SKU and ID
  const [products, setProducts] = useState<any[]>([]);
  const [matchedProduct, setMatchedProduct] = useState<any>(null);

  // Shipping Form State
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress1, setShippingAddress1] = useState('');
  const [shippingAddress2, setShippingAddress2] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingCountry, setShippingCountry] = useState('United States');

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Paypal Simulation State
  const [paypalModalOpen, setPaypalModalOpen] = useState(false);
  const [paypalPaying, setPaypalPaying] = useState(false);

  // Computed address validation
  const isAddressComplete = !!(
    shippingName.trim() &&
    shippingPhone.trim() &&
    shippingAddress1.trim() &&
    shippingCity.trim() &&
    shippingState.trim() &&
    shippingZip.trim()
  );

  // Checkout Status States
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<any>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [checkoutStep, setCheckoutStep] = useState(1);

  // Fetch products list on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/v1/products');
        const resData = await response.json();
        if (response.ok && resData.success) {
          setProducts(resData.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch logged-in user profile to prefill shipping contact
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch('/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
          const u = resData.data;
          setShippingName(u.fullName || '');
          setShippingPhone(u.phone || '');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    fetchUserProfile();
  }, []);

  // Match current design to seeded products
  useEffect(() => {
    if (design && products.length > 0) {
      const skuMap: Record<string, string> = {
        business_card: 'BC-PREM',
        letterhead: 'LH-CORP',
        envelope: 'EV-PROF',
        notepad: 'NP-DESG',
        folder: 'FL-PRES',
        slip: 'CS-COMP',
      };
      const expectedSku = skuMap[design.designType] || 'BC-PREM';
      const found = products.find(p => p.sku === expectedSku);
      if (found) {
        setMatchedProduct(found);
      }
    }
  }, [design, products]);

  const getProductInfo = () => {
    if (matchedProduct) return matchedProduct;

    // Fallbacks
    const fallbackProducts: Record<string, any> = {
      business_card: { _id: '6a1e01be1b678c20a8c8e290', name: 'Premium Business Cards', sku: 'BC-PREM' },
      letterhead: { _id: '6a1e01be1b678c20a8c8e291', name: 'Corporate Letterheads', sku: 'LH-CORP' },
      envelope: { _id: '6a1e01be1b678c20a8c8e292', name: 'Custom Envelopes', sku: 'EV-PROF' },
      notepad: { _id: '6a1e01be1b678c20a8c8e293', name: 'Designer Notepads', sku: 'NP-DESG' },
      folder: { _id: '6a1e01be1b678c20a8c8e294', name: 'Presentation Folders', sku: 'FL-PRES' },
      slip: { _id: '6a1e01be1b678c20a8c8e295', name: 'Compliment Slips', sku: 'CS-COMP' },
    };

    return fallbackProducts[design?.designType || 'business_card'];
  };

  const getPricingDetails = () => {
    let quantity = 100;
    let unitPrice = 3.50;
    let subtotal = 350.00;

    const type = design?.designType || 'business_card';
    const details = design?.designDetails || {};

    if (type === 'business_card') {
      if (details.pricingOption) {
        const match = details.pricingOption.match(/(\d+)\s+cards\s+-\s+\$(\d+(\.\d+)?)/);
        if (match) {
          quantity = parseInt(match[1]);
          subtotal = parseFloat(match[2]);
          unitPrice = subtotal / quantity;
        }
      }
    } else if (type === 'letterhead') {
      const reamsVal = parseInt(details.reams);
      quantity = isNaN(reamsVal) ? 50 : reamsVal;
      unitPrice = details.costPerReam ? parseFloat(details.costPerReam) : 250;
      subtotal = quantity * unitPrice;
    } else if (type === 'envelope') {
      const boxesVal = parseInt(details.boxes);
      quantity = isNaN(boxesVal) ? 50 : boxesVal;
      unitPrice = details.costPerBox ? parseFloat(details.costPerBox) : 125;
      subtotal = quantity * unitPrice;
    } else if (type === 'notepad') {
      const padsVal = parseInt(details.pads);
      quantity = isNaN(padsVal) ? 50 : padsVal;
      unitPrice = details.costPerPad ? parseFloat(details.costPerPad) : 225;
      subtotal = quantity * unitPrice;
    } else if (type === 'folder') {
      const boxesVal = parseInt(details.boxes);
      quantity = isNaN(boxesVal) ? 10 : boxesVal;
      unitPrice = details.costPerBox ? parseFloat(details.costPerBox) : 45;
      subtotal = quantity * unitPrice;
    } else if (type === 'slip') {
      const boxesVal = parseInt(details.boxes);
      quantity = isNaN(boxesVal) ? 10 : boxesVal;
      unitPrice = details.costPerBox ? parseFloat(details.costPerBox) : 15;
      subtotal = quantity * unitPrice;
    }

    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const shipping = subtotal > 500 ? 0.00 : 15.00;
    const total = parseFloat((subtotal + tax + shipping).toFixed(2));

    return { quantity, unitPrice, subtotal, tax, shipping, total };
  };

  const placeOrder = async (method: string, payStatus: string) => {
    setCheckingOut(true);
    setCheckoutError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setCheckoutError('You must be logged in to place an order.');
      setCheckingOut(false);
      return;
    }

    const { quantity, unitPrice, subtotal, tax, shipping, total } = getPricingDetails();
    const productInfo = getProductInfo();

    const orderData = {
      items: [
        {
          product: productInfo._id,
          quantity: quantity,
          unitPrice: unitPrice,
          subtotal: subtotal,
          customization: design.designDetails
        }
      ],
      subtotal: subtotal,
      tax: tax,
      shipping: shipping,
      total: total,
      paymentStatus: payStatus,
      delivery: {
        status: 'pending',
        notes: `Shipping Address:
Name: ${shippingName}
Phone: ${shippingPhone}
Address: ${shippingAddress1} ${shippingAddress2 ? `, ${shippingAddress2}` : ''}
City: ${shippingCity}, State: ${shippingState}, Zip: ${shippingZip}
Country: ${shippingCountry}

Payment Method: ${method.toUpperCase()}
${method === 'credit_card' ? `Cardholder: ${cardName}\nCard: **** **** **** ${cardNumber.slice(-4)}` : ''}
${method === 'paypal' ? 'Paid via Simulated PayPal Checkout (Sandbox)' : ''}`
      }
    };

    try {
      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setOrderPlaced(resData.data);
        
        let count = 5;
        const timer = setInterval(() => {
          count -= 1;
          setCountdown(count);
          if (count <= 0) {
            clearInterval(timer);
            navigate('/orders');
          }
        }, 1000);
      } else {
        setCheckoutError(resData.error || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setCheckoutError('Connection error. Failed to place order.');
    } finally {
      setCheckingOut(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'paypal') {
      setPaypalModalOpen(true);
    } else {
      await placeOrder(paymentMethod, paymentMethod === 'credit_card' ? 'paid' : 'pending');
    }
  };

  const handlePaypalSubmit = async () => {
    setPaypalPaying(true);
    setTimeout(async () => {
      setPaypalPaying(false);
      setPaypalModalOpen(false);
      await placeOrder('paypal', 'paid');
    }, 2000);
  };

  useEffect(() => {
    const fetchApprovalDetails = async () => {
      try {
        const response = await fetch(`/api/v1/customize-config/approval/${approvalId}`);
        const resData = await response.json();
        
        if (response.ok && resData.success) {
          setDesign(resData.data);
          if (resData.data.status === 'approved') {
            setApproved(true);
          } else {
            // Automatically approve the design on mount when visited!
            try {
              const approveRes = await fetch(`/api/v1/customize-config/approve/${approvalId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
              });
              const approveData = await approveRes.json();
              if (approveRes.ok && approveData.success) {
                setApproved(true);
              }
            } catch (approveErr) {
              console.error('Auto approval failed:', approveErr);
            }
          }
        } else {
          setError(resData.error || 'Failed to load card design details.');
        }
      } catch (err) {
        console.error('Error fetching approval details:', err);
        setError('Failed to connect to server. Please verify the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    if (approvalId) {
      fetchApprovalDetails();
    }
  }, [approvalId]);

  const handleApprove = async () => {
    setApproving(true);
    setError(null);
    try {
      const response = await fetch(`/api/v1/customize-config/approve/${approvalId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const resData = await response.json();
      
      if (response.ok && resData.success) {
        setApproved(true);
      } else {
        setError(resData.error || 'Failed to approve card design.');
      }
    } catch (err) {
      console.error('Error approving design:', err);
      setError('Connection error. Failed to submit approval.');
    } finally {
      setApproving(false);
    }
  };

  const getFontFamily = (family: string) => {
    switch(family) {
      case 'serif': return 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
      case 'mono': return 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
      default: return 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    }
  };

  const renderSocialIcon = (id: string) => {
    switch(id) {
      case 'linkedin': return <Linkedin className="h-4 w-4 shrink-0" />;
      case 'instagram': return <Instagram className="h-4 w-4 shrink-0" />;
      case 'facebook': return <Facebook className="h-4 w-4 shrink-0" />;
      case 'twitter': return <Twitter className="h-4 w-4 shrink-0" />;
      case 'tiktok': return <Video className="h-4 w-4 shrink-0" />;
      default: return <Globe className="h-4 w-4 shrink-0" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading design details...</p>
        </div>
      </div>
    );
  }

  if (error && !design) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <Card className="w-full max-w-md border-destructive/20 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
              <AlertCircle className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-bold">Error Loading Design</CardTitle>
            <CardDescription className="mt-1 text-sm text-destructive font-medium">{error}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (approved) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground flex flex-col">
        <header className="border-b border-border bg-background px-4 py-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">PrintFlow Checkout</h1>
              <p className="text-xs text-muted-foreground">Secure Order Placement</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
          </Button>
        </header>

        <main className="flex-1 max-w-xl w-full mx-auto p-4 md:p-8">
          <Card className="border border-border shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6 text-emerald-500" /> Design Approved
              </CardTitle>
              <CardDescription>
                Your design has been approved. Please follow the steps below to place your print order.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {orderPlaced ? (
                /* ORDER SUCCESS SCREEN */
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 mb-2">
                    <CheckCircle className="h-8 w-8 text-emerald-500 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Order Confirmed!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your order has been successfully placed.
                  </p>
                  <div className="p-3 bg-muted/50 rounded-lg border border-border text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Number:</span>
                      <span className="font-mono font-bold text-foreground">{orderPlaced.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Paid:</span>
                      <span className="font-bold text-foreground">${orderPlaced.total?.toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground animate-pulse mt-2">
                    Redirecting to dashboard in {countdown} seconds...
                  </p>
                  <Button className="w-full mt-2" onClick={() => navigate('/orders')}>
                    Go to My Orders
                  </Button>
                </div>
              ) : (
                /* CHECKOUT WIZARD FLOW */
                <div className="space-y-6 text-left">
                  {/* Stepper Header */}
                  <div className="flex items-center justify-between border-b pb-4 mb-2">
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${checkoutStep >= 1 ? 'bg-primary text-white font-extrabold' : 'bg-muted text-muted-foreground'}`}>1</div>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Summary</span>
                    </div>
                    <div className={`h-0.5 flex-1 mx-1 ${checkoutStep >= 2 ? 'bg-primary' : 'bg-border'}`}></div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${checkoutStep >= 2 ? 'bg-primary text-white font-extrabold' : 'bg-muted text-muted-foreground'}`}>2</div>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Shipping</span>
                    </div>
                    <div className={`h-0.5 flex-1 mx-1 ${checkoutStep >= 3 ? 'bg-primary' : 'bg-border'}`}></div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${checkoutStep >= 3 ? 'bg-primary text-white font-extrabold' : 'bg-muted text-muted-foreground'}`}>3</div>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Payment</span>
                    </div>
                  </div>

                  {!localStorage.getItem('token') ? (
                    /* USER NOT LOGGED IN WARNING */
                    <Card className="border-warning/30 bg-warning/5 p-4 rounded-xl text-center space-y-4">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-warning/10 text-warning">
                        <AlertCircle className="h-6 w-6" />
                      </div>
                      <h4 className="font-bold text-warning-foreground text-sm">Secure Checkout Required</h4>
                      <p className="text-xs text-muted-foreground">
                        You must be logged in to PrintFlow to submit orders.
                      </p>
                      <Button 
                        onClick={() => navigate(`/login?redirect=/approve-card-design/${approvalId}`)}
                        className="w-full bg-warning hover:bg-warning/90 text-warning-foreground font-semibold"
                      >
                        Login to Complete Checkout
                      </Button>
                    </Card>
                  ) : (
                    /* LOGGED IN WIZARD STEPS */
                    <div className="space-y-6">
                      
                      {checkoutStep === 1 && (
                        /* STEP 1: SUMMARY */
                        <div className="space-y-4 animate-in fade-in duration-200">
                          <Card className="border border-border bg-muted/20 shadow-sm">
                            <CardHeader className="py-3 px-4 border-b border-border/50 bg-muted/40">
                              <CardTitle className="text-xs font-bold flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4 text-primary" /> Order Invoice Summary
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="py-3 px-4 space-y-2 text-xs">
                              <div className="flex justify-between py-1 border-b border-dashed border-border/60">
                                <span className="text-muted-foreground">{getProductInfo()?.name || 'Custom Print'} (Qty: {getPricingDetails().quantity})</span>
                                <span className="font-medium text-foreground">${getPricingDetails().subtotal?.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between py-0.5">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium text-foreground">${getPricingDetails().subtotal?.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between py-0.5">
                                <span className="text-muted-foreground">Sales Tax (8%)</span>
                                <span className="font-medium text-foreground">${getPricingDetails().tax?.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between py-0.5">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-medium text-foreground">
                                  {getPricingDetails().shipping === 0 ? 'FREE' : `$${getPricingDetails().shipping?.toFixed(2)}`}
                                </span>
                              </div>
                              <div className="flex justify-between py-2 border-t border-border/80 text-sm font-bold mt-1">
                                <span className="text-foreground">Total Price</span>
                                <span className="text-primary font-bold">${getPricingDetails().total?.toFixed(2)}</span>
                              </div>
                            </CardContent>
                          </Card>
                          <Button 
                            className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-5 mt-2 flex items-center justify-center gap-2"
                            onClick={() => setCheckoutStep(2)}
                          >
                            <span>Next: Enter Shipping Address</span> <ArrowLeft className="h-4 w-4 rotate-180" />
                          </Button>
                        </div>
                      )}

                      {checkoutStep === 2 && (
                        /* STEP 2: SHIPPING ADDRESS */
                        <div className="space-y-4 animate-in fade-in duration-200">
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold flex items-center gap-2 text-foreground">
                              <MapPin className="h-4 w-4 text-primary" /> Shipping Address
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1 col-span-2">
                                <Label htmlFor="shippingName" className="text-xs">Full Name</Label>
                                <Input id="shippingName" required value={shippingName} onChange={e => setShippingName(e.target.value)} placeholder="John Doe" />
                              </div>
                              <div className="space-y-1 col-span-2">
                                <Label htmlFor="shippingPhone" className="text-xs">Phone Number</Label>
                                <Input id="shippingPhone" required value={shippingPhone} onChange={e => setShippingPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
                              </div>
                              <div className="space-y-1 col-span-2">
                                <Label htmlFor="shippingAddress1" className="text-xs">Address Line 1</Label>
                                <Input id="shippingAddress1" required value={shippingAddress1} onChange={e => setShippingAddress1(e.target.value)} placeholder="123 Printing Lane" />
                              </div>
                              <div className="space-y-1 col-span-2">
                                <Label htmlFor="shippingAddress2" className="text-xs">Address Line 2 (Optional)</Label>
                                <Input id="shippingAddress2" value={shippingAddress2} onChange={e => setShippingAddress2(e.target.value)} placeholder="Suite 100" />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="shippingCity" className="text-xs">City</Label>
                                <Input id="shippingCity" required value={shippingCity} onChange={e => setShippingCity(e.target.value)} placeholder="Creative City" />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="shippingState" className="text-xs">State / Prov</Label>
                                <Input id="shippingState" required value={shippingState} onChange={e => setShippingState(e.target.value)} placeholder="CA" />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="shippingZip" className="text-xs">ZIP / Postal</Label>
                                <Input id="shippingZip" required value={shippingZip} onChange={e => setShippingZip(e.target.value)} placeholder="90210" />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor="shippingCountry" className="text-xs">Country</Label>
                                <Input id="shippingCountry" required value={shippingCountry} onChange={e => setShippingCountry(e.target.value)} placeholder="United States" />
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <Button 
                              variant="outline" 
                              className="w-1/3 text-xs" 
                              onClick={() => setCheckoutStep(1)}
                            >
                              Back
                            </Button>
                            <Button 
                              className="w-2/3 bg-primary hover:bg-primary/95 text-white font-bold py-5 flex items-center justify-center gap-2"
                              disabled={!isAddressComplete}
                              onClick={() => setCheckoutStep(3)}
                            >
                              <span>Next: Payment Details</span> <ArrowLeft className="h-4 w-4 rotate-180" />
                            </Button>
                          </div>
                          {!isAddressComplete && (
                            <p className="text-[10px] text-muted-foreground text-center animate-pulse">
                              Please fill out all required fields to unlock the Payment stage.
                            </p>
                          )}
                        </div>
                      )}

                      {checkoutStep === 3 && (
                        /* STEP 3: PAYMENT DETAILS */
                        <form onSubmit={handleCheckout} className="space-y-4 animate-in fade-in duration-200">
                          <h4 className="text-sm font-bold flex items-center gap-2 text-foreground">
                            <CreditCard className="h-4 w-4 text-primary" /> Payment Details
                          </h4>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Select Payment Method</Label>
                              <select 
                                value={paymentMethod} 
                                onChange={e => setPaymentMethod(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                              >
                                <option value="paypal">PayPal (Simulated Sandbox)</option>
                                <option value="credit_card">Credit Card (Instant Approval)</option>
                                <option value="cod">Cash on Delivery</option>
                                <option value="bank_transfer">Bank Transfer</option>
                              </select>
                            </div>

                            {paymentMethod === 'paypal' && (
                              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg text-xs space-y-2 text-muted-foreground animate-in fade-in duration-200">
                                <p className="font-bold text-amber-600 dark:text-amber-400">PayPal Express Checkout:</p>
                                <p>Click the button below to open the secure simulated PayPal Sandbox checkout.</p>
                              </div>
                            )}

                            {paymentMethod === 'credit_card' && (
                              <div className="p-3 bg-muted/30 border border-border rounded-lg space-y-2 animate-in fade-in duration-200">
                                <div className="space-y-1">
                                  <Label htmlFor="cardName" className="text-xs">Name on Card</Label>
                                  <Input id="cardName" required={paymentMethod === 'credit_card'} value={cardName} onChange={e => setCardName(e.target.value)} placeholder="John Doe" />
                                </div>
                                <div className="space-y-1">
                                  <Label htmlFor="cardNumber" className="text-xs">Card Number</Label>
                                  <Input id="cardNumber" required={paymentMethod === 'credit_card'} value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="1234 5678 1234 5678" maxLength={19} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <Label htmlFor="cardExpiry" className="text-xs">Expiration Date</Label>
                                    <Input id="cardExpiry" required={paymentMethod === 'credit_card'} value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor="cardCvv" className="text-xs">CVV</Label>
                                    <Input id="cardCvv" required={paymentMethod === 'credit_card'} type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value)} placeholder="123" maxLength={4} />
                                  </div>
                                </div>
                              </div>
                            )}

                            {paymentMethod === 'bank_transfer' && (
                              <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg text-xs space-y-1 text-muted-foreground animate-in fade-in duration-200">
                                <p className="font-bold text-blue-500">Bank Transfer Instructions:</p>
                                <p>Please wire the total amount to:</p>
                                <p className="font-mono text-foreground mt-1">Bank: PrintFlow National Bank</p>
                                <p className="font-mono text-foreground">Account: 1234-5678-9012</p>
                                <p className="font-mono text-foreground">Routing: 987654321</p>
                                <p className="italic mt-1">Order will start processing once payment verification is confirmed.</p>
                              </div>
                            )}

                            {paymentMethod === 'cod' && (
                              <div className="p-3 bg-muted/40 border border-border rounded-lg text-xs text-muted-foreground animate-in fade-in duration-200">
                                <p className="font-semibold text-foreground">Cash on Delivery:</p>
                                <p>You will pay the full order amount in cash directly to our delivery courier upon receipt of the items.</p>
                              </div>
                            )}
                          </div>

                          {checkoutError && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                              <span>{checkoutError}</span>
                            </div>
                          )}

                          <div className="flex gap-3 pt-2">
                            <Button 
                              type="button"
                              variant="outline" 
                              className="w-1/3 text-xs" 
                              onClick={() => setCheckoutStep(2)}
                            >
                              Back
                            </Button>
                            <Button 
                              type="submit" 
                              disabled={checkingOut}
                              className="w-2/3 bg-gradient-to-r from-primary to-emerald-600 hover:to-emerald-700 text-white font-bold shadow-md py-5 text-sm flex items-center justify-center gap-2"
                            >
                              {checkingOut ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing Order...
                                </>
                              ) : paymentMethod === 'paypal' ? (
                                <>
                                  <span className="font-extrabold italic mr-2 text-yellow-300">PayPal</span> Pay & Place Order
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" /> Place Order
                                </>
                              )}
                            </Button>
                          </div>
                        </form>
                      )}

                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        {/* PAYPAL SANDBOX MODAL */}
        {paypalModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md border border-border shadow-2xl bg-background overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="bg-[#003087] p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg italic tracking-wider">
                    <span className="text-[#0079C1]">Pay</span><span className="text-[#00457C]">Pal</span>
                  </span>
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/20 px-1.5 py-0.5 rounded font-mono font-semibold uppercase tracking-wider">Sandbox</span>
                </div>
                <button 
                  onClick={() => setPaypalModalOpen(false)} 
                  className="text-white/80 hover:text-white text-xs font-semibold p-1 hover:bg-white/10 rounded"
                  type="button"
                >
                  Cancel
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Merchant Details */}
                <div className="flex justify-between items-center bg-muted/40 p-3 rounded-lg border border-border/50 text-xs">
                  <div>
                    <p className="font-semibold text-foreground">PrintFlow Inc.</p>
                    <p className="text-[10px] text-muted-foreground">Order Ref: {design?.designType?.toUpperCase()}-DESG</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">Total Amount</p>
                    <p className="font-bold text-sm text-primary">${getPricingDetails().total?.toFixed(2)}</p>
                  </div>
                </div>

                {paypalPaying ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                    <Loader2 className="h-10 w-10 text-[#0079C1] animate-spin" />
                    <p className="text-sm font-medium text-foreground">Processing PayPal Transaction...</p>
                    <p className="text-xs text-muted-foreground animate-pulse">Do not close this window</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs">PayPal Account Email</Label>
                      <Input 
                        type="email" 
                        defaultValue="buyer-sandbox@printflow.com" 
                        disabled 
                        className="bg-muted text-muted-foreground text-xs" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">PayPal Sandbox Password</Label>
                      <Input 
                        type="password" 
                        defaultValue="••••••••" 
                        disabled 
                        className="bg-muted text-muted-foreground text-xs" 
                      />
                    </div>
                    
                    <div className="text-[10px] text-muted-foreground flex gap-2 p-2.5 bg-[#0079C1]/5 border border-[#0079C1]/10 rounded">
                      <CheckCircle className="h-4 w-4 text-[#0079C1] shrink-0 mt-0.5" />
                      <span>This is a simulated sandbox transaction. Your virtual wallet balance of <strong>$1,500.00</strong> will be charged.</span>
                    </div>

                    <Button 
                      onClick={handlePaypalSubmit}
                      type="button"
                      className="w-full bg-[#FFC439] hover:bg-[#E1AE2E] text-[#003087] font-bold py-5 shadow-sm rounded-lg flex items-center justify-center gap-2"
                    >
                      <span className="font-extrabold italic tracking-wider text-sm">Pay Now</span>
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  const details = design?.designDetails || {};
  const socialLinks = details.socialLinks || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground flex flex-col">
      <header className="border-b border-border bg-background px-4 py-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold">PrintFlow Design Center</h1>
            <p className="text-xs text-muted-foreground">Verification & Approval Portal</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portal
        </Button>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 grid gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN: Design Preview */}
        <div className="lg:col-span-2 space-y-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-emerald-500" /> Live Design Preview
            </h2>
            {approved && (
              <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Approved
              </span>
            )}
          </div>

          <div className="w-full space-y-8 flex flex-col items-center bg-background border border-border p-6 rounded-xl shadow-md">
            {design?.designType === 'letterhead' ? (
              /* LETTERHEAD PREVIEW */
              <div className="w-full max-w-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Letterhead View</span>
                <Card className="w-full aspect-[8.5/11] shadow-lg overflow-hidden rounded-sm border transition-all duration-300 relative bg-white flex items-center justify-center p-8 bg-no-repeat bg-center"
                      style={{ 
                        backgroundImage: details.uploadedLetterhead ? `url(${details.uploadedLetterhead})` : 'none',
                        backgroundSize: 'cover',
                      }}>
                  {!details.uploadedLetterhead && (
                    <div className="text-center text-muted-foreground text-xs p-4">
                      <ImageIcon className="mx-auto h-8 w-8 mb-2 opacity-40 text-emerald-500" />
                      <p className="font-semibold text-foreground">Custom Design Uploaded</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Watermarked Stationery Batch Setup</p>
                    </div>
                  )}
                </Card>
              </div>
            ) : design?.designType === 'envelope' ? (
              /* ENVELOPE PREVIEWS */
              <>
                <div className="w-full max-w-md space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Front Side</span>
                  <Card className="w-full aspect-[9.5/4.125] shadow-lg overflow-hidden rounded-sm border transition-all duration-300 relative bg-white flex items-center justify-center bg-no-repeat bg-center"
                        style={{
                          backgroundImage: details.uploadedFront && details.uploadedFront !== '/images/envelope_front_demo.png' ? `url(${details.uploadedFront})` : 'none',
                          backgroundSize: 'cover',
                        }}>
                    {(!details.uploadedFront || details.uploadedFront === '/images/envelope_front_demo.png') && (
                      <div className="text-center text-muted-foreground text-xs p-4">
                        <ImageIcon className="mx-auto h-6 w-6 mb-1 opacity-40 text-emerald-500" />
                        <p className="font-semibold text-foreground">Envelope Front Preview</p>
                      </div>
                    )}
                  </Card>
                </div>
                <div className="w-full max-w-md space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Back Side</span>
                  <Card className="w-full aspect-[9.5/4.125] shadow-lg overflow-hidden rounded-sm border transition-all duration-300 relative bg-white flex items-center justify-center bg-no-repeat bg-center"
                        style={{
                          backgroundImage: details.uploadedBack && details.uploadedBack !== '/images/envelope_back_demo.png' ? `url(${details.uploadedBack})` : 'none',
                          backgroundSize: 'cover',
                        }}>
                    {(!details.uploadedBack || details.uploadedBack === '/images/envelope_back_demo.png') && (
                      <div className="text-center text-muted-foreground text-xs p-4">
                        <ImageIcon className="mx-auto h-6 w-6 mb-1 opacity-40 text-emerald-500" />
                        <p className="font-semibold text-foreground">Envelope Back Preview</p>
                      </div>
                    )}
                  </Card>
                </div>
              </>
            ) : design?.designType === 'notepad' ? (
              /* NOTEPAD PREVIEW */
              <div className="w-full max-w-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Notepad View</span>
                <Card className="w-full aspect-[5.5/8.5] shadow-lg overflow-hidden rounded-sm border transition-all duration-300 relative bg-white flex items-center justify-center p-8 bg-no-repeat bg-center"
                      style={{ 
                        backgroundImage: details.uploadedNotepad ? `url(${details.uploadedNotepad})` : 'none',
                        backgroundSize: 'cover',
                      }}>
                  {!details.uploadedNotepad && (
                    <div className="text-center text-muted-foreground text-xs p-4">
                      <ImageIcon className="mx-auto h-8 w-8 mb-2 opacity-40 text-emerald-500" />
                      <p className="font-semibold text-foreground">Custom Notepad Design</p>
                    </div>
                  )}
                </Card>
              </div>
            ) : design?.designType === 'folder' ? (
              /* FOLDER PREVIEW */
              <div className="w-full max-w-sm space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Presentation Folder View</span>
                <Card className="w-full aspect-[9/12] shadow-lg overflow-hidden rounded-sm border transition-all duration-300 relative bg-white flex items-center justify-center p-8 bg-no-repeat bg-center"
                      style={{ 
                        backgroundImage: details.uploadedFolder ? `url(${details.uploadedFolder})` : 'none',
                        backgroundSize: 'cover',
                      }}>
                  {!details.uploadedFolder && (
                    <div className="text-center text-muted-foreground text-xs p-4">
                      <ImageIcon className="mx-auto h-8 w-8 mb-2 opacity-40 text-emerald-500" />
                      <p className="font-semibold text-foreground">Custom Folder Design</p>
                    </div>
                  )}
                </Card>
              </div>
            ) : design?.designType === 'slip' ? (
              /* COMPLIMENT SLIP PREVIEW */
              <div className="w-full max-w-md space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Compliment Slip View</span>
                <Card className="w-full aspect-[8.5/3.5] shadow-lg overflow-hidden rounded-sm border transition-all duration-300 relative bg-white flex items-center justify-center p-8 bg-no-repeat bg-center"
                      style={{ 
                        backgroundImage: details.uploadedSlip ? `url(${details.uploadedSlip})` : 'none',
                        backgroundSize: 'cover',
                      }}>
                  {!details.uploadedSlip && (
                    <div className="text-center text-muted-foreground text-xs p-4">
                      <ImageIcon className="mx-auto h-8 w-8 mb-2 opacity-40 text-emerald-500" />
                      <p className="font-semibold text-foreground">Custom Slip Design</p>
                    </div>
                  )}
                </Card>
              </div>
            ) : (
              /* BUSINESS CARD PREVIEWS */
              <>
                {/* FRONT SIDE */}
                <div className="w-full max-w-md space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Front Side</span>
                  <Card className="w-full aspect-[3.5/2] shadow-lg overflow-hidden rounded-md border transition-all duration-300 relative bg-no-repeat bg-center"
                        style={{ 
                          backgroundColor: details.secondaryColor || '#ffffff',
                          fontFamily: getFontFamily(details.fontFamily), 
                          color: details.textColor || '#1e293b',
                          borderColor: 'rgba(0,0,0,0.05)'
                        }}>
                    
                    <div className="absolute top-0 right-0 p-4 text-right flex flex-col items-end">
                      <span className="text-xs font-bold tracking-widest uppercase opacity-75">{details.companyName}</span>
                      <span className="text-[8px] tracking-wider opacity-60 italic">{details.tagline}</span>
                    </div>

                    <div className="absolute bottom-0 left-0 p-4 space-y-1 max-w-[65%]">
                      <h3 className="text-lg font-bold leading-tight">{details.personName}</h3>
                      <p className="text-[10px] font-medium tracking-wide opacity-80 leading-none">{details.jobTitle}</p>
                      
                      <div className="pt-2 text-[8px] space-y-0.5 leading-normal opacity-85">
                        {details.phone && <div className="flex items-center gap-1"><Smartphone className="h-2 w-2" /> {details.phone}</div>}
                        {details.email && <div className="flex items-center gap-1"><Mail className="h-2 w-2" /> {details.email}</div>}
                        {details.website && <div className="flex items-center gap-1"><Globe className="h-2 w-2" /> {details.website}</div>}
                      </div>
                    </div>

                    <div className="absolute bottom-0 right-0 p-4 text-[7px] space-y-0.5 max-w-[45%] text-right opacity-80 leading-tight">
                      {details.address1 && <div>{details.address1}</div>}
                      {details.address2 && <div>{details.address2}</div>}
                      {details.address3 && <div>{details.address3}</div>}
                    </div>
                  </Card>
                </div>

                {/* BACK SIDE */}
                <div className="w-full max-w-md space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Back Side</span>
                  <Card className="w-full aspect-[3.5/2] shadow-lg overflow-hidden rounded-md border-0 transition-all duration-300 relative flex items-center justify-center p-8 bg-no-repeat bg-center"
                        style={{ 
                          backgroundColor: details.primaryColor || '#10b981', 
                          fontFamily: getFontFamily(details.fontFamily) 
                        }}>
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="p-3 bg-black/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-sm">
                        <h2 className="text-2xl font-bold tracking-tight mb-0.5" style={{ color: details.secondaryColor || '#ffffff' }}>{details.companyName}</h2>
                        <p className="text-[10px] tracking-widest uppercase opacity-90 font-medium" style={{ color: details.secondaryColor || '#ffffff' }}>{details.tagline}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Info and Approval Box */}
        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          <Card className="border border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Design Details & Specifications</CardTitle>
              <CardDescription>Submitted by {design?.userEmail}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {design?.designType === 'letterhead' ? (
                /* LETTERHEAD SPECS */
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground font-semibold">Product Type:</span>
                    <span className="font-bold text-foreground">Letterhead Stationery</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Measurement:</span>
                    <span className="font-medium text-foreground">{details.measurement}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Number of Reams:</span>
                    <span className="font-medium text-foreground">{details.reams}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Cost per Ream:</span>
                    <span className="font-medium text-foreground">${details.costPerReam}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Quantity in Stock:</span>
                    <span className="font-medium text-foreground">{details.inStock}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Quantity Balance:</span>
                    <span className="font-medium text-foreground">{details.balance}</span>
                  </div>
                </div>
              ) : design?.designType === 'envelope' ? (
                /* ENVELOPE SPECS */
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground font-semibold">Product Type:</span>
                    <span className="font-bold text-foreground">Custom Envelopes</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Measurement:</span>
                    <span className="font-medium text-foreground">{details.measurement}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Number of Boxes:</span>
                    <span className="font-medium text-foreground">{details.boxes}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Cost per Box:</span>
                    <span className="font-medium text-foreground">${details.costPerBox}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Quantity in Stock:</span>
                    <span className="font-medium text-foreground">{details.inStock}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Quantity Balance:</span>
                    <span className="font-medium text-foreground">{details.balance}</span>
                  </div>
                </div>
              ) : design?.designType === 'notepad' ? (
                /* NOTEPAD SPECS */
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground font-semibold">Product Type:</span>
                    <span className="font-bold text-foreground">Designer Notepads</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Measurement:</span>
                    <span className="font-medium text-foreground">{details.measurement}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Number of Pads:</span>
                    <span className="font-medium text-foreground">{details.pads}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Cost per Pad:</span>
                    <span className="font-medium text-foreground">${details.costPerPad}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Quantity in Stock:</span>
                    <span className="font-medium text-foreground">{details.inStock}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Quantity Balance:</span>
                    <span className="font-medium text-foreground">{details.balance}</span>
                  </div>
                </div>
              ) : design?.designType === 'folder' ? (
                /* FOLDER SPECS */
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground font-semibold">Product Type:</span>
                    <span className="font-bold text-foreground">Presentation Folders</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Measurement:</span>
                    <span className="font-medium text-foreground">{details.measurement}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Number of Boxes:</span>
                    <span className="font-medium text-foreground">{details.boxes}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Cost per Box:</span>
                    <span className="font-medium text-foreground">${details.costPerBox}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Quantity in Stock:</span>
                    <span className="font-medium text-foreground">{details.inStock}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Quantity Balance:</span>
                    <span className="font-medium text-foreground">{details.balance}</span>
                  </div>
                </div>
              ) : design?.designType === 'slip' ? (
                /* SLIP SPECS */
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground font-semibold">Product Type:</span>
                    <span className="font-bold text-foreground">Compliment Slips</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Measurement:</span>
                    <span className="font-medium text-foreground">{details.measurement}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Number of Boxes:</span>
                    <span className="font-medium text-foreground">{details.boxes}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Cost per Box:</span>
                    <span className="font-medium text-foreground">${details.costPerBox}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Quantity in Stock:</span>
                    <span className="font-medium text-foreground">{details.inStock}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Quantity Balance:</span>
                    <span className="font-medium text-foreground">{details.balance}</span>
                  </div>
                </div>
              ) : (
                /* BUSINESS CARD SPECS */
                <>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Finished Size:</span>
                      <span className="font-medium text-foreground">{details.finishedSize}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Colors:</span>
                      <span className="font-medium text-foreground">{details.colorOptions}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Config:</span>
                      <span className="font-medium text-foreground">{details.printConfig}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Sheet Size:</span>
                      <span className="font-medium text-foreground">{details.sheetSize}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Cards Per Sheet:</span>
                      <span className="font-medium text-foreground">{details.cardsPerSheet}</span>
                    </div>
                  </div>

                  {socialLinks.some((s: any) => s.visible && s.value) && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Social Links:</span>
                      <div className="grid grid-cols-1 gap-1 text-xs">
                        {socialLinks.filter((s: any) => s.visible && s.value).map((link: any) => (
                          <div key={link.id} className="flex items-center gap-2 p-2 bg-muted/40 rounded border border-border/50">
                            <span className="text-primary">{renderSocialIcon(link.id)}</span>
                            <span className="font-medium text-foreground truncate">{link.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* APPROVAL DECISION BOX & CHECKOUT */}
          <Card className="border-2 border-primary/20 shadow-lg relative overflow-hidden bg-primary/5 dark:bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-primary animate-pulse" /> Final Verification
              </CardTitle>
              <CardDescription>
                Ensure all typography, contact info, and layout previews are correct.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {approved ? (
                orderPlaced ? (
                  /* ORDER SUCCESS SCREEN */
                  <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center space-y-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 mb-2">
                      <CheckCircle className="h-8 w-8 text-emerald-500 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Order Confirmed!</h3>
                    <p className="text-sm text-muted-foreground">
                      Your order has been successfully placed.
                    </p>
                    <div className="p-3 bg-muted/50 rounded-lg border border-border text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order Number:</span>
                        <span className="font-mono font-bold text-foreground">{orderPlaced.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Paid:</span>
                        <span className="font-bold text-foreground">${orderPlaced.total?.toFixed(2)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground animate-pulse mt-2">
                      Redirecting to dashboard in {countdown} seconds...
                    </p>
                    <Button className="w-full mt-2" onClick={() => navigate('/orders')}>
                      Go to My Orders
                    </Button>
                  </div>
                ) : (
                  /* CHECKOUT FLOW */
                  <div className="space-y-6 text-left">
                    {/* Design approved notice */}
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                      <div>
                        <p className="font-bold">Design Approved!</p>
                        <p className="text-xs text-muted-foreground">Please complete shipping & payment details below to place your order.</p>
                      </div>
                    </div>

                    {!localStorage.getItem('token') ? (
                      /* USER NOT LOGGED IN WARNING */
                      <Card className="border-warning/30 bg-warning/5 p-4 rounded-xl text-center space-y-4">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-warning/10 text-warning">
                          <AlertCircle className="h-6 w-6" />
                        </div>
                        <h4 className="font-bold text-warning-foreground text-sm">Secure Checkout Required</h4>
                        <p className="text-xs text-muted-foreground">
                          You must be logged in to PrintFlow to submit orders.
                        </p>
                        <Button 
                          onClick={() => navigate(`/login?redirect=/approve-card-design/${approvalId}`)}
                          className="w-full bg-warning hover:bg-warning/90 text-warning-foreground font-semibold"
                        >
                          Login to Complete Checkout
                        </Button>
                      </Card>
                    ) : (
                      /* LOGGED IN CHECKOUT FORM */
                      <form onSubmit={handleCheckout} className="space-y-6">
                        {/* 1. ORDER SUMMARY INVOICE */}
                        <Card className="border border-border bg-muted/20 shadow-sm">
                          <CardHeader className="py-3 px-4 border-b border-border/50 bg-muted/40">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                              <ShoppingCart className="h-4 w-4 text-primary" /> Order Invoice Summary
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-3 px-4 space-y-2 text-xs">
                            <div className="flex justify-between py-1 border-b border-dashed border-border/60">
                              <span className="text-muted-foreground">{getProductInfo()?.name || 'Custom Print'} (Qty: {getPricingDetails().quantity})</span>
                              <span className="font-medium text-foreground">${getPricingDetails().subtotal?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-0.5">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span className="font-medium text-foreground">${getPricingDetails().subtotal?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-0.5">
                              <span className="text-muted-foreground">Sales Tax (8%)</span>
                              <span className="font-medium text-foreground">${getPricingDetails().tax?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-0.5">
                              <span className="text-muted-foreground">Shipping</span>
                              <span className="font-medium text-foreground">
                                {getPricingDetails().shipping === 0 ? 'FREE' : `$${getPricingDetails().shipping?.toFixed(2)}`}
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-t border-border/80 text-sm font-bold mt-1">
                              <span className="text-foreground">Total Price</span>
                              <span className="text-primary font-bold">${getPricingDetails().total?.toFixed(2)}</span>
                            </div>
                          </CardContent>
                        </Card>

                        {/* 2. SHIPPING ADDRESS FORM */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold flex items-center gap-2 text-foreground">
                            <MapPin className="h-4 w-4 text-primary" /> 1. Shipping Address
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1 col-span-2">
                              <Label htmlFor="shippingName" className="text-xs">Full Name</Label>
                              <Input id="shippingName" required value={shippingName} onChange={e => setShippingName(e.target.value)} placeholder="John Doe" />
                            </div>
                            <div className="space-y-1 col-span-2">
                              <Label htmlFor="shippingPhone" className="text-xs">Phone Number</Label>
                              <Input id="shippingPhone" required value={shippingPhone} onChange={e => setShippingPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
                            </div>
                            <div className="space-y-1 col-span-2">
                              <Label htmlFor="shippingAddress1" className="text-xs">Address Line 1</Label>
                              <Input id="shippingAddress1" required value={shippingAddress1} onChange={e => setShippingAddress1(e.target.value)} placeholder="123 Printing Lane" />
                            </div>
                            <div className="space-y-1 col-span-2">
                              <Label htmlFor="shippingAddress2" className="text-xs">Address Line 2 (Optional)</Label>
                              <Input id="shippingAddress2" value={shippingAddress2} onChange={e => setShippingAddress2(e.target.value)} placeholder="Suite 100" />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="shippingCity" className="text-xs">City</Label>
                              <Input id="shippingCity" required value={shippingCity} onChange={e => setShippingCity(e.target.value)} placeholder="Creative City" />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="shippingState" className="text-xs">State / Prov</Label>
                              <Input id="shippingState" required value={shippingState} onChange={e => setShippingState(e.target.value)} placeholder="CA" />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="shippingZip" className="text-xs">ZIP / Postal</Label>
                              <Input id="shippingZip" required value={shippingZip} onChange={e => setShippingZip(e.target.value)} placeholder="90210" />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="shippingCountry" className="text-xs">Country</Label>
                              <Input id="shippingCountry" required value={shippingCountry} onChange={e => setShippingCountry(e.target.value)} placeholder="United States" />
                            </div>
                          </div>
                        </div>

                        {/* 3. PAYMENT METHOD FORM */}
                        {isAddressComplete ? (
                          <div className="space-y-3 pt-2 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                            <h4 className="text-sm font-bold flex items-center gap-2 text-foreground">
                              <CreditCard className="h-4 w-4 text-primary" /> 2. Payment Details
                            </h4>
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <Label className="text-xs">Select Payment Method</Label>
                                <select 
                                  value={paymentMethod} 
                                  onChange={e => setPaymentMethod(e.target.value)}
                                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                >
                                  <option value="paypal">PayPal (Simulated Sandbox)</option>
                                  <option value="credit_card">Credit Card (Instant Approval)</option>
                                  <option value="cod">Cash on Delivery</option>
                                  <option value="bank_transfer">Bank Transfer</option>
                                </select>
                              </div>

                              {paymentMethod === 'paypal' && (
                                <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg text-xs space-y-2 text-muted-foreground animate-in fade-in duration-200">
                                  <p className="font-bold text-amber-600 dark:text-amber-400">PayPal Express Checkout:</p>
                                  <p>Click the button below to open the secure simulated PayPal Sandbox checkout.</p>
                                </div>
                              )}

                              {paymentMethod === 'credit_card' && (
                                <div className="p-3 bg-muted/30 border border-border rounded-lg space-y-2 animate-in fade-in duration-200">
                                  <div className="space-y-1">
                                    <Label htmlFor="cardName" className="text-xs">Name on Card</Label>
                                    <Input id="cardName" required={paymentMethod === 'credit_card'} value={cardName} onChange={e => setCardName(e.target.value)} placeholder="John Doe" />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor="cardNumber" className="text-xs">Card Number</Label>
                                    <Input id="cardNumber" required={paymentMethod === 'credit_card'} value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="1234 5678 1234 5678" maxLength={19} />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <Label htmlFor="cardExpiry" className="text-xs">Expiration Date</Label>
                                      <Input id="cardExpiry" required={paymentMethod === 'credit_card'} value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} />
                                    </div>
                                    <div className="space-y-1">
                                      <Label htmlFor="cardCvv" className="text-xs">CVV</Label>
                                      <Input id="cardCvv" required={paymentMethod === 'credit_card'} type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value)} placeholder="123" maxLength={4} />
                                    </div>
                                  </div>
                                </div>
                              )}

                              {paymentMethod === 'bank_transfer' && (
                                <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg text-xs space-y-1 text-muted-foreground animate-in fade-in duration-200">
                                  <p className="font-bold text-blue-500">Bank Transfer Instructions:</p>
                                  <p>Please wire the total amount to:</p>
                                  <p className="font-mono text-foreground mt-1">Bank: PrintFlow National Bank</p>
                                  <p className="font-mono text-foreground">Account: 1234-5678-9012</p>
                                  <p className="font-mono text-foreground">Routing: 987654321</p>
                                  <p className="italic mt-1">Order will start processing once payment verification is confirmed.</p>
                                </div>
                              )}

                              {paymentMethod === 'cod' && (
                                <div className="p-3 bg-muted/40 border border-border rounded-lg text-xs text-muted-foreground animate-in fade-in duration-200">
                                  <p className="font-semibold text-foreground">Cash on Delivery:</p>
                                  <p>You will pay the full order amount in cash directly to our delivery courier upon receipt of the items.</p>
                                </div>
                              )}
                            </div>

                            {checkoutError && (
                              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                <span>{checkoutError}</span>
                              </div>
                            )}

                            <Button 
                              type="submit" 
                              disabled={checkingOut}
                              className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:to-emerald-700 text-white font-bold shadow-md py-6 text-base"
                            >
                              {checkingOut ? (
                                <>
                                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Placing Order...
                                </>
                              ) : paymentMethod === 'paypal' ? (
                                <>
                                  <span className="font-extrabold italic mr-2 text-yellow-300">PayPal</span> Pay & Place Order
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-5 w-5" /> Confirm Checkout & Place Order
                                </>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="p-5 bg-muted/30 border border-dashed border-border rounded-xl text-center space-y-2 pt-2 border-t mt-4">
                            <MapPin className="mx-auto h-8 w-8 text-primary/60 animate-pulse" />
                            <h4 className="text-xs font-bold text-foreground">Payment Options Locked</h4>
                            <p className="text-[11px] text-muted-foreground">
                              Please fill out your Name, Phone, Address Line 1, City, State, and ZIP code above to unlock the PayPal payment options.
                            </p>
                          </div>
                        )}
                      </form>
                    )}
                  </div>
                )
              ) : (
                <div className="space-y-4 text-left">
                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground leading-relaxed text-center">
                    By clicking the approve button below, you confirm that you have inspected the front and back layouts and certify that all details are correct. 
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-md py-6 text-base"
                    onClick={handleApprove}
                    disabled={approving}
                  >
                    {approving ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting Approval...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" /> Approve Design & Send to Admin
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* PAYPAL SANDBOX MODAL */}
      {paypalModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md border border-border shadow-2xl bg-background overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#003087] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg italic tracking-wider">
                  <span className="text-[#0079C1]">Pay</span><span className="text-[#00457C]">Pal</span>
                </span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/20 px-1.5 py-0.5 rounded font-mono font-semibold uppercase tracking-wider">Sandbox</span>
              </div>
              <button 
                onClick={() => setPaypalModalOpen(false)} 
                className="text-white/80 hover:text-white text-xs font-semibold p-1 hover:bg-white/10 rounded"
                type="button"
              >
                Cancel
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Merchant Details */}
              <div className="flex justify-between items-center bg-muted/40 p-3 rounded-lg border border-border/50 text-xs">
                <div>
                  <p className="font-semibold text-foreground">PrintFlow Inc.</p>
                  <p className="text-[10px] text-muted-foreground">Order Ref: {design?.designType?.toUpperCase()}-DESG</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Total Amount</p>
                  <p className="font-bold text-sm text-primary">${getPricingDetails().total?.toFixed(2)}</p>
                </div>
              </div>

              {paypalPaying ? (
                <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                  <Loader2 className="h-10 w-10 text-[#0079C1] animate-spin" />
                  <p className="text-sm font-medium text-foreground">Processing PayPal Transaction...</p>
                  <p className="text-xs text-muted-foreground animate-pulse">Do not close this window</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">PayPal Account Email</Label>
                    <Input 
                      type="email" 
                      defaultValue="buyer-sandbox@printflow.com" 
                      disabled 
                      className="bg-muted text-muted-foreground text-xs" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">PayPal Sandbox Password</Label>
                    <Input 
                      type="password" 
                      defaultValue="••••••••" 
                      disabled 
                      className="bg-muted text-muted-foreground text-xs" 
                    />
                  </div>
                  
                  <div className="text-[10px] text-muted-foreground flex gap-2 p-2.5 bg-[#0079C1]/5 border border-[#0079C1]/10 rounded">
                    <CheckCircle className="h-4 w-4 text-[#0079C1] shrink-0 mt-0.5" />
                    <span>This is a simulated sandbox transaction. Your virtual wallet balance of <strong>$1,500.00</strong> will be charged.</span>
                  </div>

                  <Button 
                    onClick={handlePaypalSubmit}
                    type="button"
                    className="w-full bg-[#FFC439] hover:bg-[#E1AE2E] text-[#003087] font-bold py-5 shadow-sm rounded-lg flex items-center justify-center gap-2"
                  >
                    <span className="font-extrabold italic tracking-wider text-sm">Pay Now</span>
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
