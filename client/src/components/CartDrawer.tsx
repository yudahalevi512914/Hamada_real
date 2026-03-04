import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShoppingCart, Loader2, CreditCard, Smartphone, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CartDrawer() {
  const { items, total, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // הגדרות תשלום
  const PAYBOX_LINK = "https://links.payboxapp.com/O8fomD9Ue1b";
  const BIT_PHONE = "0501234567"; // תחליף למספר שלך במידה וצריך

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      items: items.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
      total,
      orderDate: new Date().toLocaleString('he-IL'),
    };

    try {
      // שליחה ל-Webhook של Make (לפי צילום המסך שלך)
      const response = await fetch("https://hook.us2.make.com/694i67f97m52m6k83335m6o89h2p8m9p", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsOpen(false); // סוגר את סל הקניות
        setShowPaymentModal(true); // פותח את החלון הקופץ לתשלום
        clearCart(); // מנקה את הסל
      } else {
        throw new Error();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה בשליחה",
        description: "נסה שוב או פנה לסמל המחלקה",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative border-primary/20 hover:bg-primary/10 transition-colors">
            <ShoppingCart className="h-5 w-5 text-primary" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-black rounded-full w-5 h-5 text-[10px] font-black flex items-center justify-center shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                {items.length}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg bg-zinc-950 text-white border-zinc-800" dir="rtl">
          <SheetHeader className="border-b border-zinc-900 pb-4">
            <SheetTitle className="text-white text-3xl font-black italic tracking-tighter">הסל שלי</SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-600">
              <ShoppingCart className="h-16 w-16 mb-4 opacity-10" />
              <p className="text-lg font-bold italic">הסל שלך ריק כרגע</p>
            </div>
          ) : (
            <div className="flex flex-col h-full py-6">
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/50">
                    <div>
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-xs text-zinc-500 font-medium tracking-wide">כמות: {item.quantity}</p>
                    </div>
                    <p className="font-black text-primary italic">₪{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-zinc-800 bg-zinc-950 space-y-6">
                <div className="flex justify-between text-2xl font-black italic">
                  <span>סה"כ לתשלום:</span>
                  <span className="text-primary tracking-tighter">₪{total}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-black text-zinc-500 uppercase tracking-widest mr-1">שם מלא</Label>
                    <Input name="name" required className="bg-zinc-900 border-zinc-800 h-12 focus:ring-1 focus:ring-primary" placeholder="ישראל ישראלי" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-black text-zinc-500 uppercase tracking-widest mr-1">טלפון</Label>
                    <Input name="phone" required type="tel" className="bg-zinc-900 border-zinc-800 h-12" placeholder="05XXXXXXXX" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-black text-zinc-500 uppercase tracking-widest mr-1">לאן להביא?</Label>
                    <Input name="address" required className="bg-zinc-900 border-zinc-800 h-12" placeholder="מחלקה 2 / חדר 4" />
                  </div>
                  <Button type="submit" className="w-full py-8 text-xl font-black italic uppercase tracking-widest shadow-lg active:scale-95 transition-transform" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "אישור והזמנה"}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* חלון קופץ לתשלום - מופיע אחרי שליחה מוצלחת */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-[90vw] sm:max-w-md rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic text-center tracking-tighter">הזמנה התקבלה!</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col gap-5 py-6">
            <p className="text-center text-zinc-400 font-medium leading-relaxed">
              הפרטים נשמרו במערכת.<br />כדי שנאשר סופית, שלם עכשיו:
            </p>
            
            {/* כפתור פייבוקס מרכזי */}
            <Button 
              asChild
              className="py-12 text-2xl font-black bg-[#00529c] hover:bg-[#00427c] text-white rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] border-b-4 border-[#003d75] transition-all hover:scale-[1.02] active:scale-95"
            >
              <a href={PAYBOX_LINK} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-7 h-7" />
                  תשלום ב-PayBox
                </div>
                <span className="text-[10px] font-normal opacity-70 tracking-widest uppercase">קבוצת "הזמנות 603"</span>
              </a>
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px bg-zinc-800 flex-1" />
              <span className="text-zinc-600 text-xs font-black italic">OR</span>
              <div className="h-px bg-zinc-800 flex-1" />
            </div>

            {/* כפתור ביט משני */}
            <Button 
              asChild
              variant="outline"
              className="py-7 text-lg font-bold border-zinc-800 text-zinc-400 hover:bg-zinc-800 rounded-xl hover:text-white transition-colors"
            >
              <a href={`https://bitpay.co.il/app/pay-request?phone=${BIT_PHONE}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                <Smartphone className="w-5 h-5" />
                תשלום ב-Bit
                <ExternalLink className="w-4 h-4 opacity-20" />
              </a>
            </Button>
          </div>

          <div className="text-center border-t border-zinc-800/50 pt-4">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
              ההזמנה תועבר לביצוע לאחר אישור הסמל
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
