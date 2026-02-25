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
  { id: "1", name: "קפוצ'ון פלוגתי", price: 120, imagePlaceholder: "HOODIE", requiresSize: true },
  { id: "2", name: "חולצת טריקו", price: 50, imagePlaceholder: "T-SHIRT", requiresSize: true },
  { id: "3", name: "חולצת דרייפיט", price: 60, imagePlaceholder: "DRI-FIT", requiresSize: true },
  { id: "4", name: "כובע טקטי", price: 40, imagePlaceholder: "HAT", requiresSize: false },
  { id: "5", name: "פאצ' פלוגתי", price: 20, imagePlaceholder: "PATCH", requiresSize: false },
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
      {/* SONGS SECTION (YOUTUBE + LINK TO PAGE) */}
      <section id="songs" className="py-24 bg-zinc-950 relative overflow-hidden">
        {/* אפקט תאורה עדין ברקע */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.05)_0%,transparent_70%)]" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-4 tracking-tight">
                מורשת <span className="text-primary">בצלילים</span>
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6" />
              <p className="text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed">
                צפו בקליפ הפלוגה הרשמי והתחברו לאווירה. 
                לכל שירי המורל והטקסטים, לחצו על הכפתור למטה.
              </p>
            </motion.div>
          </div>

          {/* נגן וידאו עם מסגרת מעוצבת */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-zinc-900 group">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/euG7A3CuIlI" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="w-full h-full grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </div>

          {/* כפתור מעוצב מחדש - זכוכית וזהב */}
          <div className="flex justify-center">
            <Link href="/songs">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex items-center gap-4 px-10 py-5 bg-zinc-900/50 backdrop-blur-md border border-primary/30 rounded-2xl text-white overflow-hidden transition-all hover:border-primary"
              >
                {/* אפקט תאורה פנימי בתוך הכפתור */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <div className="bg-primary/20 p-3 rounded-xl group-hover:bg-primary/30 transition-colors">
                  <Music className="w-6 h-6 text-primary" />
                </div>
                
                <div className="text-right">
                  <span className="block text-xs uppercase tracking-widest text-primary font-bold">לכל הטקסטים</span>
                  <span className="block text-xl font-bold italic">שירי ומורלי הפלוגה</span>
                </div>

                <ChevronLeft className="w-5 h-5 text-zinc-500 group-hover:text-primary group-hover:-translate-x-1 transition-all" />
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
                {...product}
                onAdd={() => addToCart(product)}
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

      {/* Global Cart Drawer */}
      <CartDrawer 
        items={cart}
        updateQuantity={updateQuantity}
        updateSize={updateSize}
        removeItem={removeItem}
        clearCart={() => setCart([])}
      />
    </div>
  );
}
