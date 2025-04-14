
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { 
  Package, Plus, PenLine, Trash2, ShoppingBag, 
  DollarSign, Users, TrendingUp 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const SellerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("products");
  
  // Fetch seller's products
  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['sellerProducts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id);
        
      if (error) {
        console.error("Error fetching seller products:", error);
        return [];
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch seller's orders
  const { data: orders } = useQuery({
    queryKey: ['sellerOrders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('seller_id', user.id);
      
      if (!products || products.length === 0) return [];
      
      const productIds = products.map(p => p.id);
      
      // This is a simplified query that won't work correctly with the current schema
      // In a real app, you would need to query orders where items contain products sold by this seller
      const { data, error } = await supabase
        .from('orders')
        .select('*');
        
      if (error) {
        console.error("Error fetching orders:", error);
        return [];
      }
      
      // Filter orders that contain seller's products
      // This is simplified and would need to be adjusted based on your schema
      return data.filter(order => {
        const items = order.items || [];
        return items.some((item: any) => productIds.includes(item.product_id));
      });
    },
    enabled: !!user?.id
  });
  
  // Form state for adding/editing product
  const [productForm, setProductForm] = useState({
    id: null as string | null,
    name: "",
    price: "",
    description: "",
    category: "",
    location: "",
    is_organic: false,
    images: [] as string[]
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Reset form
  const resetForm = () => {
    setProductForm({
      id: null,
      name: "",
      price: "",
      description: "",
      category: "",
      location: "",
      is_organic: false,
      images: []
    });
    setIsEditing(false);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to add products");
      return;
    }
    
    try {
      const productData = {
        name: productForm.name,
        price: parseFloat(productForm.price),
        description: productForm.description,
        category: productForm.category,
        location: productForm.location,
        is_organic: productForm.is_organic,
        images: productForm.images,
        seller_id: user.id
      };
      
      let response;
      
      if (isEditing && productForm.id) {
        // Update existing product
        response = await supabase
          .from('products')
          .update(productData)
          .eq('id', productForm.id);
          
        if (response.error) throw response.error;
        toast.success("Product updated successfully!");
      } else {
        // Add new product
        response = await supabase
          .from('products')
          .insert(productData);
          
        if (response.error) throw response.error;
        toast.success("Product added successfully!");
      }
      
      resetForm();
      refetch();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Failed to save product");
    }
  };
  
  // Edit product
  const editProduct = (product: any) => {
    setProductForm({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      description: product.description || "",
      category: product.category || "",
      location: product.location || "",
      is_organic: product.is_organic || false,
      images: product.images || []
    });
    setIsEditing(true);
    setActiveTab("addProduct");
  };
  
  // Delete product
  const deleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast.success("Product deleted successfully!");
        refetch();
      } catch (error: any) {
        console.error("Error deleting product:", error);
        toast.error(error.message || "Failed to delete product");
      }
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to access your seller dashboard.
          </p>
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Package className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{products?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <ShoppingBag className="text-amber-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">
                  ${orders?.reduce((total, order) => total + parseFloat(order.total_amount), 0).toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b mb-6">
          <div className="flex overflow-x-auto space-x-8">
            <button 
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "products" 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("products")}
            >
              Products
            </button>
            <button 
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "orders" 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              Orders
            </button>
            <button 
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "addProduct" 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => {
                resetForm();
                setActiveTab("addProduct");
              }}
            >
              {isEditing ? "Edit Product" : "Add New Product"}
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Products</h2>
              <Button 
                size="sm"
                onClick={() => {
                  resetForm();
                  setActiveTab("addProduct");
                }}
              >
                <Plus size={16} className="mr-1" /> Add Product
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : products && products.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary/20">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium text-sm">Product</th>
                      <th className="py-3 px-4 text-left font-medium text-sm">Category</th>
                      <th className="py-3 px-4 text-left font-medium text-sm">Price</th>
                      <th className="py-3 px-4 text-left font-medium text-sm">Location</th>
                      <th className="py-3 px-4 text-right font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map(product => (
                      <tr key={product.id}>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded overflow-hidden bg-secondary/20 mr-3">
                              {product.images && product.images[0] ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  <Package size={16} />
                                </div>
                              )}
                            </div>
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">
                          {product.category || "—"}
                        </td>
                        <td className="py-4 px-4 font-medium">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">
                          {product.location || "—"}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => editProduct(product)}
                            >
                              <PenLine size={16} />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="text-red-600 hover:text-red-700" 
                              onClick={() => deleteProduct(product.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary/20 rounded-lg">
                <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-lg mb-2">You haven't added any products yet</p>
                <p className="text-muted-foreground mb-6">
                  Start adding products to showcase your artisanal offerings
                </p>
                <Button onClick={() => setActiveTab("addProduct")}>
                  <Plus size={16} className="mr-1" /> Add Your First Product
                </Button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Orders</h2>
            
            {orders && orders.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary/20">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium text-sm">Order ID</th>
                      <th className="py-3 px-4 text-left font-medium text-sm">Date</th>
                      <th className="py-3 px-4 text-left font-medium text-sm">Items</th>
                      <th className="py-3 px-4 text-left font-medium text-sm">Total</th>
                      <th className="py-3 px-4 text-left font-medium text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="py-4 px-4 font-mono text-sm">
                          {order.id.substring(0, 8)}...
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          {(order.items || []).length} items
                        </td>
                        <td className="py-4 px-4 font-medium">
                          ${parseFloat(order.total_amount).toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary/20 rounded-lg">
                <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-lg mb-2">No orders yet</p>
                <p className="text-muted-foreground">
                  When customers buy your products, their orders will appear here
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === "addProduct" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Product Name*
                  </label>
                  <Input
                    id="name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-1">
                    Price (₹)*
                  </label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      className="w-full border rounded-md px-3 py-2"
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    >
                      <option value="">Select a category</option>
                      <option value="handcrafted">Handcrafted</option>
                      <option value="farmfresh">Farm Fresh</option>
                      <option value="traditionalart">Traditional Art</option>
                      <option value="homegoods">Home Goods</option>
                      <option value="textiles">Textiles</option>
                      <option value="localfoods">Local Foods</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-1">
                      Location
                    </label>
                    <Input
                      id="location"
                      value={productForm.location}
                      onChange={(e) => setProductForm({...productForm, location: e.target.value})}
                      placeholder="e.g., Northern Hills"
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_organic"
                    checked={productForm.is_organic}
                    onChange={(e) => setProductForm({...productForm, is_organic: e.target.checked})}
                    className="rounded border-gray-300 mr-2"
                  />
                  <label htmlFor="is_organic" className="text-sm">
                    This product is organic
                  </label>
                </div>
                
                <div>
                  <label htmlFor="images" className="block text-sm font-medium mb-1">
                    Image URLs (one per line)
                  </label>
                  <Textarea
                    id="images"
                    value={productForm.images.join('\n')}
                    onChange={(e) => setProductForm({
                      ...productForm, 
                      images: e.target.value.split('\n').filter(url => url.trim() !== '')
                    })}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter image URLs, one per line. The first image will be the product thumbnail.
                  </p>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {isEditing ? "Update Product" : "Add Product"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default SellerDashboard;
