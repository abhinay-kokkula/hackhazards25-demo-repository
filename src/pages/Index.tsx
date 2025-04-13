import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import ProductCard from "@/components/ProductCard";
import ArtisanCard from "@/components/ArtisanCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Sample data
const featuredProducts = [
  {
    id: 1,
    name: "Hand-woven Bamboo Basket",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1590422749897-47036da0b0ff?w=800&auto=format&fit=crop",
    artisan: "Maya Crafts",
    location: "Northeastern Hills",
    rating: 4.8,
    isFeatured: true
  },
  {
    id: 2,
    name: "Organic Mountain Honey",
    price: 12.50,
    image: "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=800&auto=format&fit=crop",
    artisan: "Nature's Harvest",
    location: "Western Highlands",
    rating: 4.9,
    isOrganic: true
  },
  {
    id: 3,
    name: "Handmade Clay Pottery Set",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1565193298442-2373bcb29cd4?w=800&auto=format&fit=crop",
    artisan: "Traditional Potters",
    location: "Southern Valley",
    rating: 4.7
  },
  {
    id: 4,
    name: "Natural Wool Shawl",
    price: 35.00,
    image: "https://images.unsplash.com/photo-1580484031577-cc3ca5e61ab6?w=800&auto=format&fit=crop",
    artisan: "Highland Weavers",
    location: "Northern Mountains",
    rating: 4.6,
    isFeatured: true
  }
];

const popularProducts = [
  {
    id: 5,
    name: "Hand-carved Wooden Spoons",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1584653059740-fb6fb91eeeff?w=800&auto=format&fit=crop",
    artisan: "Forest Artisans",
    location: "Eastern Woods",
    rating: 4.5
  },
  {
    id: 6,
    name: "Organic Fruit Preserves Set",
    price: 24.50,
    image: "https://images.unsplash.com/photo-1533111476650-d3a4f0361c6b?w=800&auto=format&fit=crop",
    artisan: "Valley Farms",
    location: "Sunrise Valley",
    rating: 4.8,
    isOrganic: true
  },
  {
    id: 7,
    name: "Traditional Embroidered Pillow",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1584270692844-a76a4d37d0d7?w=800&auto=format&fit=crop",
    artisan: "Heritage Stitchers",
    location: "Central Plains",
    rating: 4.7
  },
  {
    id: 8,
    name: "Natural Beeswax Candles",
    price: 15.00,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop",
    artisan: "Meadow Apiaries",
    location: "Flower Valley",
    rating: 4.6,
    isOrganic: true
  }
];

const featuredArtisans = [
  {
    id: 1,
    name: "Maya Johnson",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&auto=format&fit=crop",
    profession: "Basket Weaver",
    location: "Northeastern Hills",
    rating: 4.8,
    productCount: 24,
    isVerified: true
  },
  {
    id: 2,
    name: "Samuel Green",
    image: "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=200&h=200&auto=format&fit=crop",
    profession: "Honey Producer",
    location: "Western Highlands",
    rating: 4.9,
    productCount: 8,
    isVerified: true
  },
  {
    id: 3,
    name: "Amara Singh",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&auto=format&fit=crop",
    profession: "Potter",
    location: "Southern Valley",
    rating: 4.7,
    productCount: 36
  }
];

const hackathonImage = "public/lovable-uploads/c295a133-d4ce-4a33-b206-b7981833c619.png";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        <CategorySection />
        
        {/* Featured Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <Button variant="link" className="flex items-center text-primary">
                View All <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Impact Banner */}
        <section className="py-12 bg-gradient-to-r from-accent/20 to-primary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                  <h2 className="text-3xl font-bold mb-4">Direct Impact on Rural Communities</h2>
                  <p className="text-muted-foreground mb-6">
                    Every purchase you make directly supports rural artisans and farmers. 
                    By eliminating middlemen, more money goes back into local communities,
                    helping preserve traditional crafts and sustainable farming practices.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm flex-1 min-w-[140px] text-center">
                      <div className="text-3xl font-bold text-primary mb-2">87%</div>
                      <div className="text-sm text-muted-foreground">Goes to Producers</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex-1 min-w-[140px] text-center">
                      <div className="text-3xl font-bold text-primary mb-2">175+</div>
                      <div className="text-sm text-muted-foreground">Rural Communities</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex-1 min-w-[140px] text-center">
                      <div className="text-3xl font-bold text-primary mb-2">12K+</div>
                      <div className="text-sm text-muted-foreground">Direct Livelihoods</div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2">
                  <div className="rounded-lg overflow-hidden shadow-md">
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
        
        {/* Featured Artisans */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Artisans & Farmers</h2>
              <Button variant="link" className="flex items-center text-primary">
                View All <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArtisans.map((artisan) => (
                <ArtisanCard key={artisan.id} {...artisan} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Popular Products */}
        <section className="py-12 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Popular Right Now</h2>
              <Button variant="link" className="flex items-center text-primary">
                View All <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-accent">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Share Your Rural Crafts?</h2>
            <p className="text-white/90 max-w-xl mx-auto mb-8">
              Join our community of artisans and farmers connecting directly with customers worldwide.
              No technical expertise needed - we'll help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg">
                Become a Seller
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/20 px-8 py-6 text-lg">
                Learn More
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
