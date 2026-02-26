import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Send, 
  CheckCircle2,
  Loader2,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  images: string[];
}

interface CartDrawerProps {
  items: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  updateSize: (id: string, size: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export function CartDrawer({ items, updateQuantity, updateSize, removeItem, clearCart }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const GOOGLE_SCRIPT_URL = "YOUR_SCRIPT_URL_HERE";
      const orderData = {
        ...data,
        items: items.map(item => `${item.name} (כמות: ${item.quantity}${item.size ? `, מידה: ${item.size}` : ""})`).join(", "),
        totalPrice: total,
        date: new Date().toLocaleString("he-IL"),
      };

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
        clearCart();
        reset();
      }, 3000);
    } catch (error) {
      toast({
        title: "שגיאה בשליחה",
        description: "לא הצלחנו לשלוח את ההזמנה.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-8 left-8 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-16 w-16 rounded-full bg-primary hover:bg-yellow-500 text-black shadow-2xl border-4 border-zinc-950 relative"
            >
              <ShoppingCart className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center">
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md bg-zinc-950 border-zinc-800 text-right p-0 flex flex-col" dir="rtl">
          <SheetHeader className="p-6 border-b border-zinc-800 flex flex-row items-center justify-between">
            <SheetTitle className="text-2xl font-black text-white flex items-center gap-2">
              <ShoppingCart className="text-primary" />
              הסל שלי
            </SheetTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-zinc-500">
              <ArrowRight className="ml-2 w-4 h-4" />
              חזרה לחנות
            </Button>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle2 className="w-20 h-20 text-green-500" />
                <h3 className="text-2xl font-bold text-white">ההזמנה נשלחה!</h3>
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                <p>הסל שלך ריק</p>
                <Button variant="link" onClick={() => setIsOpen(false)} className="text-primary mt-2">המשך בקניות</Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-zinc-900 p-4 rounded-2xl border border-white/5">
                  <div className="h-20 w-20 bg-zinc-800 rounded-xl overflow-hidden shrink-0">
                    <img src={item.images[0]} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <button onClick={() => removeItem(item.id)} className="text-zinc-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    {item.size && <p className="text-primary text-xs font-bold">מידה: {item.size}</p>}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center bg-zinc-800 rounded-lg p-1 text-white">
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1"><Plus className="w-3 h-3" /></button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1"><Minus className="w-3 h-3" /></button>
                      </div>
                      <span className="text-white font-bold">₪{item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {!isSuccess && items.length > 0 && (
            <div className="p-6 bg-zinc-900 border-t border-zinc-800 space-y-4">
              <form id="order-form" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <Input {...register("fullName", { required: true })} className="bg-zinc-800 border-zinc-700 text-white" placeholder="שם מלא" />
                <Input {...register("phone", { required: true })} className="bg-zinc-800 border-zinc-700 text-white" placeholder="טלפון" />
                
                <div className="flex justify-between items-center py-2 text-white font-bold">
                  <span>סה"כ:</span>
                  <span className="text-primary text-xl">₪{total}</span>
                </div>

                <Button 
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-yellow-500 text-black font-black py-6 rounded-xl"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "שלח הזמנה למנהל"}
                </Button>
                
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-zinc-500 text-sm"
                >
                  המשך בקניות
                </Button>
              </form>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
