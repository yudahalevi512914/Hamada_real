import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  requiresSize?: boolean;
}

interface MerchCardProps {
  product: Product;
  addToCart: (product: Product) => void;
}

export function MerchCard({ product, addToCart }: MerchCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = product?.images || [];
  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [hasMultiple, images.length]);

  if (!product) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative bg-zinc-900/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-primary/40 transition-all duration-500 shadow-2xl"
    >
      {/* אזור התמונה - חזרה לרקע האפור המקורי (zinc-900) */}
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900 flex items-center justify-center">
        
        {/* אינדיקטורים דקים */}
        {hasMultiple && (
          <div className="absolute top-5 inset-x-6 z-30 flex gap-1.5">
            {images.map((_, i) => (
              <div key={i} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: i === currentIndex ? "100%" : i < currentIndex ? "100%" : "0%" }}
                  transition={{ 
                    duration: i === currentIndex ? 4 : 0.4, 
                    ease: i === currentIndex ? "linear" : "easeInOut" 
                  }}
                  className="h-full bg-primary shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                />
              </div>
            ))}
          </div>
        )}

        {/* תמונות עם אפקט Cross-fade חלק (ללא קפיצות) */}
        <div className="relative w-full h-full p-6">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={product.name}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.4, 0, 0.2, 1] 
              }}
              className="absolute inset-0 w-full h-full object-contain p-8"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/400x500?text=Image+Not+Found";
              }}
            />
          </AnimatePresence>
        </div>

        {/* שכבת הצללה עדינה */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="p-7 text-right" dir="rtl">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex flex-col items-end">
            <span className="text-primary font-black text-2xl tracking-tighter italic">
              ₪{product.price}
            </span>
          </div>
        </div>

        <p className="text-zinc-500 text-sm mb-6 font-medium tracking-wide">
          מהדורת לוחמים | <span className="text-zinc-400">פלוגה 603</span>
        </p>

        <Button 
          onClick={() => addToCart(product)}
          className="w-full bg-white text-black hover:bg-primary hover:text-black font-black py-7 rounded-2xl transition-all duration-300 flex gap-3 group/btn shadow-xl active:scale-95"
        >
          <ShoppingCart className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
          הוספה לסל
        </Button>
      </div>

      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </motion.div>
  );
}
