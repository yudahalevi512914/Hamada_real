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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Send, 
  CheckCircle2,
  Loader2,
  ArrowRight,
  Truck,
  MapPin,
  ShieldCheck
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
  const [shippingMethod, setShippingMethod] = useState("pickup");
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === "home" ? 35 : 0;
  const total = subtotal + shippingCost;

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // ה-Webhook שלך מ-Make
      const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/dvo53v9qulnc370f971r8muwz8r8viye";

      const orderData = {
        date: new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" }),
        customerName: data.fullName,
        phone: data.phone,
        shippingMethod: shippingMethod === "home" ? "משלוח עד הבית" : "איסוף פלוגתי",
        address: shippingMethod === "home" 
          ? `${data.city}, ${data.street} ${data.houseNum}` 
          : "איסוף מהפלוגה",
        // ריכוז המוצרים לשורה אחת שתהיה נוחה ב-Google Sheets
        itemsSummary: items.map(item => `${item.name} [${item.size || 'No Size'}] x${item.quantity}`).join(" | "),
        totalPrice: `₪${total}`,
        status: "ממתין לתשלום ביט"
      };

      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Failed to send to Make");

      setIsSuccess(true);
      toast({
        title: "הזמנה נשלחה!",
        description: "הפרטים נקלטו בטבלה. נא להעביר ביט לאישור סופי.",
      });

      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
        clearCart();
        reset();
      }, 3000);
    } catch (error) {
      toast({
        title: "שגיאה בשליחה",
        description: "נסה שוב או פנה למנהל.",
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
            <SheetTitle className="text-2xl font-black text-white">סל הקניות שלי</SheetTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-zinc-500">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle2 className="w-20 h-20 text-green-500" />
                <h3 className="text-2xl font-bold text-white">ההזמנה נקלטה!</h3>
                <p className="text-zinc-400">נא להעביר תשלום בביט למספר הפלוגה.</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20 text-zinc-500">הסל שלך ריק</div>
            ) : (
              <>
                {/* רשימת מוצרים */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id + (item.size || "")} className="flex gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                      <div className="h-16 w-16 bg-zinc-800 rounded-xl overflow-hidden shrink-0">
                        <img src={item.images[0]} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-white text-sm">{item.name}</h4>
                          <button onClick={() => removeItem(item.id)} className="text-zinc-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <p className="text-primary text-[11px] font-bold">מידה: {item.size || 'N/A'}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center bg-zinc-800 rounded-lg p-1">
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1"><Plus className="w-3 h-3 text-white" /></button>
                            <span className="px-2 text-white text-xs">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1"><Minus className="w-3 h-3 text-white" /></button>
                          </div>
                          <span className="text-white font-bold text-sm">₪{item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* בחירת משלוח */}
                <div className="space-y-4 border-t border-zinc-800 pt-6">
                  <Label className="text-white font-bold">שיטת אספקה</Label>
                  <RadioGroup defaultValue="pickup" onValueChange={setShippingMethod} className="grid grid-cols-2 gap-4">
                    <Label className={`flex flex-col items-center justify-center rounded-xl border-2 p-4 cursor-pointer transition-all ${shippingMethod === 'pickup' ? 'border-primary bg-primary/5' : 'border-zinc-800 bg-zinc-900/30'}`}>
                      <RadioGroupItem value="pickup" className="sr-only" />
                      <MapPin className={`w-6 h-6 mb-2 ${shippingMethod === 'pickup' ? 'text-primary' : 'text-zinc-500'}`} />
                      <span className="text-xs font-bold text-white">איסוף פלוגתי</span>
                    </Label>
                    <Label className={`flex flex-col items-center justify-center rounded-xl border-2 p-4 cursor-pointer transition-all ${shippingMethod === 'home' ? 'border-primary bg-primary/5' : 'border-zinc-800 bg-zinc-900/30'}`}>
                      <RadioGroupItem value="home" className="sr-only" />
                      <Truck className={`w-6 h-6 mb-2 ${shippingMethod === 'home' ? 'text-primary' : 'text-zinc-500'}`} />
                      <span className="text-xs font-bold text-white">משלוח עד הבית</span>
                    </Label>
                  </RadioGroup>
                </div>

                {/* טופס פרטים */}
                <form id="order-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-3">
                    <Input {...register("fullName", { required: true })} placeholder="שם מלא" className="bg-zinc-900 border-zinc-800 text-white" />
                    <Input {...register("phone", { required: true })} placeholder="מספר טלפון" className="bg-zinc-900 border-zinc-800 text-white font-mono" />
                    
                    {shippingMethod === "home" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3 pt-2">
                        <Input {...register("city", { required: true })} placeholder="עיר" className="bg-zinc-900 border-zinc-800 text-white" />
                        <div className="flex gap-2">
                          <Input {...register("street", { required: true })} placeholder="רחוב" className="bg-zinc-900 border-zinc-800 text-white flex-[2]" />
                          <Input {...register("houseNum", { required: true })} placeholder="בית" className="bg-zinc-900 border-zinc-800 text-white flex-1" />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="bg-zinc-900/80 p-4 rounded-xl border border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="terms" required className="border-zinc-700" />
                      <label htmlFor="terms" className="text-[10px] text-zinc-400">אני מאשר כי הפרטים נכונים וקראתי את תנאי ההזמנה</label>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>

          {!isSuccess && items.length > 0 && (
            <div className="p-6 bg-zinc-900 border-t border-zinc-800">
              <div className="flex justify-between items-center mb-4 text-white">
                <span className="opacity-60 text-sm">סה"כ לתשלום:</span>
                <span className="text-2xl font-black text-primary">₪{total}</span>
              </div>
              <Button 
                form="order-form"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-yellow-500 text-black font-black py-7 rounded-2xl shadow-xl"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4 ml-2" />}
                אישור והמשך לתשלום
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
