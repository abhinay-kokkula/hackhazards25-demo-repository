import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import FarmerAssistant from "@/components/FarmerAssistant";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { ProductWithSellerInfo } from "@/types";

const Index = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithSellerInfo[]>([]);
  const [farmProducts, setFarmProducts] = useState<ProductWithSellerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data: featuredData, error: featuredError } = await supabase
          .from('products')
          .select(`
            *,
            profiles:seller_id(full_name, avatar_url, rating)
          `)
          .limit(4);
        
        if (featuredError) throw featuredError;
        
        const { data: farmData, error: farmError } = await supabase
          .from('products')
          .select(`
            *,
            profiles:seller_id(full_name, avatar_url, rating)
          `)
          .eq('category', 'Farm Fresh')
          .limit(4);
        
        if (farmError) throw farmError;
        
        const formattedFeatured = featuredData.map(transformProductData);
        const formattedFarm = farmData.map(transformProductData);
        
        setFeaturedProducts(formattedFeatured);
        setFarmProducts(formattedFarm);
      } catch (error) {
        console.error("Error fetching products:", error);
        setFeaturedProducts(manualFeaturedProducts);
        setFarmProducts(manualFarmProduce);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const transformProductData = (product: any): ProductWithSellerInfo => {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      images: product.images,
      category: product.category,
      location: product.location,
      is_organic: product.is_organic,
      seller_id: product.seller_id,
      seller_name: product.profiles?.full_name || "Local Artisan",
      seller_avatar: product.profiles?.avatar_url,
      seller_rating: product.profiles?.rating || 4.5,
    };
  };
  
  const manualFeaturedProducts = [
    {
      id: "m1",
      name: "Handcrafted Wooden Bowl",
      price: 39.99,
      images: ["https://images.unsplash.com/photo-1633676921199-84a5720341b4?w=800&auto=format&fit=crop"],
      seller_name: "Forest Crafts",
      location: "Mountain Region",
      seller_rating: 4.9,
      isFeatured: true,
      seller_id: "s1"
    },
    {
      id: "m2",
      name: "Artisanal Ceramic Vase",
      price: 59.95,
      images: ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop"],
      seller_name: "Clay Masters",
      location: "Riverside Valley",
      seller_rating: 4.7,
      isFeatured: true,
      seller_id: "s2"
    },
    {
      id: "m3",
      name: "Hand-Loomed Textile Wall Hanging",
      price: 85.00,
      images: ["https://images.unsplash.com/photo-1596462118002-fea3d07e330c?w=800&auto=format&fit=crop"],
      seller_name: "Weaving Traditions",
      location: "Eastern Highlands",
      seller_rating: 4.8,
      isFeatured: true,
      seller_id: "s3"
    },
    {
      id: "m4",
      name: "Organic Herbal Tea Collection",
      price: 28.50,
      images: ["https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&auto=format&fit=crop"],
      seller_name: "Mountain Herbalists",
      location: "Northern Slopes",
      seller_rating: 4.9,
      is_organic: true,
      seller_id: "s4"
    }
  ];

  const manualFarmProduce = [
    {
      id: "m5",
      name: "Fresh Organic Vegetables Basket",
      price: 24.99,
      images: ["https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&auto=format&fit=crop"],
      seller_name: "Valley Organics",
      location: "Green Valley",
      seller_rating: 4.8,
      is_organic: true,
      seller_id: "s5"
    },
    {
      id: "m6",
      name: "Wild Mountain Honey (500g)",
      price: 18.75,
      images: ["https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&auto=format&fit=crop"],
      seller_name: "Bee Keepers Collective",
      location: "Mountain Forests",
      seller_rating: 4.9,
      is_organic: true,
      seller_id: "s6"
    },
    {
      id: "m7",
      name: "Artisanal Cheese Selection",
      price: 32.50,
      images: ["https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&auto=format&fit=crop"],
      seller_name: "Highland Dairy",
      location: "Northern Pastures",
      seller_rating: 4.7,
      is_organic: true,
      seller_id: "s7"
    },
    {
      id: "m8",
      name: "Freshly Harvested Rice (2kg)",
      price: 15.25,
      images: ["https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop"],
      seller_name: "Rice Growers Association",
      location: "River Delta",
      seller_rating: 4.6,
      is_organic: true,
      seller_id: "s8"
    }
  ];

  const displayedFeaturedProducts = featuredProducts.length > 0 ? featuredProducts : manualFeaturedProducts;
  const displayedFarmProducts = farmProducts.length > 0 ? farmProducts : manualFarmProduce;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        <CategorySection />
        
        <section className="py-16 bg-gradient-to-r from-primary/5 via-accent/10 to-background">
          <div className="container mx-auto px-4">
            <FarmerAssistant />
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">{t('featuredProducts')}</h2>
              <Button 
                variant="link" 
                className="flex items-center text-primary"
                onClick={() => navigate("/browse")}
              >
                {t('viewAll')} <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-100 animate-pulse h-72 rounded-lg"></div>
                ))
              ) : (
                displayedFeaturedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))
              )}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gradient-to-r from-primary/5 via-accent/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                  <h2 className="text-3xl font-bold mb-4">{t('impactTitle')}</h2>
                  <p className="text-muted-foreground mb-8">
                    {t('impactDescription')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-md text-center transform transition-transform hover:scale-105 hover:shadow-lg">
                      <div className="text-3xl font-bold text-primary mb-2">87%</div>
                      <div className="text-sm text-muted-foreground">{t('goesToProducers')}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center transform transition-transform hover:scale-105 hover:shadow-lg">
                      <div className="text-3xl font-bold text-primary mb-2">175+</div>
                      <div className="text-sm text-muted-foreground">{t('ruralCommunities')}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center transform transition-transform hover:scale-105 hover:shadow-lg">
                      <div className="text-3xl font-bold text-primary mb-2">12K+</div>
                      <div className="text-sm text-muted-foreground">{t('directLivelihoods')}</div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 mt-6 md:mt-0">
                  <div className="rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105">
                    <img 
                      src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop" 
                      alt="Rural artisan at work" 
                      className="w-full h-auto" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">{t('farmFreshProduce')}</h2>
              <Button 
                variant="link" 
                className="flex items-center text-primary"
                onClick={() => navigate("/browse/Farm%20Fresh")}
              >
                {t('viewAll')} <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-100 animate-pulse h-72 rounded-lg"></div>
                ))
              ) : (
                displayedFarmProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))
              )}
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-gradient-to-r from-primary to-accent">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('readyToShare')}</h2>
            <p className="text-white/90 max-w-xl mx-auto mb-8">
              {t('joinCommunity')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg"
                onClick={() => navigate("/seller")}
              >
                {t('becomeSeller')}
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/20 px-8 py-6 text-lg">
                {t('learnMore')}
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
