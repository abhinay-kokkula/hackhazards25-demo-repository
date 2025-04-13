
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                RC
              </div>
              <span className="font-bold text-xl">RuralConnect</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Connecting rural artisans and farmers directly to customers, 
              bypassing middlemen and strengthening local economies.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">All Products</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Featured Items</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">New Arrivals</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Discounted</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Sell</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Become a Seller</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Seller Guidelines</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Success Stories</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Resources</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Help</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-6 mt-6 text-sm text-muted-foreground text-center">
          <p>© {new Date().getFullYear()} RuralConnect. All rights reserved.</p>
          <p className="mt-1">Empowering rural communities through direct commerce.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
