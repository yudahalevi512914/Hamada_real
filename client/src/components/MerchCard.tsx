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
      className="group relative bg-[#18181b] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl transition-all duration-300"
      /* #18181b הוא הקוד המדויק של zinc-900 */
    >
      {/* אזור התמונה - אפור אטום לגמרי */}
      <div className="relative aspect-[4/5] bg-[#18181b] flex items-center justify-center overflow-hidden">
        
        {/* אינדיקטורים */}
        {hasMultiple && (
          <div className="absolute top-5 inset-x-6 z-30 flex gap-1.5">
            {images.map((_, i) => (
              <div key={i} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: i === currentIndex ? "100%" : i < currentIndex ? "100%" : "0%" }}
                  transition={{ duration: i === currentIndex ? 4 : 0.4, ease: "linear" }}
                  className="h-full bg-primary"
                />
              </div>
            ))}
          </div>
        )}

        {/* תמונות - מעבר Fade נקי */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full h-full object-contain p-8 z-10"
          />
        </AnimatePresence>
      </div>

      {/* אזור פרטים - אפור אטום לגמרי */}
      <div className="p-7 text-right bg-[#18181b] relative z-20" dir="rtl">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <span className="text-primary font-black text-2xl italic">
            ₪{product.price}
          </span>
        </div>

        <p className="text-zinc-500 text-sm mb-6">
          מהדורת לוחמים | פלוגה 603
        </p>

        <Button 
          onClick={() => addToCart(product)}
          className="w-full bg-white text-black hover:bg-primary hover:text-black font-black py-7 rounded-2xl transition-all duration-300 flex gap-3 shadow-xl active:scale-95"
        >
          <ShoppingCart className="w-5 h-5" />
          הוספה לסל
        </Button>
      </div>
    </motion.div>
  );
}
