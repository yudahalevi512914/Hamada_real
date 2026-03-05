import { useState } from "react";
import { useOrders } from "@/hooks/use-orders"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CartDrawer() {
  // החזרתי את השמות המקוריים של המשתנים כדי למנוע קריסה
  const { cart, cartTotal, clearCart } = useOrders();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      items: cart,
      total: cartTotal,
    };

    try {
      const response = await fetch("https://hook.us2.make.com/694i67f97m52m6k83335m6o89h2p8m9p", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsOpen(false);
        clearCart();
        
        // במקום חלון קופץ מסובך שעלול לקרוס, נשתמש בהודעה פשוטה ובטוחה:
        alert("הזמנתך נשלחה בהצלחה!\n\nלסיום התשלום, היכנס לקבוצת הפייבוקס:\nhttps://links.payboxapp.com/O8fomD9Ue1b");
        
        toast({
          title: "ההזמנה בוצעה",
          description: "נא לעבור לתשלום בפייבוקס",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "השליחה נכשלה",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative border-primary/20">
          <ShoppingCart className="h-5 w-5 text-primary" />
          {cart && cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-black rounded-full w-5 h-5 text-[10px] font-bold flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-zinc-950 text-white border-zinc-800" dir="rtl">
        <SheetHeader>
          <SheetTitle className="text-white text-2xl font-black italic">הסל שלי</SheetTitle>
        </SheetHeader>

        {!cart || cart.length === 0 ? (
          <div className="py-20 text-center text-zinc-500">הסל ריק</div>
        ) : (
          <div className="flex flex-col h-full py-6">
            <div className="flex-1 overflow-y-auto space-y-4">
              {cart.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-lg">
                  <span>{item.name} (x{item.quantity})</span>
                  <span className="text-primary font-bold">₪{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-zinc-800 space-y-4">
              <div className="flex justify-between text-xl font-bold">
                <span>סה"כ:</span>
                <span>₪{cartTotal}</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="name" required placeholder="שם מלא" className="bg-zinc-900 border-zinc-800" />
                <Input name="phone" required type="tel" placeholder="טלפון" className="bg-zinc-900 border-zinc-800" />
                <Input name="address" required placeholder="לאן להביא?" className="bg-zinc-900 border-zinc-800" />
                <Button type="submit" className="w-full py-6 text-lg font-black italic" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "אישור והזמנה"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
