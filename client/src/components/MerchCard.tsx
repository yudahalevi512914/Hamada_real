import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  requiresSize?: boolean;
}

interface MerchCardProps {
  product: Product;
  addToCart: (product: any) => void;
}

export function MerchCard({ product, addToCart }: MerchCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const images = product?.images || [];
  const hasMultiple = images.length > 1;

  // החלפת תמונות אוטומטית - נעצרת כשבוחרים מידה כדי לא להפריע למשתמש
  useEffect(() => {
    if (!hasMultiple || showSizePicker) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [hasMultiple, images.length, showSizePicker]);

  const handleAddClick = () => {
    if (product.requiresSize && !selectedSize) {
      setShowSizePicker(true);
      return;
    }
    // שליחת המוצר עם המידה שנבחרה (אם יש)
    addToCart({ ...product, size: selectedSize || undefined });
    
    // איפוס בחירה לאחר הוספה
    setShowSizePicker(false);
    setSelectedSize(null);
  };

  if (!product) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-[#18181b] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl transition-all duration-300 h-full flex flex-col"
    >
      {/* אזור התמונה והמידות */}
      <div className="relative aspect-[4/5] bg-[#18181b] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-contain p-8 z-10"
          />
        </AnimatePresence>

        {/* שכבת בחירת מידה (מופיעה רק כשצריך) */}
        <AnimatePresence>
          {showSizePicker && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
            >
              <button 
                onClick={() => setShowSizePicker(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              
              <p className="text-white font-black text-xl mb-6 tracking-tighter">בחר מידה</p>
              
              <div className="grid grid-cols-2 gap-3 w-full max-w-[200px]">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-xl font-bold transition-all border-2 ${
                      selectedSize === size 
                        ? "bg-primary border-primary text-black" 
                        : "border-white/10 text-white hover:border-white/40"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <Button 
                onClick={handleAddClick}
                disabled={!selectedSize}
                className="mt-8 w-full bg-primary text-black font-black py-6 rounded-xl disabled:opacity-50"
              >
                אישור והוספה לסל
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* אינדיקטורים */}
        {hasMultiple && !showSizePicker && (
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
      </div>

      {/* פרטי מוצר */}
      <div className="p-7 text-right bg-[#18181b] flex-1 flex flex-col justify-between" dir="rtl">
        <div>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-white leading-tight">{product.name}</h3>
            <span className="text-primary font-black text-2xl italic">₪{product.price}</span>
          </div>
          <p className="text-zinc-500 text-sm mb-6">מהדורת לוחמים | פלוגה 603</p>
        </div>

        <Button 
          onClick={handleAddClick}
          className="w-full bg-white text-black hover:bg-primary hover:text-black font-black py-7 rounded-2xl transition-all duration-300 flex gap-3 shadow-xl active:scale-95"
        >
          {selectedSize ? <Check className="w-5 h-5 text-green-600" /> : <ShoppingCart className="w-5 h-5" />}
          {product.requiresSize && !selectedSize ? "בחר מידה" : "הוספה לסל"}
        </Button>
      </div>
    </motion.div>
  );
}
