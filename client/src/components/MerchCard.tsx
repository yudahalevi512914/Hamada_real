import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MerchCardProps {
  id: string;
  name: string;
  price: number;
  imagePlaceholder: string;
  onAdd: () => void;
}

export function MerchCard({ name, price, imagePlaceholder, onAdd }: MerchCardProps) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover-elevate flex flex-col h-full group">
      <div className="aspect-square bg-muted relative overflow-hidden flex items-center justify-center">
        {/* Placeholder for merch images - abstract pattern for now */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-background to-background group-hover:opacity-40 transition-opacity duration-500" />
        <span className="font-display font-bold text-4xl text-muted-foreground/30 rotate-[-15deg] uppercase">
          {imagePlaceholder}
        </span>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg mb-1">{name}</h3>
        <p className="text-primary font-medium mb-4">{price} ₪</p>
        
        <div className="mt-auto pt-4 border-t border-border/50">
          <Button 
            onClick={onAdd}
            className="w-full gap-2 rounded-xl group/btn"
            variant="secondary"
          >
            <Plus className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
            הוסף להזמנה
          </Button>
        </div>
      </div>
    </div>
  );
}
