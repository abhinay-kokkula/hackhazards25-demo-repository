
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/5 to-background">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-primary/40 to-accent/40 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-gradient-to-r from-accent/40 to-primary/40 blur-3xl"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
            {t('heroTitle').split(' ').map((word, i) => (
              <span key={i} className={i % 3 === 0 ? "text-primary" : ""}>
                {word}{' '}
              </span>
            ))}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
            {t('heroSubtitle')}
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <Button 
              size="lg"
              onClick={() => navigate("/browse")}
              className="px-8 text-base bg-primary text-white hover:bg-primary/90"
            >
              {t('shopNow')}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/seller")}
              className="px-8 text-base border-primary text-primary hover:bg-primary/10"
            >
              {t('becomeSeller')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
