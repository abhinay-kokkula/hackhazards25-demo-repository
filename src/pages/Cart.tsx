
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, ChevronRight } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  
  // Constants for pricing
  const shipping = 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Handle quantity changes
  const handleQuantityChange = (id: string | number, change: number) => {
    const item = cart.find(item => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateQuantity(id, newQuantity);
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please sign in to checkout");
      navigate("/auth", { state: { returnUrl: "/cart" } });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create an order in Supabase
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          total_amount: total,
          status: 'paid',
          shipping_address: null // Would be filled with actual address in a real app
        });
        
      if (error) throw error;
      
      // Clear cart and navigate to success page
      clearCart();
      toast.success("Payment successful! Your order has been placed.");
      navigate("/order-success");
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.trim() === "") {
      toast.error("Please enter a valid promo code");
      return;
    }
    
    toast.error("This promo code is invalid or has expired");
    setPromoCode("");
  };

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button 
              className="px-8" 
              size="lg"
              onClick={() => navigate("/browse")}
            >
              Browse Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex-1">Shopping Cart</h1>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-muted-foreground"
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-secondary/20">
                <div className="flex justify-between text-sm font-medium">
                  <div className="w-2/5">Product</div>
                  <div className="w-1/5 text-center">Price</div>
                  <div className="w-1/5 text-center">Quantity</div>
                  <div className="w-1/5 text-right">Total</div>
                </div>
              </div>
              
              <div className="divide-y divide-border">
                {cart.map(item => (
                  <div key={item.id} className="p-4 flex items-center">
                    <div className="w-2/5 flex items-center gap-3">
                      <div className="w-16 h-16 rounded overflow-hidden bg-secondary/20">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {item.sellerName || "Local Artisan"}
                        </div>
                        <button 
                          className="text-xs text-red-600 mt-1 flex items-center" 
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 size={12} className="mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="w-1/5 text-center">
                      ${item.price.toFixed(2)}
                    </div>
                    <div className="w-1/5 flex items-center justify-center">
                      <div className="flex items-center border rounded overflow-hidden">
                        <button 
                          className="p-1 px-2 hover:bg-secondary"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button 
                          className="p-1 px-2 hover:bg-secondary"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="w-1/5 text-right font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium mb-3">Have a promo code?</h3>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter promo code" 
                  className="max-w-xs"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button variant="outline" onClick={applyPromoCode}>
                  Apply
                </Button>
              </div>
            </div>
          </div>
          
          {/* Order summary */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                disabled={isProcessing}
                onClick={handleCheckout}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Checkout
                  </>
                )}
              </Button>
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p className="mb-2">We accept:</p>
                <div className="flex space-x-2">
                  <div className="w-10 h-6 bg-secondary rounded"></div>
                  <div className="w-10 h-6 bg-secondary rounded"></div>
                  <div className="w-10 h-6 bg-secondary rounded"></div>
                  <div className="w-10 h-6 bg-secondary rounded"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Need help? <a href="#" className="text-primary hover:underline">Contact support</a></p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
