import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Building2, Package, DollarSign, FileText, CheckCircle, XCircle, Menu, Star } from 'lucide-react';
import { StatsCard } from './StatsCard';

interface ProcurementDashboardProps {
  onMenuClick?: () => void;
}

export function ProcurementDashboard({ onMenuClick }: ProcurementDashboardProps) {
  const vendors = [
    { id: 1, name: 'Premium Paper Co', contactPerson: 'Robert Chen', email: 'robert@premiump.com', phone: '+1 555-0201', status: 'active', rating: 4.8, products: 12, contractExpiry: '2026-09-15' },
    { id: 2, name: 'Quality Print Supplies', contactPerson: 'Lisa Anderson', email: 'lisa@qps.com', phone: '+1 555-0202', status: 'active', rating: 4.5, products: 8, contractExpiry: '2026-07-20' },
    { id: 3, name: 'Global Stationery Inc', contactPerson: 'David Kumar', email: 'david@globalstat.com', phone: '+1 555-0203', status: 'inactive', rating: 3.9, products: 5, contractExpiry: '2026-02-10' },
    { id: 4, name: 'Eco Office Solutions', contactPerson: 'Emma Wilson', email: 'emma@ecooffice.com', phone: '+1 555-0204', status: 'active', rating: 4.9, products: 15, contractExpiry: '2027-01-30' },
  ];

  const vendorPricing = [
    { id: 1, vendor: 'Premium Paper Co', product: 'Business Cards Premium', costPrice: 12.50, moq: 100, leadTime: 5, effectiveFrom: '2026-01-01' },
    { id: 2, vendor: 'Quality Print Supplies', product: 'Letterhead A4', costPrice: 8.75, moq: 250, leadTime: 3, effectiveFrom: '2026-01-01' },
    { id: 3, vendor: 'Premium Paper Co', product: 'Envelopes DL', costPrice: 6.20, moq: 500, leadTime: 7, effectiveFrom: '2026-01-15' },
    { id: 4, vendor: 'Eco Office Solutions', product: 'Recycled Notepads', costPrice: 4.50, moq: 200, leadTime: 4, effectiveFrom: '2026-02-01' },
  ];

  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const inactiveVendors = vendors.filter(v => v.status === 'inactive').length;
  const totalProducts = vendors.reduce((sum, v) => sum + v.products, 0);

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
              <h1 className="text-2xl font-semibold">Procurement & Vendor Management</h1>
              <p className="text-sm text-muted-foreground">Manage vendors and product pricing</p>
            </div>
          </div>
          <Button>
            <Building2 className="h-4 w-4 mr-2" />
            Onboard Vendor
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Active Vendors"
            value={activeVendors.toString()}
            icon={Building2}
            iconColor="text-green-500"
          />
          <StatsCard
            title="Inactive Vendors"
            value={inactiveVendors.toString()}
            icon={XCircle}
            iconColor="text-red-500"
          />
          <StatsCard
            title="Total Products"
            value={totalProducts.toString()}
            icon={Package}
          />
          <StatsCard
            title="Avg. Rating"
            value="4.5"
            icon={Star}
            iconColor="text-yellow-500"
          />
        </div>

        <Tabs defaultValue="vendors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="pricing">Product Pricing</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
          </TabsList>

          <TabsContent value="vendors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Directory</CardTitle>
                <CardDescription>Manage supplier relationships and information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor Name</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Contract Expiry</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendors.map((vendor) => (
                        <TableRow key={vendor.id}>
                          <TableCell className="font-medium">{vendor.name}</TableCell>
                          <TableCell>{vendor.contactPerson}</TableCell>
                          <TableCell className="text-sm">
                            <div>{vendor.email}</div>
                            <div className="text-muted-foreground">{vendor.phone}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              <span className="font-medium">{vendor.rating}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{vendor.products} items</Badge>
                          </TableCell>
                          <TableCell>
                            {vendor.status === 'active' ? (
                              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge className="bg-red-500/10 text-red-700 dark:text-red-400">
                                <XCircle className="h-3 w-3 mr-1" />
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(vendor.contractExpiry) < new Date('2026-06-01') ? (
                              <span className="text-yellow-600">{new Date(vendor.contractExpiry).toLocaleDateString()}</span>
                            ) : (
                              <span>{new Date(vendor.contractExpiry).toLocaleDateString()}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline">Edit</Button>
                              <Button size="sm" variant="outline">View</Button>
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

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Product Pricing</CardTitle>
                <CardDescription>Manage cost prices and vendor pricing terms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Cost Price</TableHead>
                        <TableHead className="text-right">MOQ</TableHead>
                        <TableHead className="text-right">Lead Time</TableHead>
                        <TableHead>Effective From</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendorPricing.map((pricing) => (
                        <TableRow key={pricing.id}>
                          <TableCell className="font-medium">{pricing.vendor}</TableCell>
                          <TableCell>{pricing.product}</TableCell>
                          <TableCell className="text-right font-semibold">
                            ${pricing.costPrice.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">{pricing.moq} units</TableCell>
                          <TableCell className="text-right">{pricing.leadTime} days</TableCell>
                          <TableCell className="text-sm">
                            {new Date(pricing.effectiveFrom).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline">Edit</Button>
                              <Button size="sm" variant="outline">History</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4">
                  <Button>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Add New Pricing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Contracts</CardTitle>
                <CardDescription>Track vendor agreements and contract terms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendors.map((vendor) => (
                    <div key={vendor.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <div className="font-semibold">{vendor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Contact: {vendor.contactPerson}
                          </div>
                        </div>
                        {vendor.status === 'active' ? (
                          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-700 dark:text-red-400">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Products: </span>
                          <span className="font-medium">{vendor.products}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rating: </span>
                          <span className="font-medium flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            {vendor.rating}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Contract Expiry: </span>
                          <span className={`font-medium ${
                            new Date(vendor.contractExpiry) < new Date('2026-06-01') ? 'text-yellow-600' : ''
                          }`}>
                            {new Date(vendor.contractExpiry).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-border">
                        <Button size="sm" variant="outline" className="flex-1">
                          <FileText className="h-4 w-4 mr-2" />
                          View Contract
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">Upload Document</Button>
                        {new Date(vendor.contractExpiry) < new Date('2026-06-01') && (
                          <Button size="sm" className="flex-1">Renew</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Performance</CardTitle>
            <CardDescription>Key metrics and performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">On-Time Delivery Rate</div>
                <div className="text-2xl font-semibold">94.5%</div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '94.5%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Quality Score</div>
                <div className="text-2xl font-semibold">4.5/5.0</div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Cost Efficiency</div>
                <div className="text-2xl font-semibold">88%</div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}