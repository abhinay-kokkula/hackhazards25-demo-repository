
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative bg-accent/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/10 z-10"></div>
      
      <div className="relative container mx-auto px-4 py-16 md:py-24 z-20">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-3xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Direct From Rural <span className="text-primary">Artisans</span> & <span className="text-primary">Farmers</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover authentic handicrafts and farm-fresh products while directly supporting rural communities. Every purchase has a direct impact.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/browse")}
                className="px-8"
              >
                Shop Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/browse")}
                className="px-8"
              >
                Explore Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
