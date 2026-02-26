import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

// הגדרת המבנה של המוצר - כאן 'images' הוא שם המערך בקוד
interface Product {
  id: string;
  name: string;
  price: number;
  images: string[]; // מערך של מחרוזות (נתיבים)
}

interface MerchCardProps {
  product: Product;
  addToCart: (product: Product) => void;
}

export function MerchCard({ product, addToCart }: MerchCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // הגנה: אם המערך לא קיים או ריק, האתר לא יקרוס
  if (!product.images || product.images.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-3xl p-10 text-center border border-zinc-800">
        <p className="text-zinc-500">תמונה חסרה</p>
      </div>
    );
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 flex flex-col h-full shadow-lg">
      {/* אזור התמונה */}
      <div className="relative aspect-square bg-zinc-800/30 overflow-hidden flex items-center justify-center p-2">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500"
          onError={(e) => {
            // אם התמונה לא נמצאת בנתיב, נציג פלייסוולדר במקום מסך לבן
            (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Image+Not+Found";
          }}
        />
        
        {/* כפתורי חצים - רק אם יש יותר מתמונה אחת */}
        {product.images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-full bg-black/70 hover:bg-black/90 border-none text-white shadow-xl"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-full bg-black/70 hover:bg-black/90 border-none text-white shadow-xl"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* פרטים */}
      <div className="p-5 flex flex-col flex-1 justify-between text-right" dir="rtl">
        <div>
          <h3 className="text-lg font-bold text-white mb-1 leading-tight">{product.name}</h3>
          <p className="text-primary font-black text-xl italic">₪{product.price}</p>
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
