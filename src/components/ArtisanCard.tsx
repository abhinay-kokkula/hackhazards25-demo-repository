
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Check } from "lucide-react";

interface ArtisanCardProps {
  id: number;
  name: string;
  image: string;
  profession: string;
  location: string;
  rating: number;
  productCount: number;
  isVerified?: boolean;
}

const ArtisanCard = ({
  id,
  name,
  image,
  profession,
  location,
  rating,
  productCount,
  isVerified = false
}: ArtisanCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-border">
      <div className="flex items-center p-4">
        <div className="relative mr-3">
          <img 
            src={image} 
            alt={name} 
            className="w-16 h-16 rounded-full object-cover" 
          />
          {isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-accent text-white rounded-full p-0.5">
              <Check size={12} />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{name}</h3>
            <div className="flex items-center text-amber-500">
              <Star size={14} fill="currentColor" />
              <span className="text-xs ml-1">{rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {profession}
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <MapPin size={12} className="mr-1" />
            {location} • {productCount} products
          </div>
        </div>
      </div>
      
      <div className="border-t border-border p-3 bg-secondary/30 flex justify-between items-center">
        <Badge variant="outline" className="text-xs bg-white">
          View Profile
        </Badge>
        <Button variant="link" className="text-sm h-auto p-0 text-primary" size="sm">
          Shop Products
        </Button>
      </div>
    </div>
  );
};

export default ArtisanCard;
