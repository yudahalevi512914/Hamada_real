import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Expand } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface MerchCardProps {
  name: string;
  price: number;
  images: string[];
  onAdd: () => void;
}

export function MerchCard({ name, price, images, onAdd }: MerchCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="overflow-hidden border-zinc-800 bg-zinc-900/50 group h-full flex flex-col">
        {/* תצוגת תמונה עם אפקט החלפה */}
        <div className="relative aspect-square overflow-hidden bg-zinc-800">
          <AnimatePresence mode="wait">
            <motion.img
              key={isHovered && images[1] ? images[1] : images[0]}
              src={isHovered && images[1] ? images[1] : images[0]}
              alt={name}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.5 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </AnimatePresence>
          
          {/* Badge מחיר מעוצב */}
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-primary font-bold px-3 py-1 rounded-lg border border-primary/20">
            ₪{price}
          </div>
        </div>

        <CardContent className="p-6 flex-grow text-right">
          <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
          <p className="text-zinc-500 text-sm">איכות פרימיום ללוחמי 603</p>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button 
            onClick={onAdd}
            className="w-full gap-2 bg-primary hover:bg-primary/90 text-black font-bold h-12 rounded-xl"
          >
            <ShoppingCart className="w-5 h-5" />
            הוספה לסל
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
