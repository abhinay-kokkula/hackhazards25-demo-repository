
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

// All categories available in the application
const allCategories = [
  {
    name: "Handcrafted",
    icon: "🧶",
    description: "Unique artisan-made items"
  },
  {
    name: "Farm Fresh",
    icon: "🌾",
    description: "Organic produce & goods"
  },
  {
    name: "Traditional Art",
    icon: "🎨",
    description: "Cultural artifacts & art"
  },
  {
    name: "Home Goods",
    icon: "🏡",
    description: "Decor & household items"
  },
  {
    name: "Textiles",
    icon: "🧵",
    description: "Fabrics & woven products"
  },
  {
    name: "Local Foods",
    icon: "🍯",
    description: "Prepared foods & preserves"
  }
];

const BrowseCategories = () => {
  const navigate = useNavigate();
  const { category: categoryParam } = useParams<{ category?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam || null);
  const { t } = useLanguage();
  
  // Fetch products from Supabase
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', selectedCategory, searchQuery],
    queryFn: async () => {
      // First fetch the products
      let query = supabase.from('products').select('*');
      
      // Apply category filter if selected
      if (selectedCategory) {
        // Convert category name to match DB format (remove spaces and lowercase)
        const dbCategory = selectedCategory.toLowerCase().replace(/\s+/g, '');
        query = query.eq('category', dbCategory);
      }
      
      // Apply search filter if provided
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
      }
      
      const { data: productsData, error: productsError } = await query;
      
      if (productsError) {
        console.error("Error fetching products:", productsError);
        throw new Error(productsError.message);
      }
      
      // Then fetch the seller profiles for these products
      const enhancedProducts = await Promise.all((productsData || []).map(async (product) => {
        // Fetch the seller profile for this product
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', product.seller_id)
          .single();
          
        if (profileError) {
          console.error("Error fetching seller profile:", profileError);
          // Return product with default seller values if profile fetch fails
          return {
            ...product,
            seller_name: "Local Artisan",
            seller_avatar: null,
            seller_rating: 4.5,
          };
        }
        
        // Return product with seller information
        return {
          ...product,
          seller_name: profileData?.full_name || "Local Artisan",
          seller_avatar: profileData?.avatar_url,
          seller_rating: profileData?.rating || 4.5,
        };
      }));
      
      return enhancedProducts;
    }
  });

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is automatically triggered by the query dependency
  };

  // Select a category
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    
    // Update URL when category changes
    if (category) {
      navigate(`/browse/${category}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero section with search */}
        <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-background py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">{selectedCategory || t('browseAllCategories')}</h1>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Link to="/" className="hover:text-primary">Home</Link>
                  <ChevronRight size={14} className="mx-1" />
                  <Link to="/browse" className="hover:text-primary">Browse</Link>
                  {selectedCategory && (
                    <>
                      <ChevronRight size={14} className="mx-1" />
                      <span>{selectedCategory}</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Search form */}
              <form onSubmit={handleSearch} className="w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder={t('searchProducts')}
                    className="pl-10 w-full md:w-64 lg:w-80"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Categories section */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              className="rounded-full"
              onClick={() => handleCategorySelect(null)}
            >
              {t('allCategories')}
            </Button>
            
            {allCategories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                className="rounded-full"
                onClick={() => handleCategorySelect(category.name)}
              >
                {category.icon} {category.name}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Products grid */}
        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading products. Please try again.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  images={product.images || []}
                  category={product.category}
                  seller_id={product.seller_id}
                  seller_name={product.seller_name}
                  seller_avatar={product.seller_avatar}
                  seller_rating={product.seller_rating}
                  location={product.location}
                  is_organic={product.is_organic}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">{t('noProductsFound')}</p>
              {selectedCategory && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => handleCategorySelect(null)}
                >
                  {t('viewAllCategories')}
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BrowseCategories;
