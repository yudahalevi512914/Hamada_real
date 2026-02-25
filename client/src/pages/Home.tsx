import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Shield, Users, ChevronLeft, Music } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { MerchCard } from "@/components/MerchCard";
import { CartDrawer, type CartItem } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

const UNIT_SONGS = [
  { 
    title: "שיר סוגרי השבתות", 
    content: `יום רביעי, הסופ״ש כבר מורגש בידיים\nמדי א בשלוף בארון\nהסמל אומר תכין כומתה תגלחצ נעליים\nאתה עולה משפט למ״פ אתה נכנס\nהנה יום הדין הגיע.\nפתאום אני טיפה לחוץ שולף תירוץ אחרי תירוץ\nעל המפ זה לא משפיע\n\nבהלצ שישי בצהריים\nסופ שבוע זה רק אני בס והממ של שתיים\nכל הנבחרים פה בפלוגה\nהתחצפות כוננות והפקרה אחד גם על חצי מימיה\nהנה עוד שיחה מאמא\nיא איבני איך אתה תלמד\nלא מטווסים עם כל אחד\nהשארת אותנו פה לבד…\n\nיום ראשון\nאמא אומרת הגזמת\nתיזהר\nהשבת אצל סבא וסבתא\nאני אומר לה תירגעי\nהשבוע אני נקי\nלא יהיה פה שום אירוע\n\nכל השבוע אני ספץ פתאום המפקד שוב מתפוצץ\nבסהכ רציתי פיצה`,
    special: true 
  },
  { 
    title: "שיר למ״פ", 
    content: `טירונות הנפצות ואבנונים\nחצי פלוגה פה חדולים\nהמפ מנפיץ את המפקדים\nגם אם נראה שהשחר לא יפציע לעולם\nהנה בא מ״פ חדש\nגם אם זה נראה שהשחר לא יפציע לעולם\nיאללה כולם תעשו כאן רעש\n\nמ״פ נעול, חולה על בית\nיושב לו בול במדים של זית\nאין בלבולי מח הוא נשבע\nנעלמו החדולים מהפלוגה`
  },
  { 
    title: "שיר למ״מ", 
    content: `היה היה מ״מ, קראו לו העכבר,\nתפקיד אחרי תפקיד בבהלת תמיד היום כל זה נגמר x2.\nאווו הוא עולה לגדוד הוא עולה לגדוד הוא עולה לגדוד הוא עולה לגדוד.`
  },
  { title: "שיר למפקד אמיר", content: "המפקד אמיר, יאללה המפקד אמיר, יאללה המפקד אמיר, יאללה המפקד אמיר" },
  { title: "שיר המחלקה", content: "מחלקה 4 יאללה מחלקה 4 יאללה מחלקה 4 יאללה מחלקה 4 יותר חזק מחלקה 4 יאללה מחלקה 4 יאללה מחלקה 4 יאללה מחלקה 4" }
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

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
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2 mx-auto">
              <Shield className="w-4 h-4" /> חיל ההנדסה הקרבית
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight"><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-800">פלוגה 603</span></h1>
            <p className="text-xl md:text-2xl font-bold text-muted-foreground tracking-widest uppercase opacity-80">אוגוסט 2025</p>
            <div className="flex justify-center gap-4 pt-4">
              <Button size="lg" className="h-14 px-8 rounded-xl" asChild><a href="#store">הזמנת ציוד</a></Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-xl gap-2" asChild><a href="#songs"><PlayCircle className="w-5 h-5" />שירי פלוגה</a></Button>
            </div>
          </motion.div>
        </div>
      </section>

            {/* GALLERY (CAROUSEL) */}
      <section id="gallery" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-10">
            <h2 className="text-4xl font-bold mb-4">הגלריה שלנו</h2>
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
                 {/* כאן ה-Carousel ממשיך לרוץ כקדימון */}
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
      <section id="songs" className="py-24 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-black italic text-primary mb-4">שירי הפלוגה והמורל</h2>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
            <p className="mt-6 text-zinc-400 max-w-2xl mx-auto text-lg">
              צפו בקליפ הפלוגה הרשמי ולחצו למטה כדי לראות את כל שירי המורל והטקסטים של 603.
            </p>
          </div>

          {/* סרטון היוטיוב המרכזי */}
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-zinc-800 bg-zinc-900 aspect-video mb-12">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/euG7A3CuIlI" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>

          {/* כפתור מעבר לעמוד השירים המלא */}
          <div className="text-center">
            <Link href="/songs">
              <Button size="lg" className="h-16 px-12 text-xl rounded-2xl gap-3 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:scale-105 transition-transform">
                <Music className="w-6 h-6" />
                לכל שירי ומורלי הפלוגה (טקסטים)
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* STORE */}
      <section id="store" className="py-24"><div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-12">חנות הפלוגה</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-right">
            {PRODUCTS.map(p => <MerchCard key={p.id} {...p} onAdd={() => addToCart(p)} />)}
          </div>
      </div></section>

      <footer className="bg-zinc-950 py-12 border-t border-zinc-900 text-center text-zinc-500">
        <Shield className="w-10 h-10 text-primary mx-auto mb-4 opacity-50" />
        <p className="font-bold text-white">פלוגה 603 - חיל ההנדסה הקרבית</p>
      </footer>

      <CartDrawer items={cart} updateQuantity={updateQuantity} updateSize={updateSize} removeItem={removeItem} clearCart={() => setCart([])} />
    </div>
  );
}

