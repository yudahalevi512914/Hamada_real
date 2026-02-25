import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag, Trash2, Plus, Minus, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
};

interface CartDrawerProps {
  items: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  updateSize: (id: string, size: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export function CartDrawer({ items, updateQuantity, updateSize, removeItem, clearCart }: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'details' | 'summary'>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', note: '' });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // הקישורים שלך
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxikxVE3D_5q7x2lOOFqzNMEOfvMcRiI_-n2F-2Luc9f8Ja9941RAM0IrYVSiHmDAqY/exec";
  const PAYBOX_LINK = "https://payboxapp.page.link/YOUR_LINK"; // תחליף בקישור הפייבוקס שלכם

  const handleCheckout = async () => {
    if (step === 'cart') {
      setStep('details');
    } else if (step === 'details') {
      setIsSubmitting(true);
      
      const orderData = {
        name: customerInfo.name,
        phone: customerInfo.phone,
        note: customerInfo.note,
        items: items.map(i => `${i.name}${i.size ? ` (${i.size})` : ''} x${i.quantity}`).join(", "),
        total: total
      };

      try {
        // שליחה ל-Google Sheets
        await fetch(GOOGLE_SHEET_URL, {
          method: "POST",
          mode: "no-cors", // חשוב למניעת שגיאות CORS
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData)
        });
        
        setStep('summary');
        clearCart(); 
      } catch (error) {
        console.error("שגיאה בשמירת ההזמנה:", error);
        // מעבירים לסיום בכל מקרה כדי שהמשתמש יוכל לשלם
        setStep('summary');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Sheet onOpenChange={(open) => { if(!open) setStep('cart'); }}>
      <SheetContent className="w-full sm:max-w-md bg-zinc-950 border-zinc-800 text-white flex flex-col p-0" dir="rtl">
        <SheetHeader className="p-6 border-b border-zinc-900">
          <SheetTitle className="text-white flex items-center gap-2 font-bold text-xl">
            <ShoppingBag className="text-primary w-6 h-6" />
            {step === 'cart' ? 'סל הקניות שלי' : step === 'details' ? 'איפה למסור?' : 'ההזמנה בדרך!'}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 'cart' ? (
              <motion.div key="cart" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full flex flex-col">
                <ScrollArea className="flex-1 p-6">
                  {items.length === 0 ? (
                    <div className="text-center py-24 text-zinc-500 font-medium">הסל שלך מחכה שתמלא אותו...</div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50 items-center transition-all hover:bg-zinc-900/60">
                          <div className="flex-1 text-right">
                            <h4 className="font-bold text-lg">{item.name}</h4>
                            {item.size && <p className="text-zinc-500 text-sm">מידה: {item.size}</p>}
                            <p className="text-primary font-bold mt-1">₪{item.price * item.quantity}</p>
                            <div className="flex items-center gap-4 mt-4">
                              <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg border-zinc-700 bg-zinc-800" onClick={() => updateQuantity(item.id, -1)}><Minus className="w-3 h-3" /></Button>
                              <span className="font-bold text-lg">{item.quantity}</span>
                              <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg border-zinc-700 bg-zinc-800" onClick={() => updateQuantity(item.id, 1)}><Plus className="w-3 h-3" /></Button>
                            </div>
                          </div>
                          <Button size="icon" variant="ghost" className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10" onClick={() => removeItem(item.id)}><Trash2 className="w-5 h-5" /></Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </motion.div>
            ) : step === 'details' ? (
              <motion.div key="details" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-6 space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2 text-right">
                    <Label className="text-zinc-400 text-sm mr-1">שם מלא</Label>
                    <Input className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl focus:ring-primary text-right text-lg" placeholder="מי מזמין?" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
                  </div>
                  <div className="space-y-2 text-right">
                    <Label className="text-zinc-400 text-sm mr-1">מספר טלפון</Label>
                    <Input className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl focus:ring-primary text-right text-lg" placeholder="בשביל לתאם מסירה" type="tel" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                  </div>
                  <div className="space-y-2 text-right">
                    <Label className="text-zinc-400 text-sm mr-1">מחלקה / הערות</Label>
                    <Input className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl focus:ring-primary text-right text-lg" placeholder="איפה אתם בבסיס?" value={customerInfo.note} onChange={(e) => setCustomerInfo({...customerInfo, note: e.target.value})} />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="summary" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-6 text-center space-y-8 py-12">
                <div className="relative inline-block">
                  <CheckCircle2 className="w-24 h-24 text-primary mx-auto" />
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 1, repeat: Infinity }} className="absolute inset-0 bg-primary/20 rounded-full" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl font-black italic tracking-tighter">קיבלנו!</h2>
                  <p className="text-zinc-400 text-lg">פרטי ההזמנה הועברו לרישום הפלוגתי</p>
                </div>
                
                <div className="bg-zinc-900/80 p-6 rounded-[2rem] border border-zinc-800 shadow-xl">
                  <p className="text-zinc-500 text-sm font-bold mb-1">סה"כ לתשלום:</p>
                  <p className="text-5xl font-black text-primary italic">₪{total}</p>
                </div>

                <div className="space-y-4 pt-4">
                  <p className="text-zinc-300 font-medium">כדי שנשלח את ההזמנה, יש להעביר תשלום בקבוצת הפייבוקס:</p>
                  <Button className="w-full h-18 text-xl font-black gap-3 rounded-[1.5rem] shadow-[0_10px_30px_rgba(234,179,8,0.2)] hover:scale-105 transition-transform" asChild>
                    <a href={PAYBOX_LINK} target="_blank" rel="noopener noreferrer">
                      מעבר לתשלום בפייבוקס
                      <ExternalLink className="w-6 h-6" />
                    </a>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <SheetFooter className="p-6 border-t border-zinc-900 bg-black/40 backdrop-blur-lg">
          {step !== 'summary' && (
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-zinc-400 text-lg font-bold">סיכום ביניים:</span>
                <span className="text-3xl font-black text-primary italic">₪{total}</span>
              </div>
              <Button 
                disabled={items.length === 0 || isSubmitting || (step === 'details' && (!customerInfo.name || !customerInfo.phone))}
                onClick={handleCheckout} 
                className="w-full h-16 text-xl font-black rounded-2xl transition-all active:scale-95 shadow-lg"
              >
                {isSubmitting ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  step === 'cart' ? 'המשך לפרטי משלוח' : 'שלח הזמנה'
                )}
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
