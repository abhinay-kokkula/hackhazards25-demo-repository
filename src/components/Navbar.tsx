
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              RC
            </div>
            <span className="font-bold text-xl">RuralConnect</span>
          </div>
          
          {/* Search bar - hidden on mobile */}
          {!isMobile && (
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search for products, artisans, or farms..." 
                  className="pl-9 pr-4 py-2 w-full" 
                />
              </div>
            </div>
          )}

          {/* Nav links - visible on desktop */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-foreground hover:text-primary transition-colors">Shop</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">Artisans</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">About</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">Sell</a>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <User size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingBag size={20} />
              <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-white rounded-full text-xs flex items-center justify-center">2</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile search - only visible on mobile */}
        {isMobile && (
          <div className="mt-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 w-full" 
              />
            </div>
          </div>
        )}
        
        {/* Mobile menu */}
        {isMobile && isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b border-border p-4 shadow-md animate-gentle-appear">
            <div className="flex flex-col space-y-3">
              <a href="#" className="text-foreground hover:text-primary transition-colors py-2">Shop</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors py-2">Artisans</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors py-2">About</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors py-2">Sell</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
