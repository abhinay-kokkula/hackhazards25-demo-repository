import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  PlusCircle, 
  Trash2, 
  Edit, 
  ImagePlus, 
  X, 
  Check, 
  AlertCircle,
  ChevronRight,
  Star
} from "lucide-react";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    location: "",
    is_organic: false
  });
  const [productImages, setProductImages] = useState<string[]>([]);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    location: "",
    bio: ""
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  
  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/login");
          return;
        }
        
        setUser(user);
        
        // Fetch seller profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile:", profileError);
          toast.error("Failed to load profile data");
        }
        
        if (profileData) {
          setProfile(profileData);
          setProfileForm({
            full_name: profileData.full_name || "",
            location: profileData.location || "",
            bio: profileData.bio || ""
          });
          setAvatarUrl(profileData.avatar_url);
        }
        
        // Fetch seller products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('seller_id', user.id);
          
        if (productsError) {
          console.error("Error fetching products:", productsError);
          toast.error("Failed to load products");
        } else {
          setProducts(productsData || []);
        }
        
        // Fetch orders (simplified - in a real app, this would be more complex)
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('seller_id', user.id);
          
        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
        } else {
          setOrders(ordersData || []);
        }
        
      } catch (error) {
        console.error("Error in fetchUserData:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  // Handle product image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;
    
    setImageUploadLoading(true);
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
        
      setProductImages([...productImages, data.publicUrl]);
      toast.success("Image uploaded successfully");
      
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setImageUploadLoading(false);
    }
  };
  
  // Remove image from product images
  const removeImage = (image: string) => {
    if (Array.isArray(productImages) && productImages.some(img => img === image)) {
      setProductImages(productImages.filter(img => img !== image));
    }
  };
  
  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    setAvatarUploading(true);
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      setAvatarUrl(data.publicUrl);
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);
        
      if (updateError) {
        throw updateError;
      }
      
      toast.success("Profile picture updated");
      
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setAvatarUploading(false);
    }
  };
  
  // Handle product form submission
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.price) {
      toast.error("Product name and price are required");
      return;
    }
    
    try {
      const productData = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        category: newProduct.category.toLowerCase().replace(/\s+/g, ''),
        location: newProduct.location || profile?.location,
        is_organic: newProduct.is_organic,
        seller_id: user.id,
        images: productImages
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select();
        
      if (error) {
        throw error;
      }
      
      // Reset form
      setNewProduct({
        name: "",
        price: "",
        description: "",
        category: "",
        location: "",
        is_organic: false
      });
      setProductImages([]);
      
      // Update products list
      setProducts([...products, data[0]]);
      
      toast.success("Product added successfully");
      
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };
  
  // Handle profile form submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileForm.full_name,
          location: profileForm.location,
          bio: profileForm.bio
        })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Update local profile state
      setProfile({
        ...profile,
        full_name: profileForm.full_name,
        location: profileForm.location,
        bio: profileForm.bio
      });
      
      toast.success("Profile updated successfully");
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };
  
  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
        
      if (error) {
        throw error;
      }
      
      // Update products list
      setProducts(products.filter(product => product.id !== productId));
      
      toast.success("Product deleted successfully");
      
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };
  
  // Handle view product details
  const handleViewProduct = (id: string) => {
    navigate(`/product/${id}`);
  };
  
  // Handle view order details
  const handleViewOrder = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-accent/5">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={avatarUrl || ""} />
                        <AvatarFallback>{profile?.full_name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <label 
                        htmlFor="avatar-upload" 
                        className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer"
                      >
                        <ImagePlus size={16} />
                      </label>
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarUpload}
                        disabled={avatarUploading}
                      />
                    </div>
                    <CardTitle>{profile?.full_name || "Seller"}</CardTitle>
                    <CardDescription>{user?.email}</CardDescription>
                    
                    {profile?.location && (
                      <Badge variant="outline" className="mt-2">
                        {profile.location}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Products</span>
                      <span className="font-medium">{products.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Orders</span>
                      <span className="font-medium">{orders.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-medium flex items-center">
                        {profile?.rating || "N/A"} 
                        {profile?.rating && <Star size={14} fill="currentColor" className="ml-1 text-amber-500" />}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/seller/${user.id}`)}
                  >
                    View Public Profile
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:w-3/4">
              <Tabs defaultValue="products">
                <TabsList className="w-full">
                  <TabsTrigger value="products" className="flex-1">
                    <Package size={16} className="mr-2" /> Products
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="flex-1">
                    <ShoppingBag size={16} className="mr-2" /> Orders
                  </TabsTrigger>
                  <TabsTrigger value="customers" className="flex-1">
                    <Users size={16} className="mr-2" /> Customers
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex-1">
                    <Settings size={16} className="mr-2" /> Settings
                  </TabsTrigger>
                </TabsList>
                
                {/* Products Tab */}
                <TabsContent value="products">
                  <Card>
                    <CardHeader>
                      <CardTitle>Manage Products</CardTitle>
                      <CardDescription>Add, edit or remove your products</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Add New Product Form */}
                        <div className="bg-accent/10 rounded-lg p-4">
                          <h3 className="text-lg font-medium mb-4">Add New Product</h3>
                          <form onSubmit={handleProductSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <Label htmlFor="product-name">Product Name *</Label>
                                <Input 
                                  id="product-name" 
                                  value={newProduct.name}
                                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="product-price">Price (USD) *</Label>
                                <Input 
                                  id="product-price" 
                                  type="number" 
                                  min="0.01" 
                                  step="0.01"
                                  value={newProduct.price}
                                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="product-category">Category</Label>
                                <Select 
                                  value={newProduct.category} 
                                  onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                                >
                                  <SelectTrigger id="product-category">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="handcrafted">Handcrafted</SelectItem>
                                    <SelectItem value="farmfresh">Farm Fresh</SelectItem>
                                    <SelectItem value="traditionalart">Traditional Art</SelectItem>
                                    <SelectItem value="homegoods">Home Goods</SelectItem>
                                    <SelectItem value="textiles">Textiles</SelectItem>
                                    <SelectItem value="localfoods">Local Foods</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="product-location">Location</Label>
                                <Input 
                                  id="product-location" 
                                  value={newProduct.location}
                                  onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                                  placeholder={profile?.location || ""}
                                />
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="product-description">Description</Label>
                                <Textarea 
                                  id="product-description" 
                                  rows={4}
                                  value={newProduct.description}
                                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  id="is-organic"
                                  checked={newProduct.is_organic}
                                  onCheckedChange={(checked) => setNewProduct({...newProduct, is_organic: checked})}
                                />
                                <Label htmlFor="is-organic">Organic Product</Label>
                              </div>
                            </div>
                            
                            {/* Image Upload */}
                            <div className="space-y-2 mb-4">
                              <Label>Product Images</Label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {productImages.map((image, index) => (
                                  <div key={index} className="relative w-20 h-20 rounded border">
                                    <img 
                                      src={image} 
                                      alt={`Product ${index + 1}`} 
                                      className="w-full h-full object-cover rounded"
                                    />
                                    <button
                                      type="button"
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                      onClick={() => removeImage(image)}
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                ))}
                                <label className="w-20 h-20 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-accent/5">
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleImageUpload}
                                    disabled={imageUploadLoading}
                                  />
                                  {imageUploadLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                  ) : (
                                    <PlusCircle size={24} className="text-muted-foreground" />
                                  )}
                                </label>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Upload up to 5 images. First image will be the main product image.
                              </p>
                            </div>
                            
                            <Button type="submit" className="w-full">
                              <PlusCircle size={16} className="mr-2" /> Add Product
                            </Button>
                          </form>
                        </div>
                        
                        {/* Product List */}
                        <div>
                          <h3 className="text-lg font-medium mb-4">Your Products</h3>
                          {products.length === 0 ? (
                            <div className="text-center py-8 bg-accent/5 rounded-lg">
                              <p className="text-muted-foreground">You haven't added any products yet.</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {products.map((product) => (
                                <div 
                                  key={product.id} 
                                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
                                >
                                  <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                    <img 
                                      src={product.images?.[0] || "https://via.placeholder.com/150"} 
                                      alt={product.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium">{product.name}</h4>
                                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                      <span>${product.price.toFixed(2)}</span>
                                      {product.category && (
                                        <>
                                          <span>•</span>
                                          <span>{product.category}</span>
                                        </>
                                      )}
                                      {product.is_organic && (
                                        <>
                                          <span>•</span>
                                          <Badge variant="outline" className="text-xs">Organic</Badge>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 self-end sm:self-center">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleViewProduct(product.id)}
                                    >
                                      View
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                    >
                                      <Edit size={14} />
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleDeleteProduct(product.id)}
                                    >
                                      <Trash2 size={14} />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Orders Tab */}
                <TabsContent value="orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>Orders</CardTitle>
                      <CardDescription>Manage your customer orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {orders.length === 0 ? (
                        <div className="text-center py-8 bg-accent/5 rounded-lg">
                          <p className="text-muted-foreground">You don't have any orders yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <div 
                              key={order.id} 
                              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
                            >
                              <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                  <h4 className="font-medium">Order #{order.id.substring(0, 8)}</h4>
                                  <Badge 
                                    variant={order.status === "completed" ? "default" : "outline"}
                                  >
                                    {order.status}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                  <span>${order.total_amount.toFixed(2)}</span>
                                  <span>•</span>
                                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>{Array.isArray(order.items) ? order.items.length : 0} items</span>
                                </div>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewOrder(order.id)}
                              >
                                Details <ChevronRight size={14} className="ml-1" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Customers Tab */}
                <TabsContent value="customers">
                  <Card>
                    <CardHeader>
                      <CardTitle>Customers</CardTitle>
                      <CardDescription>View and manage your customer relationships</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 bg-accent/5 rounded-lg">
                        <p className="text-muted-foreground">Customer management coming soon.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Settings Tab */}
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>Update your seller profile information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="full-name">Full Name</Label>
                          <Input 
                            id="full-name" 
                            value={profileForm.full_name}
                            onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            value={profileForm.location}
                            onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea 
                            id="bio" 
                            rows={4}
                            value={profileForm.bio}
                            onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                            placeholder="Tell customers about yourself and your products..."
                          />
                        </div>
                        <Button type="submit">
                          Save Changes
                        </Button>
                      </form>
                      
                      <Separator className="my-8" />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Email Notifications</p>
                              <p className="text-sm text-muted-foreground">Receive emails about orders and account updates</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Public Profile</p>
                              <p className="text-sm text-muted-foreground">Make your seller profile visible to customers</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertCircle size={16} className="text-red-500" />
                              <p className="font-medium text-red-500">Delete Account</p>
                            </div>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SellerDashboard;
