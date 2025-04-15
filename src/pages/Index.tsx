
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Sample data for fresh produce with custom order property
const farmProduce = [
  {
    id: "5",
    name: "Organic Tomatoes (1kg)",
    price: 3.99,
    images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfad?w=800&auto=format&fit=crop"],
    seller_name: "Green Valley Farms",
    location: "Southern Hills",
    seller_rating: 4.7,
    is_organic: true,
    seller_id: "1",
    order: 1
  },
  {
    id: "6",
    name: "Green Chillies Bundle",
    price: 2.50,
    images: ["https://images.unsplash.com/photo-1631236783331-564a5885f00a?w=800&auto=format&fit=crop"],
    seller_name: "Spice Hills",
    location: "Western Plateau",
    seller_rating: 4.8,
    is_organic: true,
    seller_id: "2",
    order: 3
  },
  {
    id: "7",
    name: "Farm Fresh Potatoes (2kg)",
    price: 4.99,
    images: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop"],
    seller_name: "Root Harvest",
    location: "Northern Valley",
    seller_rating: 4.6,
    is_organic: true,
    seller_id: "3",
    order: 2
  },
  {
    id: "8",
    name: "Mixed Seasonal Vegetables",
    price: 12.00,
    images: ["https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&auto=format&fit=crop"],
    seller_name: "Fresh Picks Co-op",
    location: "Eastern Farmlands",
    seller_rating: 4.9,
    is_organic: true,
    seller_id: "4",
    order: 4
  }
];

// Sample data for featured products with custom order property
const featuredProducts = [
  {
    id: "1",
    name: "Hand-woven Bamboo Basket",
    price: 45.99,
    images: ["https://images.unsplash.com/photo-1590422749897-47036da0b0ff?w=800&auto=format&fit=crop"],
    seller_name: "Maya Crafts",
    location: "Northeastern Hills",
    seller_rating: 4.8,
    isFeatured: true,
    seller_id: "5",
    order: 3
  },
  {
    id: "2",
    name: "Organic Mountain Honey",
    price: 12.50,
    images: ["https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=800&auto=format&fit=crop"],
    seller_name: "Nature's Harvest",
    location: "Western Highlands",
    seller_rating: 4.9,
    is_organic: true,
    seller_id: "6",
    order: 1
  },
  {
    id: "3",
    name: "Handmade Clay Pottery Set",
    price: 89.99,
    images: ["https://images.unsplash.com/photo-1565193298442-2373bcb29cd4?w=800&auto=format&fit=crop"],
    seller_name: "Traditional Potters",
    location: "Southern Valley",
    seller_rating: 4.7,
    seller_id: "7",
    order: 4
  },
  {
    id: "4",
    name: "Natural Wool Shawl",
    price: 35.00,
    images: ["https://images.unsplash.com/photo-1580484031577-cc3ca5e61ab6?w=800&auto=format&fit=crop"],
    seller_name: "Highland Weavers",
    location: "Northern Mountains",
    seller_rating: 4.6,
    isFeatured: true,
    seller_id: "8",
    order: 2
  }
];

const Index = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Sort products by custom order property
  const sortedFeaturedProducts = [...featuredProducts].sort((a, b) => a.order - b.order);
  const sortedFarmProduce = [...farmProduce].sort((a, b) => a.order - b.order);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        <CategorySection />
        
        {/* Featured Products */}
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
              {sortedFeaturedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Community Impact Banner */}
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
        
        {/* Farm Fresh Products */}
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
              {sortedFarmProduce.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
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
