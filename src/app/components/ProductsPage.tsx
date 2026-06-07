import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { 
  Search, Filter, Package, Star, ChevronDown, 
  ArrowUp, ArrowDown, Edit, Trash, Plus, Eye, EyeOff, Loader2 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Checkbox } from './ui/checkbox';

interface Product {
  _id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  status: 'active' | 'inactive';
  displayOrder?: number;
  rating?: number;
  reviews?: number;
  popular?: boolean;
}

interface ProductsPageProps {
  onMenuClick?: () => void;
  userRole?: string;
}

export function ProductsPage({ onMenuClick, userRole }: ProductsPageProps) {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Modal dialog states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submittingForm, setSubmittingForm] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('Business Cards');
  const [formPrice, setFormPrice] = useState('49.99');
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('/images/premium_business_cards.png');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // Pass the Bearer token if it exists (so the backend knows we are admin and returns inactive items)
      const response = await fetch('/api/v1/products', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        // Enforce mock details for rating if not present in schema
        const populatedData = data.data.map((p: any) => ({
          ...p,
          rating: p.rating || 4.7,
          reviews: p.reviews || Math.floor(Math.random() * 200) + 50,
          popular: p.popular || (p.sku === 'BC-PREM' || p.sku === 'LH-CORP')
        }));
        setProductsList(populatedData);
      } else {
        setError(data.error || 'Failed to fetch catalog.');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error connecting to backend database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setFormName('');
    setFormSku('');
    setFormCategory('Business Cards');
    setFormPrice('49.99');
    setFormDesc('');
    setFormImage('/images/premium_business_cards.png');
    setFormStatus('active');
    setShowAddModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormSku(product.sku);
    setFormCategory(product.category);
    setFormPrice(product.basePrice.toString());
    setFormDesc(product.description || '');
    setFormImage(product.imageUrl || '/images/premium_business_cards.png');
    setFormStatus(product.status);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingForm(true);
    const token = localStorage.getItem('token');
    
    const bodyData = {
      name: formName,
      sku: formSku,
      category: formCategory,
      basePrice: parseFloat(formPrice),
      description: formDesc,
      imageUrl: formImage,
      status: formStatus
    };

    try {
      let response;
      if (showAddModal) {
        response = await fetch('/api/v1/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bodyData)
        });
      } else {
        response = await fetch(`/api/v1/products/${editingProduct?._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bodyData)
        });
      }

      const resData = await response.json();
      if (response.ok && resData.success) {
        closeModal();
        fetchProducts();
      } else {
        alert(resData.error || 'Failed to save product Catalog.');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error connecting to database.');
    } finally {
      setSubmittingForm(false);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    const nextStatus = product.status === 'active' ? 'inactive' : 'active';
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProductsList(prev => prev.map(p => p._id === product._id ? { ...p, status: nextStatus } : p));
      } else {
        alert(data.error || 'Failed to update visibility.');
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      alert('Connection error.');
    }
  };

  const handleMoveProduct = async (indexA: number, indexB: number) => {
    const itemA = productsList[indexA];
    const itemB = productsList[indexB];
    const token = localStorage.getItem('token');

    try {
      await Promise.all([
        fetch(`/api/v1/products/${itemA._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ displayOrder: indexB })
        }),
        fetch(`/api/v1/products/${itemB._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ displayOrder: indexA })
        })
      ]);
      fetchProducts();
    } catch (err) {
      console.error('Reorder failed:', err);
      alert('Failed to reorder products.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProductsList(prev => prev.filter(p => p._id !== id));
      } else {
        alert(data.error || 'Failed to delete product.');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Connection error.');
    }
  };

  const categories = ['all', ...Array.from(new Set(productsList.map(p => p.category)))];

  const filteredProducts = productsList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
                          
    let matchesCategory = true;
    if (userRole === 'user') {
      matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    } else {
      matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader onMenuClick={onMenuClick} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Products Catalog</h1>
              <p className="text-sm md:text-base text-muted-foreground">Browse our complete range of custom printing products</p>
            </div>
            {userRole === 'super_user' && (
              <Button onClick={openAddModal} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-colors">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            )}
          </div>

          {/* Filters */}
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-input-background"
                  />
                </div>
                {userRole === 'user' ? (
                  <Popover>
                    <PopoverTrigger className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input shadow-sm hover:bg-accent h-9 px-4 py-2 w-full sm:w-[200px] justify-between bg-input-background font-normal">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        {selectedCategories.length === 0 ? 'All Categories' : `${selectedCategories.length} Selected`}
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-3" align="end">
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Categories</h4>
                        <div className="h-px bg-border" />
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="category-all" 
                              checked={selectedCategories.length === 0}
                              onCheckedChange={(checked) => {
                                if (checked) setSelectedCategories([]);
                              }}
                            />
                            <label htmlFor="category-all" className="text-sm font-medium leading-none cursor-pointer flex-1">
                              All Categories
                            </label>
                          </div>
                          {categories.filter(c => c !== 'all').map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`category-${category}`} 
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedCategories([...selectedCategories, category]);
                                  } else {
                                    setSelectedCategories(selectedCategories.filter(c => c !== category));
                                  }
                                }}
                              />
                              <label htmlFor={`category-${category}`} className="text-sm font-medium leading-none cursor-pointer flex-1">
                                {category}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[200px] bg-input-background">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.filter(c => c !== 'all').map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Loader or Error status */}
          {loading && productsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
              <p className="text-sm text-muted-foreground">Loading catalog...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-destructive bg-destructive/10 border border-destructive/25 rounded-md">
              {error}
            </div>
          ) : (
            /* Products Grid */
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, idx) => (
                <Card key={product._id} className={`shadow-sm hover:shadow-md transition-all group flex flex-col justify-between ${product.status === 'inactive' ? 'opacity-65' : ''}`}>
                  <CardHeader className="p-0 relative">
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg relative overflow-hidden">
                      <ImageWithFallback
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.popular && (
                        <Badge className="absolute top-3 right-3 bg-warning text-warning-foreground">
                          Popular
                        </Badge>
                      )}
                      {product.status === 'inactive' && (
                        <Badge className="absolute top-3 left-3 bg-slate-800 text-white font-bold">
                          Hidden
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{product.category}</span>
                          <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{product.sku}</span>
                        </div>
                        <h3 className="font-semibold text-base md:text-lg text-foreground group-hover:text-primary transition-colors">
                          {product.name === 'Premium Business Cards' ? (
                            <Link to="/customize" className="hover:underline">{product.name}</Link>
                          ) : product.name === 'Corporate Letterheads' ? (
                            <Link to="/customize-letterheads" className="hover:underline">{product.name}</Link>
                          ) : product.name === 'Custom Envelopes' ? (
                            <Link to="/customize-envelopes" className="hover:underline">{product.name}</Link>
                          ) : product.name === 'Designer Notepads' ? (
                            <Link to="/customize-notepads" className="hover:underline">{product.name}</Link>
                          ) : product.name === 'Presentation Folders' ? (
                            <Link to="/customize-folders" className="hover:underline">{product.name}</Link>
                          ) : product.name === 'Compliment Slips' ? (
                            <Link to="/customize-slips" className="hover:underline">{product.name}</Link>
                          ) : (
                            product.name
                          )}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="text-sm font-medium text-foreground">{product.rating}</span>
                        </div>
                        <span className="text-xs md:text-sm text-muted-foreground">({product.reviews} reviews)</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none mb-1">Base Price</p>
                          <span className="text-lg font-bold text-foreground">${product.basePrice.toFixed(2)}</span>
                        </div>
                        
                        {userRole !== 'super_user' ? (
                          <Link to={
                            product.name === 'Corporate Letterheads' ? "/customize-letterheads" : 
                            product.name === 'Custom Envelopes' ? "/customize-envelopes" : 
                            product.name === 'Designer Notepads' ? "/customize-notepads" : 
                            product.name === 'Presentation Folders' ? "/customize-folders" : 
                            product.name === 'Compliment Slips' ? "/customize-slips" : 
                            "/customize"
                          }>
                            <Button size="sm">
                              Customize
                            </Button>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                              onClick={() => openEditModal(product)}
                              title="Edit Details"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className={`h-8 w-8 ${product.status === 'active' ? 'text-slate-600 hover:text-slate-700' : 'text-emerald-600 hover:text-emerald-700'}`}
                              onClick={() => handleToggleStatus(product)}
                              title={product.status === 'active' ? 'Hide (Set Inactive)' : 'Show (Set Active)'}
                            >
                              {product.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              disabled={idx === 0}
                              className="h-8 w-8 text-slate-600"
                              onClick={() => handleMoveProduct(idx, idx - 1)}
                              title="Move Up"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              disabled={idx === filteredProducts.length - 1}
                              className="h-8 w-8 text-slate-600"
                              onClick={() => handleMoveProduct(idx, idx + 1)}
                              title="Move Down"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="destructive" 
                              className="h-8 w-8"
                              onClick={() => handleDeleteProduct(product._id)}
                              title="Delete Product"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && !loading && (
            <Card className="shadow-sm">
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg text-foreground mb-2">No products found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Add/Edit Product Modal Dialog Overlay */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg shadow-2xl border-border bg-background">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-500" />
                {showAddModal ? 'Add New Product' : 'Edit Product Details'}
              </CardTitle>
              <CardDescription>
                Configure specifications for print catalog items.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleFormSubmit}>
              <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="prodName">Product Name</Label>
                    <Input id="prodName" required value={formName} onChange={e => setFormName(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="prodSku">SKU Code</Label>
                    <Input id="prodSku" required placeholder="e.g. BC-PREM" value={formSku} onChange={e => setFormSku(e.target.value)} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="prodCategory">Category</Label>
                    <Select value={formCategory} onValueChange={setFormCategory}>
                      <SelectTrigger id="prodCategory">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Business Cards">Business Cards</SelectItem>
                        <SelectItem value="Letterheads">Letterheads</SelectItem>
                        <SelectItem value="Envelopes">Envelopes</SelectItem>
                        <SelectItem value="Notepads">Notepads</SelectItem>
                        <SelectItem value="Folders">Folders</SelectItem>
                        <SelectItem value="Slips">Slips</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="prodPrice">Base Price ($)</Label>
                    <Input id="prodPrice" type="number" step="0.01" required value={formPrice} onChange={e => setFormPrice(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="prodDesc">Description</Label>
                  <Input id="prodDesc" value={formDesc} onChange={e => setFormDesc(e.target.value)} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prodImage">Product Image Presets</Label>
                  <Select value={formImage} onValueChange={setFormImage}>
                    <SelectTrigger id="prodImage">
                      <SelectValue placeholder="Select Image Presets" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="/images/premium_business_cards.png">Premium Business Cards</SelectItem>
                      <SelectItem value="/images/corporate_letterheads.png">Corporate Letterheads</SelectItem>
                      <SelectItem value="/images/custom_envelopes.png">Custom Envelopes</SelectItem>
                      <SelectItem value="/images/designer_notepads.png">Designer Notepads</SelectItem>
                      <SelectItem value="/images/presentation_folders.png">Presentation Folders</SelectItem>
                      <SelectItem value="/images/compliment_slips.png">Compliment Slips</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground mt-1">Or enter a custom URL:</p>
                  <Input value={formImage} onChange={e => setFormImage(e.target.value)} placeholder="Custom Image URL" />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="prodStatus">Status Visibility</Label>
                  <Select value={formStatus} onValueChange={v => setFormStatus(v as 'active' | 'inactive')}>
                    <SelectTrigger id="prodStatus">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active (Visible to users)</SelectItem>
                      <SelectItem value="inactive">Inactive (Hidden from users)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submittingForm} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {submittingForm ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 'Save Product'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}