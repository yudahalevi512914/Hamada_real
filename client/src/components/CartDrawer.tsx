import { useState } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { useCreateOrder } from "@/hooks/use-orders";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  requiresSize: boolean;
};

interface CartDrawerProps {
  items: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  updateSize: (id: string, size: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export function CartDrawer({ items, updateQuantity, updateSize, removeItem, clearCart }: CartDrawerProps) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { toast } = useToast();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!fullName || !phone || !paymentMethod) {
      toast({ title: "שגיאה", description: "נא למלא את כל שדות החובה", variant: "destructive" });
      return;
    }

    const missingSizes = items.some(item => item.requiresSize && !item.size);
    if (missingSizes) {
      toast({ title: "שגיאה", description: "נא לבחור מידה לכל הפריטים הדורשים זאת", variant: "destructive" });
      return;
    }

    createOrder(
      {
        fullName,
        phone,
        paymentMethod,
        totalAmount: total,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          size: item.size
        }))
      },
      {
        onSuccess: () => {
          toast({
            title: "ההזמנה נשלחה בהצלחה!",
            description: "שמרנו את ההזמנה שלך. נחזור אליך בקרוב להסדרת התשלום.",
          });
          clearCart();
          setOpen(false);
          setFullName("");
          setPhone("");
          setPaymentMethod("");
        },
        onError: (err) => {
          toast({
            title: "שגיאה בשליחת ההזמנה",
            description: err.message,
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          className="fixed bottom-6 left-6 h-16 rounded-full px-6 shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all z-40"
          size="lg"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-foreground text-background text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="font-bold text-lg hidden sm:inline-block">סל קניות</span>
            {total > 0 && <span className="border-r border-primary-foreground/30 pr-3 mr-1">{total} ₪</span>}
          </div>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-full sm:max-w-md flex flex-col border-border/50 bg-background/95 backdrop-blur-xl">
        <SheetHeader className="text-right pb-4 border-b border-border/50">
          <SheetTitle className="font-display text-2xl font-bold">ההזמנה שלך</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-4">
              <ShoppingCart className="w-16 h-16" />
              <p>הסל שלך ריק עדיין</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-muted/50 rounded-xl p-3 flex gap-4 border border-border/50">
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold">{item.name}</h4>
                        <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-background rounded-lg border border-border/50 px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-primary transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-primary transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-primary">{item.price * item.quantity} ₪</span>
                      </div>

                      {item.requiresSize && (
                        <div className="pt-2">
                          <Select value={item.size} onValueChange={(val) => updateSize(item.id, val)}>
                            <SelectTrigger className="h-8 text-xs bg-background">
                              <SelectValue placeholder="בחר מידה" />
                            </SelectTrigger>
                            <SelectContent dir="rtl">
                              {["S", "M", "L", "XL", "XXL"].map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/50 pt-4 space-y-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>סה"כ לתשלום:</span>
                  <span className="text-primary">{total} ₪</span>
                </div>

                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2 text-right">
                    <Label htmlFor="fullName">שם מלא</Label>
                    <Input 
                      id="fullName" 
                      placeholder="ישראל ישראלי" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required 
                      className="bg-background"
                    />
                  </div>
                  
                  <div className="space-y-2 text-right">
                    <Label htmlFor="phone">מספר טלפון</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="05X-XXXXXXX" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required 
                      className="bg-background text-right"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2 text-right">
                    <Label>אמצעי תשלום מועדף</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="בחר אמצעי תשלום" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <SelectItem value="bit">Bit</SelectItem>
                        <SelectItem value="paybox">PayBox</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Alert className="bg-destructive/10 border-destructive/20 text-destructive mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-right pr-2 font-bold">שימו לב!</AlertTitle>
                    <AlertDescription className="text-right pr-2 text-sm mt-1">
                      אפשרות התשלום הישיר באתר כרגע אינה זמינה. ההזמנה תישמר במערכת ונציג הפלוגה ייצור קשר לביצוע העברה למספר 058-5851103.
                    </AlertDescription>
                  </Alert>
                </form>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="pt-4 border-t border-border/50">
          <Button 
            type="submit" 
            form="checkout-form" 
            className="w-full h-12 text-lg font-bold"
            disabled={items.length === 0 || isPending}
          >
            {isPending ? "שולח הזמנה..." : "שלח הזמנה"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
