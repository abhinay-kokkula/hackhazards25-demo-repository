
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { Trash2, Loader2, PlusCircle, PackageCheck, ShoppingCart, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from "@/components/ImageUpload";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SellerDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  // Form state
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productLocation, setProductLocation] = useState("");
  const [isOrganic, setIsOrganic] = useState(false);
  const [productImage, setProductImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (user) {
      fetchSellerProducts();
      fetchSellerOrders();
    }
  }, [user]);

  const fetchSellerProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", user?.id);
      
      if (error) throw error;
      
      setProducts(data || []);
      setDashboardStats(prev => ({
        ...prev,
        totalProducts: data?.length || 0,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchSellerOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("seller_id", user?.id);
      
      if (error) throw error;
      
      setOrders(data || []);
      setDashboardStats(prev => {
        const totalRevenue = (data || []).reduce((sum, order) => sum + order.total_amount, 0);
        return {
          ...prev,
          totalOrders: data?.length || 0,
          totalRevenue,
        };
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!productName || !productDescription || !productPrice || !productCategory) {
        toast.error("Please fill all required fields");
        return;
      }
      
      const priceValue = parseFloat(productPrice);
      if (isNaN(priceValue) || priceValue <= 0) {
        toast.error("Please enter a valid price");
        return;
      }
      
      // Create product object
      const productData = {
        name: productName,
        description: productDescription,
        price: priceValue,
        category: productCategory,
        location: productLocation,
        is_organic: isOrganic,
        seller_id: user?.id,
        images: productImage ? [productImage] : [],
      };
      
      const { data, error } = await supabase
        .from("products")
        .insert(productData)
        .select();
      
      if (error) throw error;
      
      // Refresh product list
      fetchSellerProducts();
      
      // Clear form
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductCategory("");
      setProductLocation("");
      setIsOrganic(false);
      setProductImage("");
      
      toast.success("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
        
      if (error) throw error;
      
      // Remove from local state
      setProducts(products.filter(p => p.id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 bg-muted/20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>
          
          <Tabs defaultValue="dashboard" className="space-y-8">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 size={16} />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <PackageCheck size={16} />
                <span>Products</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingCart size={16} />
                <span>Orders</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Dashboard Overview */}
            <TabsContent value="dashboard" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Products Listed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${dashboardStats.totalRevenue.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Products Management */}
            <TabsContent value="products">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Add New Product</CardTitle>
                    <CardDescription>Create a new product to sell</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleCreateProduct}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="product-name">Product Name</Label>
                        <Input 
                          id="product-name" 
                          placeholder="Enter product name"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-description">Description</Label>
                        <Textarea 
                          id="product-description" 
                          placeholder="Describe your product"
                          value={productDescription}
                          onChange={(e) => setProductDescription(e.target.value)}
                          required
                          className="min-h-32"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="product-price">Price ($)</Label>
                          <Input 
                            id="product-price" 
                            type="number"
                            placeholder="29.99"
                            step="0.01"
                            min="0.01"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product-category">Category</Label>
                          <Select 
                            value={productCategory} 
                            onValueChange={setProductCategory}
                            required
                          >
                            <SelectTrigger id="product-category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Handcrafted">Handcrafted</SelectItem>
                              <SelectItem value="Farm Fresh">Farm Fresh</SelectItem>
                              <SelectItem value="Textiles">Textiles</SelectItem>
                              <SelectItem value="Jewelry">Jewelry</SelectItem>
                              <SelectItem value="Pottery">Pottery</SelectItem>
                              <SelectItem value="Woodwork">Woodwork</SelectItem>
                              <SelectItem value="Specialty Foods">Specialty Foods</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-location">Source Location</Label>
                        <Input 
                          id="product-location" 
                          placeholder="e.g., Mountain Region, Valley Village"
                          value={productLocation}
                          onChange={(e) => setProductLocation(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch 
                          id="is-organic" 
                          checked={isOrganic}
                          onCheckedChange={setIsOrganic}
                        />
                        <Label htmlFor="is-organic">
                          This product is organic/eco-friendly
                        </Label>
                      </div>
                      <div className="space-y-2 pt-2">
                        <Label>Product Image</Label>
                        <ImageUpload 
                          onImageUploaded={(url) => setProductImage(url)} 
                          existingImage={productImage}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Product
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
                
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Products</CardTitle>
                      <CardDescription>Manage your listed products</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                      ) : products.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>You haven't added any products yet.</p>
                          <p className="text-sm mt-1">Create your first product to start selling!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {products.map((product) => (
                            <div 
                              key={product.id} 
                              className="border rounded-lg p-4 flex items-center gap-4"
                            >
                              <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                                {product.images?.length > 0 ? (
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                    No img
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{product.name}</h3>
                                <p className="text-sm text-muted-foreground truncate">
                                  {product.description.substring(0, 100)}...
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
                                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                    {product.category}
                                  </span>
                                </div>
                              </div>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Orders Management */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Track and manage your received orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>You haven't received any orders yet.</p>
                      <p className="text-sm mt-1">Orders will appear here once customers make purchases.</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <table className="min-w-full divide-y divide-border">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-border">
                          {orders.map((order) => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#{order.id.substring(0, 8)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{order.customer_name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{order.product_name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">${order.total_amount.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-700">
                                  {order.status || 'Completed'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SellerDashboard;
