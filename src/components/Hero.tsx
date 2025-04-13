
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative bg-gradient-to-r from-amber-50 to-orange-50">
      <div className="absolute inset-0 rural-pattern-bg opacity-30"></div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-gentle-appear">
            From Rural Hands <br />to Your Home
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl animate-gentle-appear" style={{animationDelay: '0.1s'}}>
            Discover authentic handcrafted products and farm-fresh goods directly from rural artisans and farmers. 
            No middlemen, just real connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-gentle-appear" style={{animationDelay: '0.2s'}}>
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
              Shop Now
            </Button>
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg"
              onClick={() => navigate('/seller')}
            >
              Become a Seller
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
