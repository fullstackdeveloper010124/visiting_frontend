import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface UpdateProductPageProps {
  onMenuClick?: () => void;
}

export function UpdateProductPage({ onMenuClick }: UpdateProductPageProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader onMenuClick={onMenuClick} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Update Product</h1>
            <p className="text-muted-foreground mt-2">Modify existing product details and configurations.</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Update your product information here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Product</label>
                <Input placeholder="Enter product name or SKU..." />
              </div>
              <Button>Search</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
