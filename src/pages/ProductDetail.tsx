
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  Heart, 
  ShoppingBag, 
  Star, 
  MapPin, 
  Package,
  ChevronLeft,
  ChevronRight as ChevronNextIcon,
  Share2,
  Truck,
  Award,
  CircleCheck
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProductDetail as ProductDetailType } from "@/types";
import { useCart } from "@/components/CartProvider";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
        
      if (productError) {
        console.error("Error fetching product:", productError);
        return null;
      }
      
      // Fetch seller information
      const { data: sellerData, error: sellerError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', productData.seller_id)
        .single();
        
      if (sellerError) {
        console.error("Error fetching seller:", sellerError);
      }
      
      return {
        ...productData,
        seller_name: sellerData?.full_name || "Local Artisan",
        seller_avatar: sellerData?.avatar_url,
        seller_rating: sellerData?.rating || 4.7,
        description: productData.description || "No description provided"
      } as ProductDetailType;
    },
    enabled: !!id
  });
  
  // Navigate through product images
  const nextImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === product.images!.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  const prevImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images!.length - 1 : prev - 1
      );
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "https://via.placeholder.com/150",
        sellerName: product.seller_name || "Local Artisan",
        sellerId: product.seller_id
      });
    }
  };
  
  // Handle loading state
  if (isLoading) {
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
  
  // Handle error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/browse")}>
            Browse Products
          </Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-accent/5 py-2">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Home</Link>
              <ChevronRight size={14} className="mx-1" />
              <Link to="/browse" className="hover:text-primary">Browse</Link>
              {product.category && (
                <>
                  <ChevronRight size={14} className="mx-1" />
                  <Link to={`/browse/${product.category}`} className="hover:text-primary">
                    {product.category}
                  </Link>
                </>
              )}
              <ChevronRight size={14} className="mx-1" />
              <span className="text-foreground truncate max-w-[150px]">{product.name}</span>
            </div>
          </div>
        </div>
        
        {/* Product Detail Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Images */}
            <div className="lg:w-1/2">
              <div className="relative rounded-lg overflow-hidden bg-accent/5 h-[400px] mb-4">
                <img 
                  src={product.images?.[currentImageIndex] || "https://via.placeholder.com/400"} 
                  alt={product.name} 
                  className="w-full h-full object-contain"
                />
                
                {product.is_organic && (
                  <Badge className="absolute top-4 right-4 bg-accent text-white">
                    Organic
                  </Badge>
                )}
                
                {/* Image navigation arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <Button 
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <Button 
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
                      onClick={nextImage}
                    >
                      <ChevronNextIcon size={16} />
                    </Button>
                  </>
                )}
              </div>
              
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`w-20 h-20 rounded cursor-pointer border-2 ${index === currentImageIndex ? 'border-primary' : 'border-transparent'}`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} - view ${index + 1}`} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="lg:w-1/2">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-amber-500">
                  <Star size={18} fill="currentColor" className="mr-1" />
                  <span>{product.seller_rating?.toFixed(1)}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  by <Link to={`/seller/${product.seller_id}`} className="text-primary hover:underline">{product.seller_name}</Link>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <MapPin size={14} /> 
                <span>{product.location || "Rural Region"}</span>
              </div>
              
              <div className="text-3xl font-bold mb-6">${product.price.toFixed(2)}</div>
              
              <div className="flex gap-3 mb-8">
                <Button className="flex-1 gap-2" onClick={handleAddToCart}>
                  <ShoppingBag size={18} /> Add to Cart
                </Button>
                <Button variant="outline" size="icon">
                  <Heart size={18} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 size={18} />
                </Button>
              </div>
              
              {/* Seller info */}
              <div className="flex items-center gap-3 bg-accent/5 p-4 rounded-lg mb-6">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={product.seller_avatar || ""} />
                  <AvatarFallback>{product.seller_name?.slice(0, 2) || "LA"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{product.seller_name}</p>
                  <p className="text-sm text-muted-foreground">Verified Rural Artisan</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate(`/seller/${product.seller_id}`)}>
                  View Profile
                </Button>
              </div>
              
              {/* Shipping info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-primary" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-primary" />
                  <span>Authentic rural product</span>
                </div>
                {product.is_organic && (
                  <div className="flex items-center gap-2">
                    <CircleCheck size={16} className="text-accent" />
                    <span>Certified organic</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Product details tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="w-full border-b justify-start">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="py-6">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </TabsContent>
              <TabsContent value="details" className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span>{product.category || "Uncategorized"}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Region</span>
                      <span>{product.location || "Rural Region"}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Organic</span>
                      <span>{product.is_organic ? "Yes" : "No"}</span>
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="shipping" className="py-6">
                <p className="mb-4">Shipping information:</p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Free shipping on orders over $50</li>
                  <li>Standard delivery: 3-7 business days</li>
                  <li>Express delivery: 1-3 business days (additional fee)</li>
                  <li>All products are carefully packaged to ensure they arrive in perfect condition</li>
                </ul>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
