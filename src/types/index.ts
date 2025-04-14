
export interface ProductWithSellerInfo {
  id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
  category?: string;
  location?: string;
  is_organic?: boolean;
  seller_id: string;
  seller_name?: string;
  seller_avatar?: string;
  seller_rating?: number;
}

export interface SellerProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  rating?: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description?: string;
}

export interface ProductDetail extends ProductWithSellerInfo {
  description: string;
}

export interface ArtisanData {
  id: number | string;
  name: string;
  image: string;
  profession: string;
  location: string;
  rating: number;
  productCount: number;
  isVerified?: boolean;
}
