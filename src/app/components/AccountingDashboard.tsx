import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  FileText, DollarSign, XCircle, TrendingUp, CheckCircle, Menu, 
  Send, Eye, Loader2, Calendar, ShoppingBag, Mail, Phone, MapPin,
  RotateCcw
} from 'lucide-react';
import { StatsCard } from './StatsCard';

interface AccountingDashboardProps {
  onMenuClick?: () => void;
}

export function AccountingDashboard({ onMenuClick }: AccountingDashboardProps) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [sendingInvoiceId, setSendingInvoiceId] = useState<string | null>(null);

  const fetchOrdersAsInvoices = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch('/api/v1/orders?limit=100', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await response.json();
      if (response.ok && resData.success && resData.data) {
        const mappedInvoices = resData.data.map((order: any) => {
          const invoiceNumber = `INV-${order.orderNumber.replace('ORD-', '')}`;
          const issueDate = order.createdAt ? order.createdAt.slice(0, 10) : 'N/A';
          const dueDateObj = order.createdAt ? new Date(new Date(order.createdAt).getTime() + 14 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
          const dueDate = dueDateObj.toISOString().slice(0, 10);

          return {
            id: order._id,
            invoiceNumber,
            orderNumber: order.orderNumber,
            customerName: order.customer?.fullName || 'Guest Customer',
            customerEmail: order.customer?.email || 'N/A',
            amount: order.total || 0,
            status: order.paymentStatus === 'paid' ? 'paid' : 'sent',
            issueDate,
            dueDate,
            rawOrder: order
          };
        });
        setInvoices(mappedInvoices);
      }
    } catch (err) {
      console.error('Error loading accounting data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAsInvoices();
  }, []);

  const handleSendInvoice = async (invoice: any) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setSendingInvoiceId(invoice.id);
    try {
      const response = await fetch(`/api/v1/orders/${invoice.id}/send-invoice`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        alert(`Invoice ${invoice.invoiceNumber} has been successfully sent to ${invoice.customerEmail}!`);
      } else {
        alert(resData.error || 'Failed to send invoice email.');
      }
    } catch (err) {
      console.error('Error sending invoice:', err);
      alert('Network error. Failed to send.');
    } finally {
      setSendingInvoiceId(null);
    }
  };

  const openInvoiceDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setInvoiceModalOpen(true);
  };

  // Financial Stats Computations
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === 'sent').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices.filter(i => {
    if (i.status === 'paid') return false;
    const due = new Date(i.dueDate);
    return due < new Date();
  }).reduce((sum, inv) => sum + inv.amount, 0);

  const confirmedToday = invoices.filter(i => {
    const today = new Date().toISOString().slice(0, 10);
    return i.issueDate === today;
  }).length;

  return (
    <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500">Invoices & Payments</h1>
              <p className="text-xs text-muted-foreground">Manage and email customer transaction receipts</p>
            </div>
          </div>
          <Button onClick={fetchOrdersAsInvoices} size="sm" className="bg-primary text-white font-semibold">
            <RotateCcw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={TrendingUp}
            iconColor="text-emerald-500"
            trend={{ value: 18.2, isPositive: true }}
          />
          <StatsCard
            title="Pending Receivables"
            value={`$${pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={DollarSign}
            iconColor="text-blue-500"
          />
          <StatsCard
            title="Overdue Invoices"
            value={`$${overdueAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={XCircle}
            iconColor="text-rose-500"
          />
          <StatsCard
            title="Orders Placed Today"
            value={String(confirmedToday)}
            icon={CheckCircle}
            iconColor="text-emerald-500"
          />
        </div>

        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList className="bg-white dark:bg-slate-900 border border-border p-1 rounded-lg">
            <TabsTrigger value="invoices" className="px-4 py-1.5 text-xs rounded-md">Invoices List</TabsTrigger>
            <TabsTrigger value="reports" className="px-4 py-1.5 text-xs rounded-md">Financial Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-4 animate-in fade-in duration-200">
            <Card className="border border-border bg-white dark:bg-slate-900 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Customer Invoices</CardTitle>
                <CardDescription>Track client payments, download receipts, and send statements</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-xs text-muted-foreground">Loading accounting data...</p>
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    No order transactions found in the database.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-border/60 rounded-lg">
                    <Table>
                      <TableHeader className="bg-slate-50 dark:bg-slate-800">
                        <TableRow>
                          <TableHead className="font-semibold text-xs">Invoice #</TableHead>
                          <TableHead className="font-semibold text-xs">Customer</TableHead>
                          <TableHead className="font-semibold text-xs">Order #</TableHead>
                          <TableHead className="font-semibold text-xs text-right">Amount</TableHead>
                          <TableHead className="font-semibold text-xs">Issue Date</TableHead>
                          <TableHead className="font-semibold text-xs">Due Date</TableHead>
                          <TableHead className="font-semibold text-xs">Status</TableHead>
                          <TableHead className="font-semibold text-xs text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <TableRow key={invoice.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <TableCell className="font-mono text-xs font-semibold text-primary">{invoice.invoiceNumber}</TableCell>
                            <TableCell className="font-medium text-xs">{invoice.customerName}</TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">{invoice.orderNumber}</TableCell>
                            <TableCell className="text-right font-semibold text-xs">${invoice.amount.toFixed(2)}</TableCell>
                            <TableCell className="text-xs">{invoice.issueDate}</TableCell>
                            <TableCell className="text-xs">{invoice.dueDate}</TableCell>
                            <TableCell>
                              {invoice.status === 'paid' ? (
                                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0 text-[10px] font-bold py-0.5">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  PAID
                                </Badge>
                              ) : (
                                <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-0 text-[10px] font-bold py-0.5 animate-pulse">
                                  SENT
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => openInvoiceDetails(invoice)}
                                  className="h-8 text-xs font-semibold"
                                >
                                  <Eye className="h-3.5 w-3.5 mr-1" /> View
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleSendInvoice(invoice)}
                                  disabled={sendingInvoiceId === invoice.id}
                                  className="h-8 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                  {sendingInvoiceId === invoice.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <>
                                      <Send className="h-3.5 w-3.5 mr-1" /> Send
                                    </>
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4 animate-in fade-in duration-200">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="bg-white dark:bg-slate-900 border border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Breakdowns</CardTitle>
                  <CardDescription>Visual summary of total completed invoicing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 font-sans">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Total Invoiced Amount</span>
                      <span className="font-semibold text-sm">${(totalRevenue + pendingAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Settled Cashflow (PAID)</span>
                      <span className="font-semibold text-emerald-600 text-sm">${totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <span className="text-xs font-medium">Pending Recovery</span>
                      <span className="font-bold text-base text-blue-600">${pendingAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-900 border border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Payment Methods Distribution</CardTitle>
                  <CardDescription>Types of checkout selected by customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>PayPal Sandbox</span>
                        <span className="font-medium">60%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Credit Cards</span>
                        <span className="font-medium">30%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Other (COD/Bank Transfer)</span>
                        <span className="font-medium">10%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Invoice Details Dialog Modal Popup */}
      {invoiceModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-border bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Invoice Summary Proof
                </h3>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">Assigned to: {selectedInvoice.customerEmail}</p>
              </div>
              <button 
                onClick={() => setInvoiceModalOpen(false)}
                className="h-8 w-8 rounded-full border border-border bg-background hover:bg-muted text-muted-foreground flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[450px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 text-xs leading-normal">
                <div>
                  <p className="text-muted-foreground uppercase font-bold text-[9px] tracking-wider mb-1">Company Details</p>
                  <p className="font-bold text-sm text-foreground">PrintFlow Studio Inc.</p>
                  <p className="text-muted-foreground">123 Innovation Drive, Suite 100</p>
                  <p className="text-muted-foreground">Silicon Valley, CA 94025</p>
                  <p className="text-muted-foreground">support@printflow.com</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground uppercase font-bold text-[9px] tracking-wider mb-1">Invoice Info</p>
                  <p className="font-semibold text-primary font-mono text-sm">{selectedInvoice.invoiceNumber}</p>
                  <p className="text-muted-foreground">Order Ref: <span className="font-mono">{selectedInvoice.orderNumber}</span></p>
                  <p className="text-muted-foreground">Issue Date: {selectedInvoice.issueDate}</p>
                  <p className="text-muted-foreground">Due Date: {selectedInvoice.dueDate}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4 text-xs leading-normal">
                <p className="text-muted-foreground uppercase font-bold text-[9px] tracking-wider mb-1">Bill To Client</p>
                <p className="font-bold text-foreground">{selectedInvoice.customerName}</p>
                <p className="text-muted-foreground">{selectedInvoice.customerEmail}</p>
              </div>

              {/* Items Breakdown Table */}
              <div className="border border-border/80 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 border-b border-border">
                      <th className="p-3 font-semibold">Ordered Print Item</th>
                      <th className="p-3 font-semibold text-center">Qty</th>
                      <th className="p-3 font-semibold text-right">Unit Price</th>
                      <th className="p-3 font-semibold text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.rawOrder.items && selectedInvoice.rawOrder.items.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b border-border last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                        <td className="p-3">
                          <p className="font-semibold text-foreground">{item.product?.name || 'Custom Printed Asset'}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">SKU: {item.product?.sku || 'N/A'}</p>
                        </td>
                        <td className="p-3 text-center font-mono">{item.quantity}</td>
                        <td className="p-3 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                        <td className="p-3 text-right font-mono font-semibold">${item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Invoicing Breakdown Details */}
              <div className="flex justify-end pt-2 text-xs leading-normal">
                <div className="w-64 space-y-2 border-t border-border/60 pt-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span className="font-mono">${(selectedInvoice.rawOrder.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (GST/VAT):</span>
                    <span className="font-mono">${(selectedInvoice.rawOrder.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping Charges:</span>
                    <span className="font-mono">${(selectedInvoice.rawOrder.shipping || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-foreground pt-2 border-t border-border">
                    <span>Total Invoice:</span>
                    <span className="font-mono text-primary">${(selectedInvoice.amount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={`border-0 text-[10px] font-bold ${
                  selectedInvoice.status === 'paid' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                }`}>
                  Status: {selectedInvoice.status.toUpperCase()}
                </Badge>
                <p className="text-[10px] text-muted-foreground font-mono uppercase">Payment Method: {selectedInvoice.rawOrder.allowedPaymentMethod?.toUpperCase()}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setInvoiceModalOpen(false)}
                >
                  Close Proof
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleSendInvoice(selectedInvoice)}
                  disabled={sendingInvoiceId === selectedInvoice.id}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  {sendingInvoiceId === selectedInvoice.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-1.5" /> Email Invoice
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}