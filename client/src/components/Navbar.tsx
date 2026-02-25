import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react"; // הסרתי את ShieldAlert כי שמנו לוגו
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import logo1 from "@assets/IMG_6514_1771755047663.jpeg"; // ייבוא הלוגו שלך

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "ראשי" },
    { href: "/#about", label: "אודות" },
    { href: "/#gallery", label: "גלריה" },
    { href: "/#songs", label: "שירי הפלוגה" }, // עודכן מ"שירים ומורל"
    { href: "/#store", label: "חנות הפלוגה" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-panel shadow-lg py-2" : "bg-transparent py-4"
      }`}
      dir="rtl"
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        
        {/* לוגו פלוגה - צד ימין */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img 
              src={logo1} 
              alt="סמל פלוגה 603" 
              className="w-12 h-12 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300" 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-2xl tracking-tight leading-none">
              פלוגה <span className="text-primary">603</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav - צד שמאל */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isHashLink = link.href.includes('#');
            return isHashLink ? (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  location === link.href 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/admin">
            <Button variant="outline" size="sm" className="ms-4 rounded-xl border-primary/20 hover:bg-primary/10">
              ניהול
            </Button>
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-2 text-right">
              {navLinks.map((link) => {
                const isHashLink = link.href.includes('#');
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-4 rounded-xl font-medium hover:bg-primary/10 transition-colors border-b border-border/50 last:border-0"
                  >
                    {link.label}
                  </a>
                );
              })}
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                <div className="p-4 rounded-xl font-medium text-primary bg-primary/5 mt-2 text-center border border-primary/20">
                  כניסת מנהל
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
