import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileText, Upload, AlertTriangle, CheckCircle, Calendar, Building2, Menu } from 'lucide-react';
import { StatsCard } from './StatsCard';

interface FinanceContractsDashboardProps {
  onMenuClick?: () => void;
}

export function FinanceContractsDashboard({ onMenuClick }: FinanceContractsDashboardProps) {
  const contracts = [
    { id: 1, contractNumber: 'CNT-2024-001', partyType: 'client', partyName: 'Acme Corporation', title: 'Annual Stationery Supply Agreement', startDate: '2026-01-01', endDate: '2026-12-31', value: 85000, status: 'active', daysUntilExpiry: 307 },
    { id: 2, contractNumber: 'CNT-2024-002', partyType: 'client', partyName: 'Tech Solutions Inc', title: 'Quarterly Business Card Contract', startDate: '2026-01-15', endDate: '2026-04-15', value: 12000, status: 'expiring', daysUntilExpiry: 46 },
    { id: 3, contractNumber: 'CNT-2024-003', partyType: 'client', partyName: 'Global Enterprises', title: 'Marketing Materials Agreement', startDate: '2025-06-01', endDate: '2026-05-31', value: 125000, status: 'active', daysUntilExpiry: 92 },
    { id: 4, contractNumber: 'CNT-2023-045', partyType: 'client', partyName: 'StartupHub Co', title: 'Startup Package Deal', startDate: '2023-03-01', endDate: '2026-02-28', value: 15000, status: 'expired', daysUntilExpiry: 0 },
  ];

  const activeCount = contracts.filter(c => c.status === 'active').length;
  const expiringCount = contracts.filter(c => c.status === 'expiring').length;
  const expiredCount = contracts.filter(c => c.status === 'expired').length;
  const totalValue = contracts.filter(c => c.status === 'active' || c.status === 'expiring').reduce((sum, c) => sum + c.value, 0);

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
              <h1 className="text-2xl font-semibold">Contract Management</h1>
              <p className="text-sm text-muted-foreground">Manage client and vendor contracts</p>
            </div>
          </div>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Contract
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Active Contracts"
            value={activeCount.toString()}
            icon={FileText}
            iconColor="text-green-500"
          />
          <StatsCard
            title="Expiring Soon"
            value={expiringCount.toString()}
            icon={AlertTriangle}
            iconColor="text-yellow-500"
          />
          <StatsCard
            title="Expired"
            value={expiredCount.toString()}
            icon={Calendar}
            iconColor="text-red-500"
          />
          <StatsCard
            title="Total Contract Value"
            value={`$${(totalValue / 1000).toFixed(0)}K`}
            icon={Building2}
            iconColor="text-blue-500"
          />
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Contracts</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contract Portfolio</CardTitle>
                <CardDescription>All client and vendor contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contract #</TableHead>
                        <TableHead>Party</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell className="font-mono text-sm">{contract.contractNumber}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{contract.partyName}</div>
                              <div className="text-sm text-muted-foreground capitalize">{contract.partyType}</div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate">{contract.title}</div>
                          </TableCell>
                          <TableCell className="text-sm">{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-sm">{new Date(contract.endDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right font-semibold">${contract.value.toLocaleString()}</TableCell>
                          <TableCell>
                            {contract.status === 'active' && (
                              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                            {contract.status === 'expiring' && (
                              <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Expiring Soon
                              </Badge>
                            )}
                            {contract.status === 'expired' && (
                              <Badge className="bg-red-500/10 text-red-700 dark:text-red-400">
                                Expired
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline">View</Button>
                              {contract.status !== 'expired' && (
                                <Button size="sm" variant="outline">
                                  <Upload className="h-4 w-4" />
                                </Button>
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

          <TabsContent value="expiring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expiring Contracts</CardTitle>
                <CardDescription>Contracts expiring within 60 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contracts.filter(c => c.status === 'expiring' && c.daysUntilExpiry <= 60).map((contract) => (
                    <div key={contract.id} className="border border-yellow-500/20 bg-yellow-500/5 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <div className="font-semibold">{contract.partyName}</div>
                          <div className="text-sm text-muted-foreground">{contract.title}</div>
                          <div className="text-sm text-muted-foreground font-mono">{contract.contractNumber}</div>
                        </div>
                        <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {contract.daysUntilExpiry} days left
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">End Date: </span>
                          <span className="font-medium">{new Date(contract.endDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Value: </span>
                          <span className="font-medium">${contract.value.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-border">
                        <Button size="sm" className="flex-1">Renew Contract</Button>
                        <Button size="sm" variant="outline">Contact Client</Button>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expired" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expired Contracts</CardTitle>
                <CardDescription>Contracts that have reached their end date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contracts.filter(c => c.status === 'expired').map((contract) => (
                    <div key={contract.id} className="border border-red-500/20 bg-red-500/5 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <div className="font-semibold">{contract.partyName}</div>
                          <div className="text-sm text-muted-foreground">{contract.title}</div>
                          <div className="text-sm text-muted-foreground font-mono">{contract.contractNumber}</div>
                        </div>
                        <Badge className="bg-red-500/10 text-red-700 dark:text-red-400">
                          Expired
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Expired: </span>
                          <span className="font-medium">{new Date(contract.endDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Original Value: </span>
                          <span className="font-medium">${contract.value.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-border">
                        <Button size="sm" className="flex-1">Create Renewal</Button>
                        <Button size="sm" variant="outline">Archive</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contract Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Document Management</CardTitle>
            <CardDescription>Upload and manage contract documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">Upload Contract Documents</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop files here or click to browse
              </p>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}