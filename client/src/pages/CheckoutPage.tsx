import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, ExternalLink, CreditCard, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Link } from "wouter";
import { motion } from "framer-motion";

// סכימת אימות נתונים
const formSchema = z.object({
  name: z.string().min(2, "חובה להזין שם מלא"),
  phone: z.string().min(10, "מספר טלפון חייב להכיל 10 ספרות").max(10, "מספר טלפון ארוך מדי"),
  address: z.string().min(2, "חובה להזין לאן להביא את ההזמנה"),
});

export default function CheckoutPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // --- הגדרות תשלום ---
  const BIT_PHONE_NUMBER = "0585851103"; // תחליף למספר הטלפון שלך לקבלת ביט
  const PAYBOX_LINK = "https://links.payboxapp.com/O8fomD9Ue1b"; // הקישור ששלחת לקבוצה

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  // גלילה לראש העמוד בטעינה ובסיום
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isSubmitted]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // כאן תחליף לכתובת ה-Webhook האמיתית שלך מ-Make
      const response = await fetch("YOUR_MAKE_WEBHOOK_URL_HERE", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          orderDate: new Date().toLocaleString('he-IL'),
          unit: "603"
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "הפרטים נשמרו במערכת",
          description: "עבור כעת לביצוע התשלום",
        });
      } else {
        throw new Error();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה בשליחה",
        description: "נסה שוב או פנה לסמל המחלקה",
      });
    }
  }

  // מסך אישור ותשלום (מופיע אחרי לחיצה על אישור)
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4" dir="rtl">
        <Card className="w-full max-w-md bg-zinc-900 border-primary/20 text-center py-10 shadow-[0_0_50px_rgba(234,179,8,0.15)]">
          <CardContent className="space-y-8">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="relative w-20 h-20 mx-auto"
            >
              <CheckCircle2 className="w-full h-full text-primary relative z-10" />
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
            </motion.div>
            
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">ההזמנה נרשמה!</h2>
              <p className="text-zinc-400 font-medium">כדי שנצא לביצוע, יש להסדיר תשלום בקבוצה:</p>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4">
              {/* כפתור פייבוקס - ראשי */}
              <Button 
                asChild
                className="py-12 text-2xl font-black bg-[#00529c] hover:bg-[#00427c] text-white rounded-2xl transition-all hover:scale-105 shadow-xl border-b-4 border-[#003566]"
              >
                <a href={PAYBOX_LINK} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-3">
                    תשלום ב-PayBox
                    <CreditCard className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-normal opacity-70">לקבוצת "הזמנות 603"</span>
                </a>
              </Button>

              <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-zinc-800 flex-1" />
                <span className="text-zinc-600 text-xs font-bold uppercase">או</span>
                <div className="h-px bg-zinc-800 flex-1" />
              </div>

              {/* כפתור ביט - משני */}
              <Button 
                asChild
                variant="outline"
                className="py-6 text-lg font-bold border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-xl transition-all"
              >
                <a href={`https://bitpay.co.il/app/pay-request?phone=${BIT_PHONE_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                  מעבר ל-Bit
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>

            <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-tighter pt-4">
              * אישור סופי יישלח לאחר אימות התשלום ע"י הסמל
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // מסך מילוי פרטים (המסך הראשון)
  return (
    <div className="min-h-screen bg-zinc-950 text-white" dir="rtl">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-2xl mx-auto">
          
          <Link href="/">
            <div className="flex items-center gap-2 text-primary/60 hover:text-primary cursor-pointer mb-8 transition-colors w-fit group">
              <ChevronRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase">חזרה למבצעים</span>
            </div>
          </Link>

          <div className="mb-12 border-r-4 border-primary pr-6">
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none mb-2">צ'ק אאוט</h1>
            <p className="text-zinc-500 font-bold italic uppercase text-sm tracking-widest">פלוגת הנדסה 603 | מחץ</p>
          </div>

          <Card className="bg-zinc-900/40 border-zinc-800 backdrop-blur-md overflow-hidden">
            <div className="h-2 bg-primary w-full opacity-50" />
            <CardContent className="p-8 md:p-12">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="space-y-3">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] block mr-1">שם המזמין</label>
                  <Input 
                    {...form.register("name")} 
                    className="bg-zinc-800/50 border-zinc-700 h-16 text-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                    placeholder="ישראל ישראלי" 
                  />
                  {form.formState.errors.name && <p className="text-primary text-xs font-bold italic">{form.formState.errors.name.message}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] block mr-1">טלפון (בוואטסאפ)</label>
                  <Input 
                    {...form.register("phone")} 
                    type="tel"
                    className="bg-zinc-800/50 border-zinc-700 h-16 text-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                    placeholder="05XXXXXXXX" 
                  />
                  {form.formState.errors.phone && <p className="text-primary text-xs font-bold italic">{form.formState.errors.phone.message}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] block mr-1">מיקום למשלוח (מחלקה / חדר)</label>
                  <Input 
                    {...form.register("address")} 
                    className="bg-zinc-800/50 border-zinc-700 h-16 text-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                    placeholder="מחלקה 1 - חדר סגל" 
                  />
                  {form.formState.errors.address && <p className="text-primary text-xs font-bold italic">{form.formState.errors.address.message}</p>}
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={form.formState.isSubmitting}
                    className="w-full py-10 text-2xl font-black italic uppercase tracking-widest hover:scale-[1.01] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                  >
                    {form.formState.isSubmitting ? "רושם הזמנה..." : "אישור ושליחה לתשלום"}
                  </Button>
                </div>

                <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                  בלחיצה על הכפתור פרטיך יישמרו במערכת המעקב הפלוגתית
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

