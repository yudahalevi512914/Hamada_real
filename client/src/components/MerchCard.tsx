import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export function MerchCard({ product, addToCart }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // הגנה ובדיקת תמונות
  const images = product?.images || [];
  const hasMultiple = images.length > 1;

  // החלפה אוטומטית (Auto-play)
  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // מחליף תמונה כל 4 שניות
    return () => clearInterval(timer);
  }, [hasMultiple, images.length]);

  if (!product) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-[2rem] overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-500 shadow-2xl"
    >
      {/* אזור התמונה המעוצב */}
   <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900 flex items-center justify-center p-4">
  {/* אינדיקטורים בסגנון סטורי */}
  {hasMultiple && (
    <div className="absolute top-4 inset-x-4 z-30 flex gap-1.5">
      {images.map((_: any, i: number) => (
        <div key={i} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: i === currentIndex ? "100%" : i < currentIndex ? "100%" : "0%" }}
            transition={{ 
              duration: i === currentIndex ? 4 : 0.4, 
              ease: i === currentIndex ? "linear" : "easeInOut" 
            }}
            className="h-full bg-primary shadow-[0_0_8px_rgba(234,179,8,0.6)]"
          />
        </div>
      ))}
    </div>
  )}

  {/* תמונות עם אפקט Cross-fade חלק */}
  <div className="relative w-full h-full">
    <AnimatePresence mode="popLayout">
      <motion.img
        key={currentIndex}
        src={images[currentIndex]}
        alt={product.name}
        // האנימציה המעודכנת:
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ 
          duration: 0.9, 
          ease: [0.4, 0, 0.2, 1] // קצב תנועה מקצועי (Cubic Bezier)
        }}
        className="absolute inset-0 w-full h-full object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "https://placehold.co/400x500?text=Image+Missing";
        }}
      />
    </AnimatePresence>
  </div>

  {/* הצללה עדינה בתחתית */}
  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent pointer-events-none" />
</div>
        )}

        {/* תמונות עם מעבר חלק (AnimatePresence) */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="w-full h-full object-contain p-4"
          />
        </AnimatePresence>

        {/* שכבת הצללה בתחתית התמונה */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
      </div>

      {/* פרטי המוצר */}
      <div className="p-6 text-right" dir="rtl">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <span className="text-primary font-black text-xl italic">
            ₪{product.price}
          </span>
        </div>

        <p className="text-zinc-500 text-sm mb-6 line-clamp-1 italic">
          מהדורת אוגוסט 25' | פלוגה 603
        </p>

        <Button 
          onClick={() => addToCart(product)}
          className="w-full bg-white text-black hover:bg-primary hover:text-black font-black py-6 rounded-2xl transition-all duration-300 flex gap-2 group/btn"
        >
          <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
          הוספה לסל
        </Button>
      </div>

      {/* אפקט תאורה בפינה (Glow) */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
}
