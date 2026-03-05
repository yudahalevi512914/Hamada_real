import { useState } from "react";
// תיקון ה-Import לפי מה שמופיע אצלך בתיקיית ה-hooks
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShoppingCart, Loader2, CreditCard, Smartphone, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CartDrawer() {
  // התאמה לשימוש ב-useOrders במקום useCart
  const { cart: items, cartTotal: total, clearCart } = useOrders();
  const [isOpen, setIsOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const PAYBOX_LINK = "https://links.payboxapp.com/O8fomD9Ue1b";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      items,
      total,
      orderDate: new Date().toLocaleString('he-IL'),
    };

    try {
      const response = await fetch("https://hook.us2.make.com/694i67f97m52m6k83335m6o89h2p8m9p", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsOpen(false);
        setShowPaymentModal(true); // זה מה שיקפיץ את חלון הפייבוקס
        clearCart();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "השליחה נכשלה, נסה שוב",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative border-primary/20">
            <ShoppingCart className="h-5 w-5 text-primary" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-black rounded-full w-5 h-5 text-[10px] font-black flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg bg-zinc-950 text-white border-zinc-800" dir="rtl">
          <SheetHeader>
            <SheetTitle className="text-white text-2xl font-black italic tracking-tighter">הסל שלי</SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-600 italic font-bold">
              הסל ריק
            </div>
          ) : (
            <div className="flex flex-col h-full py-6">
              <div className="flex-1 overflow-y-auto space-y-4">
                {items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/50">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-xs text-zinc-500 italic">כמות: {item.quantity}</p>
                    </div>
                    <p className="font-black text-primary">₪{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-zinc-800 space-y-6">
                <div className="flex justify-between text-2xl font-black italic">
                  <span>סה"כ:</span>
                  <span className="text-primary tracking-tighter">₪{total}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input name="name" required placeholder="שם מלא" className="bg-zinc-900 border-zinc-800 h-12" />
                  <Input name="phone" required type="tel" placeholder="טלפון" className="bg-zinc-900 border-zinc-800 h-12" />
                  <Input name="address" required placeholder="מחלקה / חדר" className="bg-zinc-900 border-zinc-800 h-12" />
                  <Button type="submit" className="w-full py-8 text-xl font-black italic uppercase tracking-widest" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "אישור והזמנה"}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* חלון קופץ לתשלום בפייבוקס */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-[90vw] rounded-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic text-center tracking-tighter">הזמנה התקבלה!</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-6">
            <p className="text-center text-zinc-400 font-bold leading-tight">
              הפרטים נשמרו.<br />שלם עכשיו לסיום ההזמנה:
            </p>
            
            <Button 
              asChild
              className="py-12 text-2xl font-black bg-[#00529c] hover:bg-[#00427c] text-white rounded-2xl shadow-xl border-b-4 border-[#003d75]"
            >
              <a href={PAYBOX_LINK} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-7 h-7" />
                  שלם ב-PayBox
                </div>
                <span className="text-[10px] font-normal opacity-70 tracking-widest uppercase">קבוצת "הזמנות 603"</span>
              </a>
            </Button>

            <div className="flex items-center gap-3 py-2">
              <div className="h-px bg-zinc-800 flex-1" />
              <span className="text-zinc-600 text-xs font-black italic">OR</span>
              <div className="h-px bg-zinc-800 flex-1" />
            </div>

            <Button 
              asChild
              variant="outline"
              className="py-7 text-lg font-bold border-zinc-800 text-zinc-400 hover:bg-zinc-800 rounded-xl"
            >
              <a href={`https://bitpay.co.il/app/pay-request?phone=0501234567`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                <Smartphone className="w-5 h-5" />
                שלם ב-Bit
                <ExternalLink className="w-4 h-4 opacity-20" />
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
