import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

interface MerchCardProps {
  product: Product;
  addToCart: (product: Product) => void;
}

export function MerchCard({ product, addToCart }: MerchCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // פונקציות עזר להחלפת תמונה
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  // הגנה למקרה שאין תמונות בכלל
  const displayImage = product.images && product.images.length > 0 
    ? product.images[currentImageIndex] 
    : "/placeholder.jpg";

  return (
    <div className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 flex flex-col h-full shadow-lg">
      {/* אזור התמונה - object-contain פותר את הבעיה שהתמונה חתוכה */}
      <div className="relative aspect-square bg-zinc-800/50 overflow-hidden flex items-center justify-center">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* חצים - יופיעו רק אם יש יותר מתמונה אחת */}
        {product.images && product.images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/90 border-none text-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/90 border-none text-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* פרטי המוצר */}
      <div className="p-5 flex flex-col flex-1 justify-between text-right" dir="rtl">
        <div>
          <h3 className="text-lg font-bold text-white mb-1 leading-tight">{product.name}</h3>
          <p className="text-primary font-mono font-black text-xl italic">₪{product.price}</p>
        </div>
        <Button 
          onClick={() => addToCart(product)}
          className="w-full mt-4 bg-primary hover:bg-yellow-500 text-black font-extrabold rounded-xl py-6 transition-all active:scale-95"
        >
          הוספה לסל
        </Button>
      </div>
    </div>
  );
}
