import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileText, DollarSign, CreditCard, XCircle, RotateCcw, TrendingUp, CheckCircle, Menu } from 'lucide-react';
import { StatsCard } from './StatsCard';

interface AccountingDashboardProps {
  onMenuClick?: () => void;
}

export function AccountingDashboard({ onMenuClick }: AccountingDashboardProps) {
  const invoices = [
    { id: 1, invoiceNumber: 'INV-2024-1001', orderNumber: 'ORD-2024-1245', customer: 'Acme Corporation', amount: 2450.00, status: 'sent', dueDate: '2026-03-15', issueDate: '2026-02-15' },
    { id: 2, invoiceNumber: 'INV-2024-1002', orderNumber: 'ORD-2024-1246', customer: 'Tech Solutions Inc', amount: 1850.00, status: 'paid', dueDate: '2026-03-10', issueDate: '2026-02-10' },
    { id: 3, invoiceNumber: 'INV-2024-1003', orderNumber: 'ORD-2024-1247', customer: 'Global Enterprises', amount: 3200.00, status: 'overdue', dueDate: '2026-02-20', issueDate: '2026-01-20' },
    { id: 4, invoiceNumber: 'INV-2024-1004', orderNumber: 'ORD-2024-1248', customer: 'StartupHub Co', amount: 890.00, status: 'draft', dueDate: '2026-03-20', issueDate: '2026-02-20' },
  ];

  const payments = [
    { id: 1, transactionId: 'TXN-8734567', invoiceNumber: 'INV-2024-1002', customer: 'Tech Solutions Inc', amount: 1850.00, method: 'Bank Transfer', status: 'confirmed', date: '2026-02-25' },
    { id: 2, transactionId: 'TXN-8734568', invoiceNumber: 'INV-2024-0998', customer: 'Design Studio', amount: 1200.00, method: 'Credit Card', status: 'confirmed', date: '2026-02-24' },
    { id: 3, transactionId: 'TXN-8734569', invoiceNumber: 'INV-2024-0995', customer: 'Marketing Agency', amount: 950.00, method: 'Check', status: 'pending', date: '2026-02-23' },
  ];

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0) + 2150;
  const pendingAmount = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="flex-1 overflow-auto bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
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
              <h1 className="text-2xl font-semibold">Accounting</h1>
              <p className="text-sm text-muted-foreground">Manage invoices and payments</p>
            </div>
          </div>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={TrendingUp}
            iconColor="text-green-500"
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatsCard
            title="Pending Payments"
            value={`$${pendingAmount.toLocaleString()}`}
            icon={DollarSign}
            iconColor="text-blue-500"
          />
          <StatsCard
            title="Overdue"
            value={`$${overdueAmount.toLocaleString()}`}
            icon={XCircle}
            iconColor="text-red-500"
          />
          <StatsCard
            title="Confirmed Today"
            value="3"
            icon={CheckCircle}
            iconColor="text-green-500"
          />
        </div>

        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="reports">Financial Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Manage and track customer invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Order #</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-mono text-sm">{invoice.invoiceNumber}</TableCell>
                          <TableCell className="font-medium">{invoice.customer}</TableCell>
                          <TableCell className="font-mono text-sm text-muted-foreground">{invoice.orderNumber}</TableCell>
                          <TableCell className="text-right font-semibold">${invoice.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-sm">{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {invoice.status === 'paid' && (
                              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Paid
                              </Badge>
                            )}
                            {invoice.status === 'sent' && (
                              <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                                Sent
                              </Badge>
                            )}
                            {invoice.status === 'overdue' && (
                              <Badge className="bg-red-500/10 text-red-700 dark:text-red-400">
                                <XCircle className="h-3 w-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                            {invoice.status === 'draft' && (
                              <Badge variant="outline">Draft</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline">View</Button>
                              {invoice.status === 'draft' && (
                                <Button size="sm">Send</Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Transactions</CardTitle>
                <CardDescription>Confirm, cancel, or reverse payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{payment.customer}</span>
                            {payment.status === 'confirmed' ? (
                              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Confirmed
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                                Pending
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {payment.invoiceNumber} · {payment.transactionId}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">${payment.amount.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{payment.method}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {new Date(payment.date).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          {payment.status === 'pending' && (
                            <Button size="sm">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirm Payment
                            </Button>
                          )}
                          {payment.status === 'confirmed' && (
                            <>
                              <Button size="sm" variant="outline">
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                              <Button size="sm" variant="outline">
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Reverse
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Summary</CardTitle>
                  <CardDescription>Monthly revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">January 2026</span>
                      <span className="font-semibold">$45,200</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">February 2026 (MTD)</span>
                      <span className="font-semibold">$38,950</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-sm font-medium">Total YTD</span>
                      <span className="font-semibold text-lg">$84,150</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Full Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Distribution by payment type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Bank Transfer</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Credit Card</span>
                        <span className="font-medium">35%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Check</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}