
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative bg-accent/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/10 z-10"></div>
      
      <div className="relative container mx-auto px-4 py-16 md:py-24 z-20">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="flex justify-start mb-4">
              <Select defaultValue="en">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Language" />
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
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Direct From Rural <span className="text-primary">Artisans</span> & <span className="text-primary">Farmers</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Discover authentic handicrafts and farm-fresh products while directly supporting rural communities. Every purchase has a direct impact.
            </p>
            <div className="flex flex-wrap gap-4">
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
          
          <div className="md:w-1/2 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800&auto=format&fit=crop"
                  alt="Handwoven basket" 
                  className="rounded-lg shadow-lg" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop"
                  alt="Traditional pottery" 
                  className="rounded-lg shadow-lg" 
                />
              </div>
              <div className="space-y-4 mt-8">
                <img 
                  src="https://images.unsplash.com/photo-1590422749897-47036da0b0ff?w=800&auto=format&fit=crop"
                  alt="Handcrafted textile" 
                  className="rounded-lg shadow-lg" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1593510987185-1ec2256148f3?w=800&auto=format&fit=crop"
                  alt="Organic produce" 
                  className="rounded-lg shadow-lg" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
