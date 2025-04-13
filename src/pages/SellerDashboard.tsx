
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Upload, X, Plus } from "lucide-react";

type ProductFormValues = {
  name: string;
  description: string;
  price: string;
  category: string;
  location: string;
  isOrganic: boolean;
};

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      location: "",
      isOrganic: false,
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages].slice(0, 5)); // Limit to 5 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const imageUrls: string[] = [];
    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, image);

      if (error) {
        toast({
          title: "Image Upload Error",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      imageUrls.push(publicUrl);
    }
    return imageUrls;
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);

    try {
      // Upload images first
      const imageUrls = await uploadImages();
      if (imageUrls === null) {
        setIsSubmitting(false);
        return;
      }

      // Insert product into database
      const { data: product, error } = await supabase
        .from('products')
        .insert({
          name: data.name,
          description: data.description,
          price: parseFloat(data.price),
          category: data.category,
          location: data.location,
          is_organic: data.isOrganic,
          seller_id: supabase.auth.getUser().data.user?.id,
          images: imageUrls
        })
        .select();

      if (error) {
        toast({
          title: "Product Upload Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Product Added Successfully",
        description: "Your product is now listed for sale.",
      });

      // Reset form
      form.reset();
      setImages([]);
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">List your handcrafted products and connect with customers directly.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seller Stats */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Seller Profile</CardTitle>
                <CardDescription>Manage your seller account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 border-2 border-dashed border-border rounded-md">
                    <p className="text-muted-foreground mb-2">Your Supabase Account</p>
                    <p className="text-sm text-muted-foreground">Manage your products and track sales</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">0</div>
                      <div className="text-xs text-muted-foreground">Products</div>
                    </div>
                    <div className="bg-secondary p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">0</div>
                      <div className="text-xs text-muted-foreground">Orders</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Add Product Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Create a new listing for your handcrafted item</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Hand-woven bamboo basket" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your product, including materials used, size, and unique features." 
                              className="min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" min="0" placeholder="29.99" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="handcrafted">Handcrafted</SelectItem>
                                <SelectItem value="farmFresh">Farm Fresh</SelectItem>
                                <SelectItem value="traditionalArt">Traditional Art</SelectItem>
                                <SelectItem value="homeGoods">Home Goods</SelectItem>
                                <SelectItem value="textiles">Textiles</SelectItem>
                                <SelectItem value="localFoods">Local Foods</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Production Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Village, Region" {...field} />
                          </FormControl>
                          <FormDescription>
                            Where this product is made or produced
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="border border-border rounded-md p-4">
                      <p className="font-medium mb-2">Product Images</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                        {images.map((img, idx) => (
                          <div 
                            key={idx} 
                            className="relative aspect-square bg-secondary rounded-md overflow-hidden"
                          >
                            <img 
                              src={URL.createObjectURL(img)}
                              alt={`Product preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-background/80 p-1 rounded-full hover:bg-background"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        
                        {images.length < 5 && (
                          <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-border rounded-md aspect-square hover:border-primary transition-colors">
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="sr-only" 
                              onChange={handleImageUpload} 
                              multiple={images.length === 0}
                            />
                            <Upload size={24} className="text-muted-foreground mb-2" />
                            <span className="text-xs text-center text-muted-foreground">
                              {images.length === 0 ? 'Upload Images' : 'Add More'}
                            </span>
                          </label>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Upload up to 5 images (JPEG, PNG)</p>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        className="flex items-center gap-2" 
                        disabled={isSubmitting}
                      >
                        <Plus size={16} />
                        {isSubmitting ? 'Adding...' : 'Add Product'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SellerDashboard;
