
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import CartProvider from "./components/CartProvider";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SellerDashboard from "./pages/SellerDashboard";
import Auth from "./pages/Auth";
import BrowseCategories from "./pages/BrowseCategories";
import SellerProfile from "./pages/SellerProfile";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import ProductDetail from "./pages/ProductDetail";
import ArtisansList from "./pages/ArtisansList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/browse" element={<BrowseCategories />} />
                <Route path="/browse/:category" element={<BrowseCategories />} />
                <Route path="/seller/:id" element={<SellerProfile />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/artisans" element={<ArtisansList />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/seller" element={
                  <ProtectedRoute>
                    <SellerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/account/orders" element={
                  <ProtectedRoute>
                    <SellerDashboard />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
