import { Navbar } from "@/components/Navbar";
import { ChevronRight, ImageIcon } from "lucide-react";
import { Link } from "wouter";

// התיקון: אנחנו סורקים את תיקיית ה-public/pictures
const imageModules = import.meta.glob("/public/pictures/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}", { 
  eager: true, 
  as: 'url' 
});

// אנחנו מנקים את המילה /public מהנתיב כדי שהדפדפן ימצא את התמונה
const allImages = Object.values(imageModules).map(url => url.replace('/public', ''));

export default function FullGallery() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20">
        <Link href="/" className="flex items-center gap-2 text-primary mb-8 hover:underline">
          <ChevronRight className="w-4 h-4" /> חזרה לראשי
        </Link>
        
        <div className="flex items-center gap-4 mb-12 border-r-4 border-primary pr-6">
          <ImageIcon className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-black">גלריית הפלוגה</h1>
        </div>

        {allImages.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border">
            <p className="text-xl text-muted-foreground">לא נמצאו תמונות בתיקיית client/public/pictures</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allImages.map((src, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border bg-muted shadow-sm group">
                <img 
                  src={src} 
                  alt={`פלוגה 603 תמונה ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
