import { useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, Shield, Users, ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { MerchCard } from "@/components/MerchCard";
import { CartDrawer, type CartItem } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";

// Static images imports
import logo1 from "@assets/IMG_6514_1771755047663.jpeg";
import logo2 from "@assets/IMG_6515_1771755047663.webp";

// Mock products data
const PRODUCTS = [
  { id: "1", name: "קפוצ'ון פלוגתי", price: 120, imagePlaceholder: "HOODIE", requiresSize: true },
  { id: "2", name: "חולצת טריקו", price: 50, imagePlaceholder: "T-SHIRT", requiresSize: true },
  { id: "3", name: "חולצת דרייפיט", price: 60, imagePlaceholder: "DRI-FIT", requiresSize: true },
  { id: "4", name: "כובע טקטי", price: 40, imagePlaceholder: "HAT", requiresSize: false },
  { id: "5", name: "פאצ' פלוגתי", price: 20, imagePlaceholder: "PATCH", requiresSize: false },
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQ };
      }
      return item;
    }));
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
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-10" />
          {/* Abstract background pattern for engineering corps feeling */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
          <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/20 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 space-y-6 text-center md:text-start"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
                <Shield className="w-4 h-4" />
                חיל ההנדסה הקרבית
              </div>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]">
                משפחת <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-800">
                  פלוגה 603
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0 leading-relaxed">
                ברוכים הבאים לאתר הרשמי של הפלוגה. כאן תמצאו את המורשת, התמונות, השירים והמרצ'נדייז שלנו. תמיד ראשונים, תמיד מוכנים.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                <Button size="lg" className="h-14 px-8 text-lg rounded-xl" asChild>
                  <a href="#store">הזמנת ציוד פלוגתי</a>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl gap-2" asChild>
                  <a href="#songs">
                    <PlayCircle className="w-5 h-5" />
                    האזינו להמנון
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative w-full max-w-md mx-auto"
            >
              <div className="relative aspect-square">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
                <img 
                  src={logo1} 
                  alt="סמל פלוגה 603" 
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
          </div>
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
              <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                <div className="w-48 h-48 shrink-0 rounded-2xl overflow-hidden shadow-lg border-2 border-border">
                  <img src={logo2} alt="סמל פלוגה" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
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

      {/* GALLERY PLACEHOLDER */}
      <section id="gallery" className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">גלריית תמונות</h2>
              <div className="w-20 h-1.5 bg-primary rounded-full" />
            </div>
            <Button variant="ghost" className="gap-2 hidden sm:flex" asChild>
              <a href="https://drive.google.com/drive/folders/1y_eIUF4puky1ez8i0vH0Ml_ytEYgvFRZ" target="_blank" rel="noreferrer">
                צפה בכל התמונות בדרייב
                <ChevronLeft className="w-4 h-4" />
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-muted rounded-2xl overflow-hidden relative group">
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 text-zinc-500 font-bold p-6 text-center z-0">
                  תמונה מהדרייב מתעדכנת
                </div>
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                  <Button variant="secondary" size="sm">הגדל תמונה</Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" className="gap-2 w-full" asChild>
              <a href="https://drive.google.com/drive/folders/1y_eIUF4puky1ez8i0vH0Ml_ytEYgvFRZ" target="_blank" rel="noreferrer">
                צפה בכל התמונות בדרייב
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* SONGS SECTION */}
      <section id="songs" className="py-20 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">שירים ומורל</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
            <p className="mt-6 text-zinc-400 max-w-2xl mx-auto text-lg">
              הקליפ הרשמי של הפלוגה. שימו פליי, תגבירו את הווליום.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-zinc-800 bg-zinc-900 aspect-video md:aspect-[21/9]">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/euG7A3CuIlI?si=T6jS4qDFrta6oAGZ" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>

      {/* MERCH STORE */}
      <section id="store" className="py-24 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-black mb-4">חנות הפלוגה</h2>
            <div className="w-24 h-2 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              הצטיידו בציוד הרשמי של פלוגה 603. בחרו את הפריטים והוסיפו לסל כדי לבצע הזמנה מסודרת.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
