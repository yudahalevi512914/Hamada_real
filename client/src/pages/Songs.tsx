import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Music, ChevronRight } from "lucide-react";
import { Link } from "wouter";

const UNIT_SONGS = [
  { title: "שיר סוגרי השבתות (המרכזי)", content: `...הטקסט המלא שלך...`, special: true },
  { title: 'שיר למ"פ', content: `...הטקסט המלא...` },
  { title: 'שיר למ"מ (העכבר)', content: `...הטקסט המלא...` },
  { title: "שיר למפקד אמיר", content: "..." },
  { title: "שיר למחלקה 4", content: "..." }
];

export default function SongsPage() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20">
        <Link href="/" className="flex items-center gap-2 text-primary mb-8 hover:underline">
          <ChevronRight className="w-4 h-4" /> חזרה לראשי
        </Link>
        <div className="flex items-center gap-4 mb-12 border-r-4 border-primary pr-6">
          <Music className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-black">שירי הפלוגה</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {UNIT_SONGS.map((song, i) => (
            <Card key={i} className={song.special ? 'md:col-span-2 bg-primary/5 border-primary/20' : 'bg-muted/30'}>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-primary">{song.title}</h3>
                <p className="text-lg leading-relaxed whitespace-pre-line italic opacity-90">{song.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
