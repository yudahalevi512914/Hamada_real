import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
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
  Loader2
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
      // כאן מדביקים את הקישור ל-Google Apps Script שיצרת
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
        description: "לא הצלחנו לשלוח את ההזמנה, נסה שוב מאוחר יותר.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* כפתור עגלה צף (Floating Action Button) */}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            className="fixed bottom-8 left-8 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-16 w-16 rounded-full bg-primary hover:bg-yellow-500 text-black shadow-[0_0_30px_rgba(234,179,8,0.4)] border-4 border-zinc-950 flex items-center justify-center relative group transition-all duration-300"
            >
              <ShoppingCart className="w-7 h-7 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center border-2 border-zinc-950">
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md bg-zinc-950 border-zinc-800 text-right p-0 flex flex-col" dir="rtl">
          <SheetHeader className="p-6 border-b border-zinc-800">
            <SheetTitle className="text-2xl font-black text-white flex items-center gap-2 justify-start">
              <ShoppingCart className="text-primary" />
              סל הקניות שלי
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4"
              >
                <CheckCircle2 className="w-20 h-20 text-green-500" />
                <h3 className="text-2xl font-bold text-white">ההזמנה נשלחה!</h3>
                <p className="text-zinc-400">הפרטים הועברו למנהל הפלוגה.</p>
              </motion.div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
                <p>הסל שלך ריק כרגע</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-white/5 relative group">
                  <div className="h-20 w-20 bg-zinc-800 rounded-xl overflow-hidden shrink-0">
                    <img src={item.images[0]} className="w-full h-full object-contain" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-lg">{item.name}</h4>
                      <button onClick={() => removeItem(item.id)} className="text-zinc-500 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-zinc-800 rounded-lg p-1">
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-primary"><Plus className="w-4 h-4" /></button>
                        <span className="px-3 text-white font-mono">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-zinc-400"><Minus className="w-4 h-4" /></button>
                      </div>
                      <span className="text-primary font-bold">₪{item.price * item.quantity}</span>
                    </div>

                    {item.size !== undefined && (
                      <div className="flex gap-2 pt-1">
                        {["S", "M", "L", "XL"].map((s) => (
                          <button
                            key={s}
                            onClick={() => updateSize(item.id, s)}
                            className={`px-2 py-1 text-xs rounded-md border transition-all ${
                              item.size === s ? "bg-primary text-black border-primary" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {!isSuccess && items.length > 0 && (
            <div className="p-6 bg-zinc-900/80 border-t border-zinc-800 space-y-6">
              <form id="order-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-400">שם מלא</Label>
                    <Input {...register("fullName", { required: true })} className="bg-zinc-800 border-zinc-700 text-white" placeholder="ישראל ישראלי" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400">טלפון</Label>
                    <Input {...register("phone", { required: true })} className="bg-zinc-800 border-zinc-700 text-white font-mono" placeholder="050-0000000" />
                  </div>
                </div>
              </form>
              
              <div className="flex justify-between items-center text-xl font-black text-white">
                <span>סה"כ לתשלום:</span>
                <span className="text-primary italic">₪{total}</span>
              </div>

              <Button 
                disabled={isSubmitting}
                form="order-form"
                className="w-full bg-primary hover:bg-yellow-500 text-black font-black py-7 rounded-2xl text-lg flex gap-3 shadow-[0_10px_20px_rgba(234,179,8,0.2)]"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
                שליחת הזמנה למנהל
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
