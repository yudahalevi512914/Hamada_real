import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, CreditCard, ChevronRight, Smartphone } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Link } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(2, "חובה להזין שם מלא"),
  phone: z.string().min(10, "מספר טלפון לא תקין").max(10),
  address: z.string().min(2, "חובה להזין לאן להביא"),
});

export default function CheckoutPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { toast } = useToast();

  const BIT_PHONE_NUMBER = "0501234567"; // תחליף למספר שלך
  const PAYBOX_LINK = "https://links.payboxapp.com/O8fomD9Ue1b";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "", address: "" },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // שליחה ל-Webhook של Make
      await fetch("YOUR_MAKE_WEBHOOK_URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          orderDate: new Date().toLocaleString('he-IL'),
        }),
      });

      // במקום להחליף דף, אנחנו פותחים את החלון הקופץ
      setShowPaymentModal(true);
      
      toast({
        title: "הפרטים נשמרו",
        description: "בחר אמצעי תשלום לסיום ההזמנה",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "נסה שוב או פנה לסמל",
      });
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-2xl mx-auto">
          <Link href="/">
            <div className="flex items-center gap-2 text-primary/60 hover:text-primary cursor-pointer mb-8 group w-fit">
              <ChevronRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-widest">חזרה</span>
            </div>
          </Link>

          <div className="mb-12 border-r-4 border-primary pr-6">
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">סגירת הזמנה</h1>
            <p className="text-zinc-500 font-bold italic uppercase text-sm mt-2">603 | פלוגת הנדסה</p>
          </div>

          <Card className="bg-zinc-900/40 border-zinc-800 backdrop-blur-md">
            <CardContent className="p-8">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest mr-1">שם מלא</label>
                  <Input {...form.register("name")} className="bg-zinc-800/50 border-zinc-700 h-14 text-lg" placeholder="ישראל ישראלי" />
                  {form.formState.errors.name && <p className="text-primary text-xs font-bold">{form.formState.errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest mr-1">טלפון</label>
                  <Input {...form.register("phone")} className="bg-zinc-800/50 border-zinc-700 h-14 text-lg" placeholder="05XXXXXXXX" />
                  {form.formState.errors.phone && <p className="text-primary text-xs font-bold">{form.formState.errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest mr-1">כתובת למשלוח</label>
                  <Input {...form.register("address")} className="bg-zinc-800/50 border-zinc-700 h-14 text-lg" placeholder="מחלקה 2, חדר 4" />
                  {form.formState.errors.address && <p className="text-primary text-xs font-bold">{form.formState.errors.address.message}</p>}
                </div>

                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full py-8 text-xl font-black italic uppercase tracking-widest shadow-xl">
                  {form.formState.isSubmitting ? "שולח..." : "אישור והזמנה"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* חלון קופץ לתשלום */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic text-center">איך תרצה לשלם?</DialogTitle>
            <DialogDescription className="text-center text-zinc-400">
              ההזמנה נשמרה, בחר אפליקציה לסיום התשלום
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-4 py-6">
            {/* כפתור פייבוקס */}
            <Button 
              asChild
              className="py-10 text-xl font-black bg-[#00529c] hover:bg-[#00427c] text-white rounded-xl flex flex-col gap-1 shadow-lg"
            >
              <a href={PAYBOX_LINK} target="_blank" rel="noreferrer">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  שלם ב-PayBox
                </div>
                <span className="text-[10px] font-normal opacity-70">קבוצת "הזמנות 603"</span>
              </a>
            </Button>

            <div className="flex items-center gap-2 py-1">
              <div className="h-px bg-zinc-800 flex-1" />
              <span className="text-zinc-600 text-[10px] font-bold">או</span>
              <div className="h-px bg-zinc-800 flex-1" />
            </div>

            {/* כפתור ביט */}
            <Button 
              asChild
              variant="outline"
              className="py-8 text-lg font-bold border-zinc-700 hover:bg-zinc-800 text-zinc-200 rounded-xl"
            >
              <a href={`https://bitpay.co.il/app/pay-request?phone=${BIT_PHONE_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                שלם ב-Bit
                <ExternalLink className="w-4 h-4 opacity-50" />
              </a>
            </Button>
          </div>

          <p className="text-[10px] text-center text-zinc-500 font-bold uppercase tracking-tighter">
            * ההזמנה תבוצע רק לאחר אישור הסמל
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
