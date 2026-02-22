import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
    { href: "/#songs", label: "שירים ומורל" },
    { href: "/#store", label: "חנות הפלוגה" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-panel shadow-lg py-3" : "bg-transparent py-5"
      }`}
      dir="rtl"
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight">
            פלוגה <span className="text-primary">603</span>
          </span>
        </Link>

        {/* Desktop Nav */}
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
            <Button variant="ghost" size="sm" className="ms-4">
              התחברות מנהל
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
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => {
                const isHashLink = link.href.includes('#');
                return isHashLink ? (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-lg text-start font-medium hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-lg text-start font-medium hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                <div className="p-3 rounded-lg text-start font-medium text-primary hover:bg-primary/10 transition-colors mt-2 border-t border-border">
                  ניהול הזמנות
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
