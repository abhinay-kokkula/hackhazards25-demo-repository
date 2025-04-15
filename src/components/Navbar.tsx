
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, ShoppingBag, Menu, X, User, LogOut, ShoppingCart, Store, Globe 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from './AuthProvider';
import { useCart } from './CartProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SupportedLanguage } from "@/types";

// Different supported languages
const languages: { code: SupportedLanguage; name: string }[] = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी (Hindi)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "mr", name: "मराठी (Marathi)" }
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value as SupportedLanguage);
    // Here you would typically update some global language state
    // or use a translation context to change the app language
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              RC
            </div>
            <span className="font-bold text-xl">RuralConnect</span>
          </Link>
          
          {/* Search bar - hidden on mobile */}
          {!isMobile && (
            <div className="flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search for products, artisans, or farms..." 
                    className="pl-9 pr-4 py-2 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          )}

          {/* Nav links - visible on desktop */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/browse" className="text-foreground hover:text-primary transition-colors">Shop</Link>
              
              {/* Language Selector */}
              <div className="relative flex items-center">
                <Select defaultValue={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[130px] h-8 text-sm border-none bg-transparent hover:text-primary transition-colors focus:ring-0">
                    <Globe className="mr-1 h-4 w-4" />
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Link to="/" className="text-foreground hover:text-primary transition-colors">About</Link>
              <Link to="/seller" className="text-foreground hover:text-primary transition-colors">Sell</Link>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start p-2">
                    <div className="ml-2 space-y-1">
                      <p className="text-sm font-medium leading-none">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/seller")} className="cursor-pointer">
                    <Store className="mr-2 h-4 w-4" />
                    <span>Seller Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/account/orders")} className="cursor-pointer">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => navigate("/auth")}>
                <User size={20} />
              </Button>
            )}
            
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => navigate("/cart")}>
                <ShoppingBag size={20} />
              </Button>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white rounded-full text-xs flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile search - only visible on mobile */}
        {isMobile && (
          <div className="mt-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search..." 
                  className="pl-9 pr-4 py-2 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
        )}
        
        {/* Mobile menu */}
        {isMobile && isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b border-border p-4 shadow-md animate-gentle-appear">
            <div className="flex flex-col space-y-3">
              <Link to="/browse" className="text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Shop</Link>
              <Link to="/" className="text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/seller" className="text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Sell</Link>
              <Link to="/cart" className="text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Cart ({totalItems})</Link>
              
              {/* Language options for mobile */}
              <div className="py-2">
                <p className="text-sm text-muted-foreground mb-2">Language:</p>
                <div className="flex flex-wrap gap-2">
                  {languages.map(lang => (
                    <Button 
                      key={lang.code}
                      size="sm" 
                      variant={language === lang.code ? "default" : "outline"}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsMenuOpen(false);
                      }}
                    >
                      {lang.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              {!user && (
                <Link to="/auth" className="text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Sign In / Sign Up</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
