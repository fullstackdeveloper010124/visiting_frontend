import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { StatusBadge, StockStatus } from './StatusBadge';
import { Search, Plus, Edit, TrendingDown, TrendingUp, Package } from 'lucide-react';
import { useState } from 'react';

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

interface InventoryPageProps {
  onMenuClick?: () => void;
}

export function InventoryPage({ onMenuClick }: InventoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const inventory: InventoryItem[] = [
    {
      id: '1',
      name: 'Premium Card Stock (White)',
      category: 'Paper',
      sku: 'PCS-WHT-001',
      stock: 25000,
      minStock: 10000,
      unit: 'sheets',
      status: 'in-stock',
      lastRestocked: '2024-01-15'
    },
    {
      id: '2',
      name: 'Matte Business Cards',
      category: 'Cards',
      sku: 'MBC-001',
      stock: 8500,
      minStock: 10000,
      unit: 'units',
      status: 'low-stock',
      lastRestocked: '2024-01-20'
    },
    {
      id: '3',
      name: 'Letterhead Paper (A4)',
      category: 'Paper',
      sku: 'LHP-A4-001',
      stock: 0,
      minStock: 5000,
      unit: 'sheets',
      status: 'out-of-stock',
      lastRestocked: '2024-01-10'
    },
    {
      id: '4',
      name: 'Envelope Stock (Standard)',
      category: 'Envelopes',
      sku: 'ENV-STD-001',
      stock: 15000,
      minStock: 5000,
      unit: 'units',
      status: 'in-stock',
      lastRestocked: '2024-01-25'
    },
    {
      id: '5',
      name: 'Notepad Binding Glue',
      category: 'Supplies',
      sku: 'NBG-001',
      stock: 45,
      minStock: 50,
      unit: 'bottles',
      status: 'low-stock',
      lastRestocked: '2024-01-18'
    },
    {
      id: '6',
      name: 'Premium Ink (Cyan)',
      category: 'Ink',
      sku: 'INK-CYN-001',
      stock: 120,
      minStock: 30,
      unit: 'cartridges',
      status: 'in-stock',
      lastRestocked: '2024-01-28'
    },
  ];

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

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader onMenuClick={onMenuClick} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Inventory Management</h1>
              <p className="text-muted-foreground">Manage your printing materials and supplies</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Stock</p>
                    <p className="text-2xl font-bold text-success">{stats.inStock}</p>
                  </div>
                  <div className="p-3 bg-success/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Low Stock</p>
                    <p className="text-2xl font-bold text-warning">{stats.lowStock}</p>
                  </div>
                  <div className="p-3 bg-warning/10 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Out of Stock</p>
                    <p className="text-2xl font-bold text-destructive">{stats.outOfStock}</p>
                  </div>
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <Package className="h-5 w-5 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Inventory Items</CardTitle>
                  <CardDescription>Manage stock levels and materials</CardDescription>
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
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Item Name</TableHead>
                      <TableHead className="font-semibold">SKU</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Stock</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Last Restocked</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{item.sku}</code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">
                              {item.stock.toLocaleString()} {item.unit}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Min: {item.minStock.toLocaleString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {item.lastRestocked}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
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
                  <h3 className="font-semibold text-lg text-foreground mb-2">No items found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search query
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}