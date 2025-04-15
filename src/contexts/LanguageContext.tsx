
import { createContext, useContext, useState, ReactNode } from 'react';
import { SupportedLanguage, Translations } from '@/types';

// Define the translation dictionary
const translations: Translations = {
  en: {
    // Navbar
    shop: "Shop",
    about: "About",
    sell: "Sell",
    search: "Search for products, artisans, or farms...",
    signIn: "Sign In / Sign Up",
    myOrders: "My Orders",
    sellerDashboard: "Seller Dashboard",
    signOut: "Sign out",
    cart: "Cart",
    
    // Hero
    heroTitle: "Direct From Rural Artisans & Farmers",
    heroSubtitle: "Discover authentic handicrafts and farm-fresh products while directly supporting rural communities. Every purchase has a direct impact.",
    shopNow: "Shop Now",
    exploreProducts: "Explore Products",
    
    // Categories
    featuredProducts: "Featured Products",
    viewAll: "View All",
    farmFreshProduce: "Farm Fresh Produce",
    
    // Impact Banner
    impactTitle: "Direct Impact on Rural Communities",
    impactDescription: "Every purchase you make directly supports rural artisans and farmers. By eliminating middlemen, more money goes back into local communities, helping preserve traditional crafts and sustainable farming practices.",
    goesToProducers: "Goes to Producers",
    ruralCommunities: "Rural Communities",
    directLivelihoods: "Direct Livelihoods",
    
    // CTA Section
    readyToShare: "Ready to Share Your Rural Crafts?",
    joinCommunity: "Join our community of artisans and farmers connecting directly with customers worldwide. No technical expertise needed - we'll help you every step of the way.",
    becomeSeller: "Become a Seller",
    learnMore: "Learn More",
    
    // Browse Categories
    browseAllCategories: "Browse All Categories",
    allCategories: "All Categories",
    searchProducts: "Search products...",
    noProductsFound: "No products found",
    viewAllCategories: "View all categories",
    
    // Product Details
    quantity: "Quantity",
    addToCart: "Add to Cart",
    sellerInfo: "Seller Information",
    viewProfile: "View Profile",
    productDescription: "Product Description",
    moreFromSeller: "More from this Seller",
    organic: "Organic",
  },
  
  hi: {
    // Navbar
    shop: "खरीदारी",
    about: "हमारे बारे में",
    sell: "बेचें",
    search: "उत्पाद, कारीगर, या खेत खोजें...",
    signIn: "साइन इन / साइन अप",
    myOrders: "मेरे ऑर्डर",
    sellerDashboard: "विक्रेता डैशबोर्ड",
    signOut: "साइन आउट",
    cart: "कार्ट",
    
    // Hero
    heroTitle: "सीधे ग्रामीण कारीगरों और किसानों से",
    heroSubtitle: "प्रामाणिक हस्तशिल्प और ताजा खेती के उत्पादों की खोज करें और सीधे ग्रामीण समुदायों का समर्थन करें। हर खरीद का सीधा प्रभाव होता है।",
    shopNow: "अभी खरीदें",
    exploreProducts: "उत्पाद देखें",
    
    // Categories
    featuredProducts: "विशेष उत्पाद",
    viewAll: "सभी देखें",
    farmFreshProduce: "ताजा खेती के उत्पाद",
    
    // Impact Banner
    impactTitle: "ग्रामीण समुदायों पर सीधा प्रभाव",
    impactDescription: "आपकी हर खरीद सीधे ग्रामीण कारीगरों और किसानों का समर्थन करती है। बिचौलियों को हटाकर, अधिक पैसा स्थानीय समुदायों में वापस जाता है, जिससे पारंपरिक शिल्प और टिकाऊ खेती के तरीकों को संरक्षित करने में मदद मिलती है।",
    goesToProducers: "उत्पादकों को जाता है",
    ruralCommunities: "ग्रामीण समुदाय",
    directLivelihoods: "प्रत्यक्ष आजीविका",
    
    // CTA Section
    readyToShare: "अपने ग्रामीण शिल्प साझा करने के लिए तैयार हैं?",
    joinCommunity: "दुनिया भर के ग्राहकों से सीधे जुड़ने वाले कारीगरों और किसानों के हमारे समुदाय से जुड़ें। कोई तकनीकी विशेषज्ञता की आवश्यकता नहीं - हम आपको हर कदम पर मदद करेंगे।",
    becomeSeller: "विक्रेता बनें",
    learnMore: "और जानें",
    
    // Browse Categories
    browseAllCategories: "सभी श्रेणियां ब्राउज़ करें",
    allCategories: "सभी श्रेणियां",
    searchProducts: "उत्पाद खोजें...",
    noProductsFound: "कोई उत्पाद नहीं मिला",
    viewAllCategories: "सभी श्रेणियां देखें",
    
    // Product Details
    quantity: "मात्रा",
    addToCart: "कार्ट में जोड़ें",
    sellerInfo: "विक्रेता जानकारी",
    viewProfile: "प्रोफाइल देखें",
    productDescription: "उत्पाद विवरण",
    moreFromSeller: "इस विक्रेता से और",
    organic: "जैविक",
  },
  
  te: {
    // Navbar
    shop: "షాప్",
    about: "మా గురించి",
    sell: "అమ్మండి",
    search: "ఉత్పత్తులు, శిల్పులు, లేదా వ్యవసాయాలు కోసం శోధించండి...",
    signIn: "సైన్ ఇన్ / సైన్ అప్",
    myOrders: "నా ఆర్డర్లు",
    sellerDashboard: "విక్రేత డాష్బోర్డ్",
    signOut: "సైన్ అవుట్",
    cart: "కార్ట్",
    
    // Hero
    heroTitle: "నేరుగా గ్రామీణ శిల్పులు & రైతుల నుండి",
    heroSubtitle: "అసలైన హస్తకళలు మరియు తాజా వ్యవసాయ ఉత్పత్తులను కనుగొనండి మరియు నేరుగా గ్రామీణ సమాజాలకు మద్దతు ఇవ్వండి. ప్రతి కొనుగోలు నేరుగా ప్రభావం చూపుతుంది.",
    shopNow: "ఇప్పుడు షాపింగ్ చేయండి",
    exploreProducts: "ఉత్పత్తులను అన్వేషించండి",
    
    // Categories
    featuredProducts: "విశిష్ట ఉత్పత్తులు",
    viewAll: "అన్నింటిని చూడండి",
    farmFreshProduce: "వ్యవసాయం నుండి తాజా ఉత్పత్తులు",
    
    // Impact Banner
    impactTitle: "గ్రామీణ సమాజాలపై నేరుగా ప్రభావం",
    impactDescription: "మీరు చేసే ప్రతి కొనుగోలు నేరుగా గ్రామీణ శిల్పులు మరియు రైతులకు మద్దతు ఇస్తుంది. మధ్యవర్తులను తొలగించడం ద్వారా, ఎక్కువ డబ్బు స్థానిక సమాజాలకు తిరిగి వెళ్తుంది, సాంప్రదాయిక శిల్పాలు మరియు స్థిరమైన వ్యవసాయ పద్ధతులను కాపాడటానికి సహాయపడుతుంది.",
    goesToProducers: "ఉత్పత్తిదారులకు వెళ్తుంది",
    ruralCommunities: "గ్రామీణ సమాజాలు",
    directLivelihoods: "నేరుగా జీవనోపాధి",
    
    // CTA Section
    readyToShare: "మీ గ్రామీణ కళలను పంచుకోవడానికి సిద్ధంగా ఉన్నారా?",
    joinCommunity: "ప్రపంచవ్యాప్తంగా వినియోగదారులతో నేరుగా కలిసే శిల్పుల మరియు రైతుల మా సమాజంలో చేరండి. సాంకేతిక నిపుణత అవసరం లేదు - మేము మీకు ప్రతి అడుగులో సహాయం చేస్తాము.",
    becomeSeller: "విక్రేత కావడానికి",
    learnMore: "మరింత తెలుసుకోండి",
    
    // Browse Categories
    browseAllCategories: "అన్ని వర్గాలను చూడండి",
    allCategories: "అన్ని వర్గాలు",
    searchProducts: "ఉత్పత్తులను శోధించండి...",
    noProductsFound: "ఉత్పత్తులు కనుగొనబడలేదు",
    viewAllCategories: "అన్ని వర్గాలను చూడండి",
    
    // Product Details
    quantity: "పరిమాణం",
    addToCart: "కార్ట్‌కి జోడించండి",
    sellerInfo: "విక్రేత సమాచారం",
    viewProfile: "ప్రొఫైల్ చూడండి",
    productDescription: "ఉత్పత్తి వివరణ",
    moreFromSeller: "ఈ విక్రేత నుండి మరిన్ని",
    organic: "సేంద్రీయ",
  },
  
  mr: {
    // Navbar
    shop: "दुकान",
    about: "आमच्याबद्दल",
    sell: "विक्री करा",
    search: "उत्पादने, कारागीर, किंवा शेतीसाठी शोधा...",
    signIn: "साइन इन / साइन अप",
    myOrders: "माझे ऑर्डर्स",
    sellerDashboard: "विक्रेता डॅशबोर्ड",
    signOut: "साइन आउट",
    cart: "कार्ट",
    
    // Hero
    heroTitle: "ग्रामीण कारागीर आणि शेतकऱ्यांकडून थेट",
    heroSubtitle: "प्रामाणिक हस्तकला आणि ताज्या शेतीची उत्पादने शोधा आणि थेट ग्रामीण समुदायांना समर्थन द्या. प्रत्येक खरेदीचा थेट प्रभाव पडतो.",
    shopNow: "आता खरेदी करा",
    exploreProducts: "उत्पादने एक्सप्लोर करा",
    
    // Categories
    featuredProducts: "फीचर्ड उत्पादने",
    viewAll: "सर्व पहा",
    farmFreshProduce: "शेतातून ताजी उत्पादने",
    
    // Impact Banner
    impactTitle: "ग्रामीण समुदायांवर थेट प्रभाव",
    impactDescription: "तुम्ही केलेली प्रत्येक खरेदी थेट ग्रामीण कारागीर आणि शेतकऱ्यांना समर्थन देते. मध्यस्थांना दूर करून, अधिक पैसा स्थानिक समुदायांकडे परत जातो, पारंपारिक कला आणि शाश्वत शेती पद्धतींचे संवर्धन करण्यास मदत होते.",
    goesToProducers: "उत्पादकांकडे जाते",
    ruralCommunities: "ग्रामीण समुदाय",
    directLivelihoods: "थेट उपजीविका",
    
    // CTA Section
    readyToShare: "तुमची ग्रामीण कला शेअर करण्यास तयार आहात?",
    joinCommunity: "जगभरातील ग्राहकांशी थेट जोडणाऱ्या कारागीर आणि शेतकऱ्यांच्या आमच्या समुदायात सामील व्हा. कोणत्याही तांत्रिक कौशल्याची आवश्यकता नाही - आम्ही तुम्हाला प्रत्येक टप्प्यावर मदत करू.",
    becomeSeller: "विक्रेता व्हा",
    learnMore: "अधिक जाणून घ्या",
    
    // Browse Categories
    browseAllCategories: "सर्व श्रेणी ब्राउझ करा",
    allCategories: "सर्व श्रेणी",
    searchProducts: "उत्पादने शोधा...",
    noProductsFound: "उत्पादने सापडली नाहीत",
    viewAllCategories: "सर्व श्रेणी पहा",
    
    // Product Details
    quantity: "प्रमाण",
    addToCart: "कार्टमध्ये जोडा",
    sellerInfo: "विक्रेता माहिती",
    viewProfile: "प्रोफाइल पहा",
    productDescription: "उत्पादन वर्णन",
    moreFromSeller: "या विक्रेत्याकडून अधिक",
    organic: "सेंद्रिय",
  }
};

type LanguageContextType = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  
  const t = (key: string): string => {
    // Return the translation for the current language or fallback to English
    return translations[language]?.[key] || translations.en?.[key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
