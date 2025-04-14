
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "./CartProvider";

interface ProductCardProps {
  id: number | string;
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
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      image,
      sellerName: artisan
    });
  };
  
  return (
    <div 
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        <Link to={`/product/${id}`}>
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </Link>
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
          <Link to={`/product/${id}`}>
            <h3 className="font-medium text-lg line-clamp-1 hover:text-primary transition-colors">{name}</h3>
          </Link>
          <div className="flex items-center text-amber-500">
            <Star size={14} fill="currentColor" />
            <span className="text-xs ml-1">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="mb-3 text-sm text-muted-foreground">
          by <Link to={`/seller/${id}`} className="hover:text-primary transition-colors">{artisan}</Link> • {location}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="font-medium text-lg">${price.toFixed(2)}</div>
          <Button 
            size="sm" 
            className={`flex items-center gap-1 ${isHovered ? 'bg-primary text-white' : 'bg-secondary text-foreground'}`}
            onClick={handleAddToCart}
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
