import { Link } from "wouter";
import { format } from "date-fns";
import { ChevronRight, Package, CreditCard, User, Phone, AlertCircle } from "lucide-react";
import { useOrders } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Admin() {
  const { data: orders, isLoading, isError } = useOrders();

  return (
    <div className="min-h-screen bg-muted/20" dir="rtl">
      {/* Admin Header */}
      <header className="bg-background border-b border-border py-4 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="font-display text-2xl font-bold">מערכת ניהול הזמנות</h1>
          </div>
          <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
            <Package className="w-4 h-4 ml-2 inline-block" />
            {orders?.length || 0} הזמנות
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p>טוען נתונים...</p>
            </div>
          ) : isError ? (
            <div className="p-12">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-right">
                  שגיאה בטעינת ההזמנות. אנא נסה שוב מאוחר יותר.
                </AlertDescription>
              </Alert>
            </div>
          ) : orders?.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center opacity-60">
              <Package className="w-16 h-16 mb-4 text-muted-foreground" />
              <h2 className="text-xl font-bold text-foreground mb-2">אין הזמנות עדיין</h2>
              <p className="text-muted-foreground">ההזמנות שיבוצעו דרך האתר יופיעו כאן.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table dir="rtl">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-right w-24">מזהה</TableHead>
                    <TableHead className="text-right">תאריך</TableHead>
                    <TableHead className="text-right">לקוח</TableHead>
                    <TableHead className="text-right">פריטים</TableHead>
                    <TableHead className="text-right">תשלום</TableHead>
                    <TableHead className="text-right">סטטוס</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.map((order) => (
                    <TableRow key={order.id} className="group">
                      <TableCell className="font-mono text-muted-foreground">#{order.id}</TableCell>
                      <TableCell>
                        {order.createdAt ? format(new Date(order.createdAt), "dd/MM/yyyy HH:mm") : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                            {order.fullName}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1" dir="ltr">
                            {order.phone}
                            <Phone className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {/* Parse JSON if it's a string, or map directly if it's an object */}
                          {(typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map((item: any, idx: number) => (
                            <div key={idx} className="text-sm flex items-center gap-2 bg-muted/40 rounded px-2 py-1 w-max">
                              <span className="font-medium">{item.quantity}x</span>
                              <span>{item.name}</span>
                              {item.size && (
                                <Badge variant="outline" className="text-[10px] h-5 px-1 py-0 ml-1">
                                  {item.size}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-bold">{order.totalAmount} ₪</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <CreditCard className="w-3 h-3" />
                            {order.paymentMethod.toUpperCase()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.isPaid ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">
                            שולם
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600 border-amber-500/30 bg-amber-500/10">
                            ממתין לתשלום
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
