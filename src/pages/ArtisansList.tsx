
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArtisanData } from "@/types";

const ArtisansList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [region, setRegion] = useState<string | null>(null);
  
  // Fetch artisans from Supabase
  const { data: artisans, isLoading } = useQuery({
    queryKey: ['artisans', searchQuery, region],
    queryFn: async () => {
      let query = supabase.from('profiles').select('*');
      
      // Apply search filter if provided
      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
      }
      
      // Apply region filter if selected
      if (region) {
        query = query.eq('location', region);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Fetch product counts for each artisan
      const enhancedArtisans = await Promise.all((data || []).map(async (artisan) => {
        const { count, error: countError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('seller_id', artisan.id);
          
        return {
          id: artisan.id,
          name: artisan.full_name || "Rural Artisan",
          image: artisan.avatar_url || "https://via.placeholder.com/200",
          profession: artisan.bio?.split(' ').slice(0, 2).join(' ') || "Rural Producer",
          location: artisan.location || "Rural Region",
          rating: artisan.rating || 4.5,
          productCount: count || 0,
          isVerified: true
        };
      }));
      
      return enhancedArtisans;
    }
  });
  
  // Get unique regions for filtering
  const uniqueRegions = artisans ? [...new Set(artisans.map(a => a.location))].filter(Boolean) : [];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is triggered by query dependencies
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero banner */}
        <div className="bg-gradient-to-r from-accent/20 to-primary/20 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Meet Our Rural Artisans & Farmers</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Connect directly with skilled craftspeople and farmers from rural communities.
              Each purchase supports traditional livelihoods and helps preserve cultural heritage.
            </p>
            
            {/* Search bar */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search artisans by name, craft or region..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {/* Region filters */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-3">Filter by Region</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={region === null ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setRegion(null)}
              >
                All Regions
              </Button>
              
              {uniqueRegions.map((r) => (
                <Button
                  key={r}
                  variant={region === r ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setRegion(r)}
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Artisans grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : artisans && artisans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artisans.map((artisan) => (
                <Link 
                  key={artisan.id}
                  to={`/seller/${artisan.id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-border overflow-hidden"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={artisan.image} 
                      alt={artisan.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={artisan.image} />
                          <AvatarFallback>{artisan.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium flex items-center">
                            {artisan.name}
                            {artisan.isVerified && (
                              <span className="ml-1 text-accent">
                                <Check size={14} />
                              </span>
                            )}
                          </h3>
                          <div className="text-sm text-muted-foreground">{artisan.profession}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="ml-1">{artisan.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {artisan.location}
                      </div>
                      <Badge variant="outline">{artisan.productCount} products</Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg mb-2">No artisans found</p>
              <p className="text-muted-foreground mb-6">Try adjusting your search criteria</p>
              <Button onClick={() => {setSearchQuery(""); setRegion(null);}}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArtisansList;
