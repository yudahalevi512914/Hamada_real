import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import SongsPage from "./pages/Songs";        
import FullGallery from "./pages/FullGallery"; 
import CheckoutPage from "./pages/CheckoutPage"; // ייבוא דף הצ'ק-אאוט החדש
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/songs" component={SongsPage} />      {/* נתיב לדף השירים */}
      <Route path="/gallery" component={FullGallery} />  {/* נתיב לדף הגלריה */}
      <Route path="/checkout" component={CheckoutPage} /> {/* נתיב לדף התשלום החדש */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div dir="rtl">
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
