
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Package, MessageSquare, Filter } from "lucide-react";
import { SellerProfile as SellerProfileType, ProductWithSellerInfo, SupportedLanguage, Translations } from "@/types";

const SellerProfile = () => {
  const { id: sellerId } = useParams<{ id: string }>();
  const [sortBy, setSortBy] = useState<string>("newest");
  const [language, setLanguage] = useState<SupportedLanguage>("en");

  // Language translations
  const translations: Translations = {
    en: {
      noSeller: "Seller Not Found",
      noSellerDesc: "The seller you're looking for doesn't exist or has been removed.",
      goBack: "Go Back",
      contactSeller: "Contact Seller",
      follow: "Follow",
      productsBy: "Products by",
      noProducts: "This seller hasn't added any products yet.",
      checkBackLater: "Check back later for new additions!",
      memberSince: "Member since",
      sortBy: "Sort by",
      newest: "Newest",
      priceHighToLow: "Price: High to Low",
      priceLowToHigh: "Price: Low to High",
      popularity: "Popularity"
    },
    hi: {
      noSeller: "विक्रेता नहीं मिला",
      noSellerDesc: "आप जिस विक्रेता को खोज रहे हैं, वह मौजूद नहीं है या हटा दिया गया है।",
      goBack: "वापस जाएँ",
      contactSeller: "विक्रेता से संपर्क करें",
      follow: "फॉलो करें",
      productsBy: "द्वारा उत्पाद",
      noProducts: "इस विक्रेता ने अभी तक कोई उत्पाद नहीं जोड़ा है।",
      checkBackLater: "नए जोड़े गए उत्पादों के लिए बाद में फिर से देखें!",
      memberSince: "सदस्य बने",
      sortBy: "क्रमबद्ध करें",
      newest: "नवीनतम",
      priceHighToLow: "मूल्य: उच्च से निम्न",
      priceLowToHigh: "मूल्य: निम्न से उच्च",
      popularity: "लोकप्रियता"
    },
    te: {
      noSeller: "విక్రేత కనుగొనబడలేదు",
      noSellerDesc: "మీరు వెతుకుతున్న విక్రేత లేదు లేదా తొలగించబడింది.",
      goBack: "వెనక్కి వెళ్లండి",
      contactSeller: "విక్రేతను సంప్రదించండి",
      follow: "అనుసరించండి",
      productsBy: "ఉత్పత్తులు",
      noProducts: "ఈ విక్రేత ఇంకా ఏ ఉత్పత్తులను జోడించలేదు.",
      checkBackLater: "కొత్త జోడింపుల కోసం తర్వాత తిరిగి తనిఖీ చేయండి!",
      memberSince: "సభ్యుడు నుండి",
      sortBy: "ద్వారా క్రమబద్ధీకరించండి",
      newest: "సరికొత్త",
      priceHighToLow: "ధర: అధిక నుండి తక్కువ",
      priceLowToHigh: "ధర: తక్కువ నుండి అధిక",
      popularity: "జనాదరణ"
    },
    mr: {
      noSeller: "विक्रेता सापडला नाही",
      noSellerDesc: "तुम्ही शोधत असलेला विक्रेता अस्तित्वात नाही किंवा हटविला गेला आहे.",
      goBack: "मागे जा",
      contactSeller: "विक्रेत्याशी संपर्क साधा",
      follow: "फॉलो करा",
      productsBy: "उत्पादने",
      noProducts: "या विक्रेत्याने अद्याप कोणतीही उत्पादने जोडली नाहीत.",
      checkBackLater: "नवीन जोडण्यांसाठी नंतर तपासा!",
      memberSince: "सदस्य पासून",
      sortBy: "क्रमवारी लावा",
      newest: "नवीनतम",
      priceHighToLow: "किंमत: उच्च ते कमी",
      priceLowToHigh: "किंमत: कमी ते उच्च",
      popularity: "लोकप्रियता"
    }
  };

  // Get translation function
  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key];
  };

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
    queryKey: ['sellerProducts', sellerId, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId);
      
      // Apply sorting
      switch (sortBy) {
        case "newest":
          query = query.order('created_at', { ascending: false });
          break;
        case "priceHighToLow":
          query = query.order('price', { ascending: false });
          break;
        case "priceLowToHigh":
          query = query.order('price', { ascending: true });
          break;
        // For popularity, we'd need additional metrics, fallback to newest
        default:
          query = query.order('created_at', { ascending: false });
      }
        
      const { data, error } = await query;
        
      if (error) {
        console.error("Error fetching seller products:", error);
        return [];
      }
      
      // Enhance products with seller information
      return data.map(product => ({
        ...product,
        seller_name: seller?.full_name || "Local Artisan",
        seller_avatar: seller?.avatar_url,
        seller_rating: seller?.rating || 4.5
      })) as ProductWithSellerInfo[];
    },
    enabled: !!sellerId && !!seller
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
          <h1 className="text-3xl font-bold mb-4">{t('noSeller')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('noSellerDesc')}
          </p>
          <Button onClick={() => window.history.back()}>
            {t('goBack')}
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  // Get seller info
  const sellerName = seller.full_name || "Rural Artisan";
  const sellerLocation = seller.location || "Rural Region";
  const sellerRating = seller.rating || 4.7;
  const sellerJoined = "2023"; // Default since created_at is no longer in the type
  const sellerImage = seller.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&auto=format&fit=crop";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Language selector */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 justify-end">
            <Button 
              variant={language === "en" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setLanguage("en")}
            >
              English
            </Button>
            <Button 
              variant={language === "hi" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setLanguage("hi")}
            >
              हिन्दी
            </Button>
            <Button 
              variant={language === "te" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setLanguage("te")}
            >
              తెలుగు
            </Button>
            <Button 
              variant={language === "mr" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setLanguage("mr")}
            >
              मराठी
            </Button>
          </div>
        </div>
        
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
                    <span>{t('memberSince')} {sellerJoined}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6 max-w-2xl">
                  {seller.bio || "An artisan bringing authentic rural products directly to you. Every purchase supports traditional craftsmanship and sustainable practices."}
                </p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Button>
                    <MessageSquare size={16} className="mr-2" />
                    {t('contactSeller')}
                  </Button>
                  <Button variant="outline">
                    {t('follow')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">{t('productsBy')} {sellerName}</h2>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden md:inline">{t('sortBy')}:</span>
              <div className="flex gap-2">
                {["newest", "priceHighToLow", "priceLowToHigh", "popularity"].map((option) => (
                  <Button
                    key={option}
                    size="sm"
                    variant={sortBy === option ? "default" : "outline"}
                    onClick={() => setSortBy(option)}
                  >
                    {t(option)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
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
              <p className="text-lg mb-2">{t('noProducts')}</p>
              <p className="text-muted-foreground">{t('checkBackLater')}</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SellerProfile;
