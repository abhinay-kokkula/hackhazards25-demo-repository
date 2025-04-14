
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Package, MessageSquare } from "lucide-react";
import { SellerProfile as SellerProfileType } from "@/types";

const SellerProfile = () => {
  const { id: sellerId } = useParams<{ id: string }>();

  // Fetch seller information
  const { data: seller, isLoading: isSellerLoading } = useQuery({
    queryKey: ['seller', sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sellerId)
        .single();
        
      if (error) {
        console.error("Error fetching seller profile:", error);
        return null;
      }
      
      return data as SellerProfileType;
    },
    enabled: !!sellerId
  });

  // Fetch seller's products
  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ['sellerProducts', sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId);
        
      if (error) {
        console.error("Error fetching seller products:", error);
        return [];
      }
      
      return data;
    },
    enabled: !!sellerId
  });

  // Handle loading states
  if (isSellerLoading || isProductsLoading) {
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

  // Handle seller not found
  if (!seller) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Seller Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The seller you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  // Get default seller info if profiles table doesn't have all fields
  const sellerName = seller.full_name || "Rural Artisan";
  const sellerLocation = seller.location || "Rural Region";
  const sellerRating = seller.rating || 4.7;
  const sellerJoined = "2023"; // Default since created_at is no longer in the type
  const sellerImage = seller.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&auto=format&fit=crop";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Seller Profile Header */}
        <div className="bg-accent/10 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img 
                  src={sellerImage}
                  alt={sellerName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{sellerName}</h1>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin size={16} className="mr-1" />
                    <span>{sellerLocation}</span>
                  </div>
                  <div className="flex items-center text-amber-500">
                    <Star size={16} fill="currentColor" className="mr-1" />
                    <span>{sellerRating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Package size={16} className="mr-1" />
                    <span>{products?.length || 0} Products</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <span>Member since {sellerJoined}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6 max-w-2xl">
                  {seller.bio || "An artisan bringing authentic rural products directly to you. Every purchase supports traditional craftsmanship and sustainable practices."}
                </p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Button>
                    <MessageSquare size={16} className="mr-2" />
                    Contact Seller
                  </Button>
                  <Button variant="outline">
                    Follow
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products Section */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8">Products by {sellerName}</h2>
          
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  images={product.images || []}
                  seller_id={product.seller_id}
                  seller_name={sellerName}
                  seller_avatar={sellerImage}
                  seller_rating={sellerRating}
                  location={product.location || sellerLocation}
                  is_organic={product.is_organic}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary/20 rounded-lg">
              <p className="text-lg mb-2">This seller hasn't added any products yet.</p>
              <p className="text-muted-foreground">Check back later for new additions!</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SellerProfile;
