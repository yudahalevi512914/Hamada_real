import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

// בתוך הפונקציה MerchCard:
export function MerchCard({ product, addToCart }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // מונע מהקליק לפתוח את המוצר בטעות
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 flex flex-col h-full">
      {/* אזור התמונה */}
      <div className="relative aspect-square bg-zinc-800 overflow-hidden">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* חצים להחלפת תמונה - מופיעים רק אם יש יותר מתמונה אחת */}
        {product.images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full h-8 w-8"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full h-8 w-8"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            {/* נקודות אינדיקציה בתחתית התמונה */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {product.images.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 w-1.5 rounded-full ${i === currentImageIndex ? 'bg-primary' : 'bg-white/30'}`} 
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* פרטי המוצר */}
      <div className="p-5 flex flex-col flex-1 justify-between text-right" dir="rtl">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
          <p className="text-primary font-mono font-bold text-lg">₪{product.price}</p>
        </div>
        <Button 
          onClick={() => addToCart(product)}
          className="w-full mt-4 bg-primary hover:bg-yellow-500 text-black font-bold rounded-xl"
        >
          הוספה לסל
        </Button>
      </div>
    </div>
  );
}
