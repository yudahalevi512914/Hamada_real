import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Shield, Users, ChevronLeft, Music } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { MerchCard } from "@/components/MerchCard";
import { CartDrawer, type CartItem } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";

// Static images imports
import logo1 from "@assets/IMG_6514_1771755047663.jpeg";
import logo2 from "@assets/IMG_6515_1771755047663.webp";

const PRODUCTS = [
  { 
    id: "1", 
    name: "קפוצ'ון פלוגתי", 
    price: 120, 
    images: ["/image/products/cap-1.png","/image/products/cap-1.png"],
    requiresSize: true 
  },
  { 
    id: "2", 
    name: "חולצת דרייפיט", 
    price: 50, 
    images: ["/image/products/drifit-1.PNG", "/image/products/drifit-2.PNG", "/image/products/drifit-3.PNG", "/image/products/drifit-4.PNG", "/image/products/drifit-5.PNG"],
    requiresSize: true 
  },
  { 
    id: "3", 
    name: "חולצת דרייפיט", 
    price: 60, 
    images: ["/image/products/drifit-1.jpg", "/image/products/drifit-1.jpg"],
    requiresSize: true 
  },
  { 
    id: "4", 
    name: "כובע טקטי", 
    price: 40, 
    images: ["/image/products/hat-1.PNG", "/image/products/hat-2.PNG", "/image/products/hat-3.PNG", "/image/products/hat-4.PNG"],
    requiresSize: false 
  },
  { 
    id: "5", 
    name: "פאצ' פלוגתי", 
    price: 20, 
    images: ["/image/products/patch-1.PNG", "/image/products/patch-2.PNG"],
    requiresSize: false 
  },
];


export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // לוגיקת החלפת תמונות בגלריה (קדימון)
  useEffect(() => {
    const timer = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const updateSize = (id: string, size: string) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, size } : item));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-10" />
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
          <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/20 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2 mx-auto">
              <Shield className="w-4 h-4" />
              חיל ההנדסה הקרבית
            </div>
            
            <h1 className="font-display text-6xl md:text-8xl font-black tracking-tight leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-800">
                פלוגה 603
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl font-bold text-muted-foreground tracking-widest uppercase opacity-80">
              אוגוסט 2025
            </p>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              ברוכים הבאים לאתר הרשמי של הפלוגה. כאן תמצאו את המורשת, התמונות, השירים והמרצ'נדייז שלנו. תמיד ראשונים, תמיד מוכנים.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button size="lg" className="h-14 px-8 text-lg rounded-xl" asChild>
                <a href="#store">הזמנת ציוד פלוגתי</a>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl gap-2" asChild>
                <a href="#songs">
                  <PlayCircle className="w-5 h-5" />
                  שירי הפלוגה
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">מי אנחנו?</h2>
              <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
            </div>
            
            <div className="bg-card rounded-3xl p-8 md:p-12 shadow-xl border border-border/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
              <div className="flex flex-col md:flex-row gap-8 items-center relative z-10 text-right">
                <div className="w-48 h-48 shrink-0 rounded-2xl overflow-hidden shadow-lg border-2 border-border">
                  <img src={logo2} alt="סמל פלוגה" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2 justify-start">
                    <Users className="text-primary w-6 h-6" />
                    מורשת וגאווה
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    פלוגה 603 מהווה חוד החנית של חיל ההנדסה הקרבית. אנו מתמחים בפריצת מכשולים, חבלה, לוחמת מנהרות וסיוע הנדסי בתמרון. הלוחמים שלנו נבחרים בקפידה ועוברים מסלול הכשרה מפרך כדי להיות המקצועיים ביותר בשדה הקרב.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY (CAROUSEL) */}
      <section id="gallery" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-10 text-center">
            <h2 className="font-display text-4xl font-bold mb-4">הגלריה שלנו</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          </div>

          <div className="relative max-w-4xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-background group bg-zinc-900">
            <AnimatePresence mode="wait">
              <motion.div 
                key={galleryIndex} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                transition={{ duration: 0.7 }} 
                className="absolute inset-0 flex items-center justify-center text-zinc-500 font-bold"
              >
                 תמונה מהמסלול {galleryIndex + 1}
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute bottom-6 right-6 z-10">
              <Link href="/gallery">
                <Button variant="secondary" size="lg" className="rounded-xl font-bold shadow-lg">
                  לצפייה בכל התמונות באתר
                  <ChevronLeft className="ms-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
       {/* SONGS SECTION - UPDATED DESIGN */}
      <section id="songs" className="py-24 bg-[#09090b] relative overflow-hidden">
        {/* אפקט תאורה אחורי חזק יותר להפרדה */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
                שירי <span className="text-primary italic">הפלוגה</span>
              </h2>
              <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
            </motion.div>
          </div>

          {/* וידאו עם אפקט Hover */}
          <div className="max-w-4xl mx-auto mb-16 px-2">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5 bg-zinc-900 group">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/euG7A3CuIlI" 
                title="YouTube" 
                frameBorder="0" 
                allowFullScreen
                className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              ></iframe>
            </div>
          </div>

          {/* כפתור "זכוכית" משופר */}
          <div className="flex justify-center pb-8">
            <Link href="/songs">
              <motion.button
                whileHover={{ scale: 1.05, translateY: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-5 px-8 py-5 bg-zinc-900/80 backdrop-blur-xl border border-primary/40 rounded-2xl text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-primary transition-all duration-300"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 bg-primary/20 p-3 rounded-xl">
                  <Music className="w-6 h-6 text-primary" />
                </div>
                
                <div className="relative z-10 text-right">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-1"></span>
                  <span className="block text-xl font-bold tracking-tight">כל השירים</span>
                </div>

                <ChevronLeft className="relative z-10 w-5 h-5 text-zinc-500 group-hover:text-primary group-hover:-translate-x-1 transition-all" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>


{/* MERCH STORE */}
<section id="store" className="py-24 relative">
  <div className="container mx-auto px-4 md:px-6 text-center">
    <h2 className="font-display text-4xl md:text-5xl font-black mb-4">חנות הפלוגה</h2>
    <div className="w-24 h-2 bg-primary mx-auto rounded-full mb-12" />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-right">
      {PRODUCTS.map(product => (
        <MerchCard 
          key={product.id}
          product={product} // <-- מעבירים את כל האובייקט תחת השם product
          addToCart={addToCart} // <-- מעבירים את הפונקציה עצמה
        />
      ))}
    </div>
  </div>
</section>


      {/* FOOTER */}
      <footer className="bg-zinc-950 text-zinc-400 py-12 border-t border-zinc-900">
        <div className="container mx-auto px-4 text-center">
          <Shield className="w-10 h-10 text-primary mx-auto mb-6 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">פלוגה 603 - חיל ההנדסה הקרבית</h3>
          <p className="text-sm opacity-60">האתר נבנה בגאווה עבור לוחמי הפלוגה.</p>
        </div>
      </footer>

    <CartDrawer 
  items={cart} // וודא שזה cart ולא PRODUCTS
  updateQuantity={updateQuantity}
  updateSize={updateSize}
  removeItem={removeItem}
  clearCart={() => setCart([])}
/>

    </div>
  );
}
