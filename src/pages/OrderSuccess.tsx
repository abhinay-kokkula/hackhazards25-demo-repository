
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronRight, Package, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const OrderSuccess = () => {
  const navigate = useNavigate();
  
  // Generate random order number
  const orderNumber = `RC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  
  // Redirect if page is accessed directly without checkout
  useEffect(() => {
    const hasOrderCompleted = sessionStorage.getItem("orderCompleted");
    if (!hasOrderCompleted) {
      sessionStorage.setItem("orderCompleted", "true");
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle size={64} className="text-primary" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your order has been received and is being processed. A confirmation email has been sent to your email address.
          </p>
          
          <div className="bg-white border border-border rounded-lg shadow-sm p-6 mb-8">
            <div className="mb-4 pb-4 border-b border-border">
              <div className="text-sm text-muted-foreground mb-1">Order Number</div>
              <div className="text-xl font-medium">{orderNumber}</div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1">
                  <Package size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Order Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Your order is being prepared by our rural artisans and farmers.
                    You'll receive a notification when it ships.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1">
                  <Truck size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Estimated Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Your order should arrive within 5-7 business days.
                    Track your order status in your account.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              className="gap-2"
              onClick={() => navigate("/browse")}
            >
              Continue Shopping <ChevronRight size={16} />
            </Button>
            <Button variant="outline" onClick={() => navigate("/account/orders")}>
              View Order
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderSuccess;
