import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag, Trash2, Plus, Minus, CheckCircle2, ExternalLink } from "lucide-react";
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
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', note: '' });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // כאן תכניס את הקישור לקבוצת הפייבוקס שלכם
  const PAYBOX_LINK = "https://payboxapp.page.link/YOUR_LINK"; 

  const handleCheckout = () => {
    if (step === 'cart') setStep('details');
    else if (step === 'details') setStep('summary');
  };

  return (
    <Sheet onOpenChange={() => setStep('cart')}>
      <SheetContent className="w-full sm:max-w-md bg-zinc-950 border-zinc-800 text-white flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-zinc-900">
          <SheetTitle className="text-white flex items-center gap-2">
            <ShoppingBag className="text-primary" />
            {step === 'cart' ? 'סל הקניות שלי' : step === 'details' ? 'פרטי משלוח' : 'סיום הזמנה'}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 'cart' ? (
              <motion.div key="cart" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full flex flex-col">
                <ScrollArea className="flex-1 p-6">
                  {items.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500">הסל שלך ריק</div>
                  ) : (
                    <div className="space-y-6">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
                          <div className="flex-1">
                            <h4 className="font-bold">{item.name}</h4>
                            <p className="text-primary font-mono text-sm">₪{item.price}</p>
                            <div className="flex items-center gap-3 mt-4">
                              <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg" onClick={() => updateQuantity(item.id, -1)}><Minus className="w-4 h-4" /></Button>
                              <span className="font-bold">{item.quantity}</span>
                              <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg" onClick={() => updateQuantity(item.id, 1)}><Plus className="w-4 h-4" /></Button>
                            </div>
                          </div>
                          <Button size="icon" variant="ghost" className="text-zinc-500 hover:text-red-500" onClick={() => removeItem(item.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </motion.div>
            ) : step === 'details' ? (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 space-y-6 text-right" dir="rtl">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>שם מלא</Label>
                    <Input className="bg-zinc-900 border-zinc-800" placeholder="ישראל ישראלי" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>מספר טלפון (לוואטסאפ)</Label>
                    <Input className="bg-zinc-900 border-zinc-800" placeholder="050-0000000" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>הערות (מחלקה/מיקום)</Label>
                    <Input className="bg-zinc-900 border-zinc-800" value={customerInfo.note} onChange={(e) => setCustomerInfo({...customerInfo, note: e.target.value})} />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="summary" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 text-center space-y-6">
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
                <h2 className="text-2xl font-black italic">ההזמנה מוכנה!</h2>
                <div className="bg-zinc-900 p-4 rounded-2xl text-right">
                  <p className="text-sm text-zinc-400">סיכום תשלום:</p>
                  <p className="text-3xl font-black text-primary">₪{total}</p>
                </div>
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-sm">
                  <p className="font-bold text-primary mb-2">שלב אחרון:</p>
                  לחצו על הכפתור למטה להעברת התשלום בפייבוקס. לאחר התשלום ההזמנה תצא לדרך.
                </div>
                <Button className="w-full h-16 text-lg font-bold gap-2" asChild>
                  <a href={PAYBOX_LINK} target="_blank">
                    תשלום בפייבוקס
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <SheetFooter className="p-6 border-t border-zinc-900 bg-black/20">
          {step !== 'summary' && (
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>סה"כ:</span>
                <span className="text-primary font-mono">₪{total}</span>
              </div>
              <Button 
                disabled={items.length === 0 || (step === 'details' && (!customerInfo.name || !customerInfo.phone))}
                onClick={handleCheckout} 
                className="w-full h-14 text-lg font-bold rounded-xl"
              >
                {step === 'cart' ? 'המשך לפרטי משלוח' : 'אישור הזמנה ותשלום'}
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
