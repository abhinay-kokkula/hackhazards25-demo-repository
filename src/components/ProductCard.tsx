
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Star } from "lucide-react";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  artisan: string;
  location: string;
  rating: number;
  isFeatured?: boolean;
  isOrganic?: boolean;
}

const ProductCard = ({ 
  id, 
  name, 
  price, 
  image, 
  artisan, 
  location, 
  rating, 
  isFeatured = false,
  isOrganic = false
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        {isFeatured && (
          <Badge 
            className="absolute top-2 left-2 bg-primary text-white"
          >
            Featured
          </Badge>
        )}
        {isOrganic && (
          <Badge 
            className="absolute top-2 right-2 bg-accent text-white"
          >
            Organic
          </Badge>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-muted-foreground hover:text-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ display: isOrganic ? 'none' : 'flex' }}
        >
          <Heart size={16} />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-lg line-clamp-1">{name}</h3>
          <div className="flex items-center text-amber-500">
            <Star size={14} fill="currentColor" />
            <span className="text-xs ml-1">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="mb-3 text-sm text-muted-foreground">
          by {artisan} • {location}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="font-medium text-lg">${price.toFixed(2)}</div>
          <Button 
            size="sm" 
            className={`flex items-center gap-1 ${isHovered ? 'bg-primary text-white' : 'bg-secondary text-foreground'}`}
          >
            <ShoppingBag size={16} />
            {isHovered ? 'Add to Cart' : 'Buy'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
