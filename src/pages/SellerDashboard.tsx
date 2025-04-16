import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  BarChart, Package2, ShoppingBag, Settings, Users, PlusCircle, 
  Trash2, Edit, CheckCircle2, XCircle, ArrowUpDown, ExternalLink
} from "lucide-react";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ProductWithSellerInfo } from "@/types";
import { useAuth } from "@/components/AuthProvider";

type ProductType = {
  id: string;
  name: string;
  price: number;
  category: string;
  status: string;
  inventory: number;
  image: string;
  description?: string;
  is_organic?: boolean;
};

const initialProducts: ProductType[] = [];
const initialOrders: any[] = [];

const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().optional(),
  inventory: z.coerce.number().int().nonnegative({ message: "Inventory must be a non-negative integer" }),
  is_organic: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const categories = ["Handcrafted", "Farm Fresh", "Traditional Art", "Home Goods", "Textiles", "Local Foods"];

const SellerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<null | ProductType>(null);
  const [orderFilter, setOrderFilter] = useState("all");

  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      description: "",
      inventory: 0,
      is_organic: false,
    },
  });

  useEffect(() => {
    if (editingProduct) {
      productForm.reset({
        name: editingProduct.name,
        price: editingProduct.price,
        category: editingProduct.category,
        inventory: editingProduct.inventory,
        description: editingProduct.description || "",
        is_organic: editingProduct.is_organic || false,
      });
    }
  }, [editingProduct, productForm]);

  const handleSubmitProduct = (data: ProductFormValues) => {
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { 
          ...p, 
          ...data
        } : p
      ));
      toast.success("Product updated successfully");
    } else {
      const newProduct: ProductType = {
        id: `p${Date.now()}`,
        name: data.name,
        price: data.price,
        category: data.category,
        status: data.inventory > 0 ? "active" : "out_of_stock",
        inventory: data.inventory,
        image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop",
        description: data.description,
        is_organic: data.is_organic
      };
      setProducts([...products, newProduct]);
      toast.success("Product added successfully");
    }
    
    productForm.reset();
    setIsAddProductOpen(false);
    setEditingProduct(null);
  };

  const openEditModal = (product: ProductType) => {
    setEditingProduct(product);
    setIsAddProductOpen(true);
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("Product deleted");
  };

  const filteredOrders = orderFilter === "all" 
    ? orders
    : orders.filter(order => order.status === orderFilter);

  const handleAddProductClick = () => {
    productForm.reset({
      name: "",
      price: 0,
      category: "",
      description: "",
      inventory: 0,
      is_organic: false,
    });
    setEditingProduct(null);
    setIsAddProductOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your rural products</p>
          </div>
          <Button onClick={handleAddProductClick} className="mt-4 md:mt-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="overview" className="text-xs md:text-sm">
              <BarChart className="w-4 h-4 mr-2 hidden sm:block" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="text-xs md:text-sm">
              <Package2 className="w-4 h-4 mr-2 hidden sm:block" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs md:text-sm">
              <ShoppingBag className="w-4 h-4 mr-2 hidden sm:block" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="customers" className="text-xs md:text-sm">
              <Users className="w-4 h-4 mr-2 hidden sm:block" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs md:text-sm hidden md:flex">
              <Settings className="w-4 h-4 mr-2 hidden sm:block" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Your Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {products.filter(p => p.status === "active").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.slice(0, 3).map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>
                              <Badge variant={
                                order.status === "delivered" ? "default" : 
                                order.status === "shipped" ? "secondary" : 
                                "outline"
                              }>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No orders yet
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Popular Products</CardTitle>
                </CardHeader>
                <CardContent>
                  {products.length > 0 ? (
                    <div className="space-y-4">
                      {products.slice(0, 3).map((product) => (
                        <div key={product.id} className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded border bg-background flex-shrink-0 overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="h-full w-full object-cover" 
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                          <div className="font-medium">₹{product.price.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No products added yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Manage your product listings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {products.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Inventory</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded bg-background overflow-hidden">
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="h-full w-full object-cover" 
                                />
                              </div>
                              {product.name}
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>₹{product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={product.status === "active" ? "default" : "secondary"}>
                              {product.status === "active" ? "Active" : "Out of Stock"}
                            </Badge>
                          </TableCell>
                          <TableCell>{product.inventory}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <ArrowUpDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditModal(product)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  window.open(`/product/${product.id}`, '_blank');
                                }}>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => deleteProduct(product.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No products added yet</p>
                    <Button onClick={handleAddProductClick}>Add Your First Product</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>
                      Manage your customer orders.
                    </CardDescription>
                  </div>
                  <Select value={orderFilter} onValueChange={setOrderFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {filteredOrders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>
                            <Badge variant={
                              order.status === "delivered" ? "default" : 
                              order.status === "shipped" ? "secondary" : 
                              "outline"
                            }>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <ArrowUpDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {order.status === "processing" && (
                                  <DropdownMenuItem>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Mark as Shipped
                                  </DropdownMenuItem>
                                )}
                                {order.status === "shipped" && (
                                  <DropdownMenuItem>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Mark as Delivered
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Cancel Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No orders yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customers</CardTitle>
                <CardDescription>
                  View your customer information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Customer management coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
                <CardDescription>
                  Manage your store profile and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Store Name</label>
                      <Input placeholder="Your store name" defaultValue="Artisan Crafts" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <Input placeholder="Your location" defaultValue="Northeastern Hills" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Store Description</label>
                      <Textarea 
                        placeholder="Describe your store" 
                        defaultValue="We create handcrafted items using traditional techniques passed down through generations."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Payment Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bank Account Number</label>
                      <Input placeholder="Your bank account number" defaultValue="XXXX-XXXX-XXXX-1234" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">UPI ID</label>
                      <Input placeholder="Your UPI ID" defaultValue="artisan@ybl" />
                    </div>
                  </div>
                </div>
                
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct 
                  ? "Update your product details below."
                  : "Fill in the details to add a new product to your store."
                }
              </DialogDescription>
            </DialogHeader>
            
            <Form {...productForm}>
              <form onSubmit={productForm.handleSubmit(handleSubmitProduct)} className="space-y-4">
                <FormField
                  control={productForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={productForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={productForm.control}
                    name="inventory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inventory</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={productForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={productForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your product" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={productForm.control}
                  name="is_organic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Organic Product</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Check this box if the product is certified organic.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Footer />
    </div>
  );
};

export default SellerDashboard;
