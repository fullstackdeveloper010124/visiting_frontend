import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FileText, Search, Filter, Download, Menu, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { StatsCard } from './StatsCard';

interface AuditLogsPageProps {
  onMenuClick?: () => void;
}

export function AuditLogsPage({ onMenuClick }: AuditLogsPageProps) {
  const auditLogs = [
    { id: 1, user: 'john.smith@company.com', action: 'CREATE', entityType: 'Order', entityId: 'ORD-2024-1245', changes: { status: 'pending', total: 2450.00 }, ipAddress: '192.168.1.100', timestamp: '2026-02-28 09:30:15', status: 'success' },
    { id: 2, user: 'sarah.j@company.com', action: 'UPDATE', entityType: 'Inventory', entityId: 'INV-BC-001', changes: { quantity_available: { from: 1250, to: 1750 } }, ipAddress: '192.168.1.101', timestamp: '2026-02-28 09:15:22', status: 'success' },
    { id: 3, user: 'mike.d@company.com', action: 'UPDATE', entityType: 'Delivery', entityId: 'DEL-2024-0345', changes: { status: { from: 'in_transit', to: 'delivered' } }, ipAddress: '192.168.1.102', timestamp: '2026-02-28 08:45:30', status: 'success' },
    { id: 4, user: 'emily.b@company.com', action: 'CREATE', entityType: 'Invoice', entityId: 'INV-2024-1001', changes: { amount: 2450.00, status: 'sent' }, ipAddress: '192.168.1.103', timestamp: '2026-02-28 08:30:45', status: 'success' },
    { id: 5, user: 'unknown@test.com', action: 'LOGIN', entityType: 'User', entityId: null, changes: null, ipAddress: '45.123.45.67', timestamp: '2026-02-28 03:22:45', status: 'failure' },
    { id: 6, user: 'robert.c@company.com', action: 'UPDATE', entityType: 'Lead', entityId: 'LEAD-2024-0234', changes: { status: { from: 'qualified', to: 'proposal' } }, ipAddress: '192.168.1.104', timestamp: '2026-02-28 02:15:30', status: 'success' },
    { id: 7, user: 'admin@company.com', action: 'UPDATE', entityType: 'User', entityId: 'USER-0045', changes: { role: { from: 'user', to: 'order_processor' } }, ipAddress: '192.168.1.1', timestamp: '2026-02-27 04:45:15', status: 'success' },
    { id: 8, user: 'lisa.a@company.com', action: 'CREATE', entityType: 'Vendor', entityId: 'VEN-2024-0012', changes: { name: 'Premium Paper Co', status: 'active' }, ipAddress: '192.168.1.105', timestamp: '2026-02-27 03:30:20', status: 'success' },
  ];

  const stats = {
    totalLogs: 1247,
    successfulActions: 1198,
    failedActions: 49,
    uniqueUsers: 45,
  };

  const actionColors: Record<string, string> = {
    CREATE: 'bg-green-500/10 text-green-700 dark:text-green-400',
    UPDATE: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    DELETE: 'bg-red-500/10 text-red-700 dark:text-red-400',
    LOGIN: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    VIEW: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  };

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
              <h1 className="text-2xl font-semibold">Audit Logs</h1>
              <p className="text-sm text-muted-foreground">System-wide activity tracking and monitoring</p>
            </div>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Logs"
            value={stats.totalLogs.toLocaleString()}
            icon={FileText}
          />
          <StatsCard
            title="Successful Actions"
            value={stats.successfulActions.toLocaleString()}
            icon={CheckCircle}
            iconColor="text-green-500"
          />
          <StatsCard
            title="Failed Actions"
            value={stats.failedActions.toString()}
            icon={XCircle}
            iconColor="text-red-500"
          />
          <StatsCard
            title="Unique Users"
            value={stats.uniqueUsers.toString()}
            icon={AlertTriangle}
            iconColor="text-blue-500"
          />
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Logs</CardTitle>
            <CardDescription>Search and filter audit trail entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search User</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="User email..." className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Action Type</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="CREATE">Create</SelectItem>
                    <SelectItem value="UPDATE">Update</SelectItem>
                    <SelectItem value="DELETE">Delete</SelectItem>
                    <SelectItem value="LOGIN">Login</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Entity Type</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entities</SelectItem>
                    <SelectItem value="Order">Orders</SelectItem>
                    <SelectItem value="User">Users</SelectItem>
                    <SelectItem value="Inventory">Inventory</SelectItem>
                    <SelectItem value="Invoice">Invoices</SelectItem>
                    <SelectItem value="Delivery">Deliveries</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failure">Failure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button>
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
              <Button variant="outline">Reset</Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Logs</TabsTrigger>
            <TabsTrigger value="security">Security Events</TabsTrigger>
            <TabsTrigger value="data">Data Changes</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>Complete system activity log</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-sm font-mono">
                            {log.timestamp}
                          </TableCell>
                          <TableCell className="text-sm">{log.user}</TableCell>
                          <TableCell>
                            <Badge className={actionColors[log.action] || 'bg-gray-500/10'}>
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-sm">{log.entityType}</div>
                              {log.entityId && (
                                <div className="text-xs text-muted-foreground font-mono">{log.entityId}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-mono">{log.ipAddress}</TableCell>
                          <TableCell>
                            {log.status === 'success' ? (
                              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Success
                              </Badge>
                            ) : (
                              <Badge className="bg-red-500/10 text-red-700 dark:text-red-400">
                                <XCircle className="h-3 w-3 mr-1" />
                                Failed
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Events</CardTitle>
                <CardDescription>Authentication and authorization events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.filter(log => log.action === 'LOGIN' || log.status === 'failure').map((log) => (
                    <div key={log.id} className={`border rounded-lg p-4 ${
                      log.status === 'failure' ? 'border-red-500/20 bg-red-500/5' : 'border-border'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium">{log.action} - {log.user}</div>
                          <div className="text-sm text-muted-foreground font-mono">IP: {log.ipAddress}</div>
                        </div>
                        {log.status === 'success' ? (
                          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Success
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-700 dark:text-red-400">
                            <XCircle className="h-3 w-3 mr-1" />
                            Failed
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{log.timestamp}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Modifications</CardTitle>
                <CardDescription>Track all data changes across the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.filter(log => log.changes !== null && log.status === 'success').map((log) => (
                    <div key={log.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium">{log.entityType} - {log.entityId}</div>
                          <div className="text-sm text-muted-foreground">by {log.user}</div>
                        </div>
                        <Badge className={actionColors[log.action]}>
                          {log.action}
                        </Badge>
                      </div>
                      <div className="bg-muted rounded p-3 mb-2">
                        <div className="text-xs font-mono">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(log.changes, null, 2)}
                          </pre>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{log.timestamp}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}