import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

export function MerchCard({ product, addToCart }: any) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 1. הגנה מפני מוצר חסר
  if (!product) return null;

  // 2. טיפול גמיש במערך התמונות - בודק את כל האפשרויות
  const rawImages = product.images || product.image || [];
  const images = Array.isArray(rawImages) ? rawImages : [rawImages];
  
  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[currentImageIndex] : null;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 flex flex-col h-full">
      <div className="relative aspect-square bg-zinc-800/30 flex items-center justify-center">
        {currentImage ? (
          <img
            src={currentImage}
            alt={product.name || "מוצר"}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/400?text=Image+Error";
            }}
          />
        ) : (
          <div className="text-zinc-500 text-xs">אין תמונה זמינה</div>
        )}

        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2">
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-black/40 text-white" onClick={prevImage}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-black/40 text-white" onClick={nextImage}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between text-right" dir="rtl">
        <div>
          <h3 className="text-white font-bold">{product.name || "מוצר ללא שם"}</h3>
          <p className="text-primary font-bold italic">₪{product.price || 0}</p>
        </div>
        <Button 
          onClick={() => addToCart?.(product)}
          className="w-full mt-3 bg-primary text-black font-bold rounded-xl"
        >
          הוספה לסל
        </Button>
      </div>
    </div>
  );
}
