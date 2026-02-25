import { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Music, ChevronRight, Play, Pause } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const UNIT_SONGS = [
  { 
    id: "shabbat",
    title: "שיר סוגרי השבתות (המרכזי)", 
    audioSrc: "/audio/shabbat.mp3",
    content: `יום רביעי, הסופ״ש כבר מורגש בידיים
מדי א בשלוף בארון
הסמל אומר תכין כומתה תגלחצ נעליים
אתה עולה משפט למ״פ אתה נכנס
הנה יום הדין הגיע.
פתאום אני טיפה לחוץ שולף תירוץ אחרי תירוץ
על המפ זה לא משפיע

בהלצ שישי בצהריים
סופ שבוע זה רק אני בס והממ של שתיים
כל הנבחרים פה בפלוגה
התחצפות כוננות והפקרה אחד גם על חצי מימיה
הנה עוד שיחה מאמא
יא איבני איך אתה תלמד
לא מטווסים עם כל אחד
השארת אותנו פה לבד…

יום ראשון
אמא אומרת הגזמת
תיזהר
השבת אצל סבא וסבתא
אני אומר לה תירגעי
השבוע אני נקי
לא יהיה פה שום אירוע

כל השבוע אני ספץ פתאום המפקד שוב מתפוצץ
בסהכ רציתי פיצה`,
    special: true 
  },
  { 
    id: "commander",
    title: "שיר למ״פ", 
    audioSrc: "/audio/commander.mp3",
    content: `טירונות הנפצות ואבנונים
חצי פלוגה פה חדולים
המפ מנפיץ את המפקדים
גם אם נראה שהשחר לא יפציע לעולם
הנה בא מ״פ חדש
גם אם זה נראה שהשחר לא יפציע לעולם
יאללה כולם תעשו כאן רעש

מ״פ נעול, חולה על בית
יושב לו בול במדים של זית
אין בלבולי מח הוא נשבע
נעלמו החדולים מהפלוגה`
  },
  { 
    id: "mouse",
    title: "שיר למ״מ", 
    audioSrc: "/audio/mouse.mp3",
    content: `היה היה מ״מ, קראו לו העכבר,
תפקיד אחרי תפקיד, בבהל״צ תמיד, היום כל זה נגמר x2.
אווו, הוא עולה לגדוד, הוא עולה לגדוד, הוא עולה לגדוד, הוא עולה לגדוד.`
  },
  { 
    id: "amir",
    title: "שיר למפקד אמיר", 
    audioSrc: "/audio/amir.mp3",
    content: "המפקד אמיר, יאללה המפקד אמיר, יאללה המפקד אמיר, יאללה המפקד אמיר" 
  },
  { 
    id: "unit4",
    title: "שיר למחלקה 4", 
    audioSrc: "/audio/unit4.mp3",
    content: "מחלקה 4 יאללה מחלקה 4 יאללה מחלקה 4 יאללה מחלקה 4 יותר חזק מחלקה 4 יאללה מחלקה 4 יאללה מחלקה 4 יאללה מחלקה 4" 
  }
];

export default function SongsPage() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSong = (id: string, src: string) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = src;
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        setPlayingId(id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white" dir="rtl">
      <Navbar />
      
      {/* אלמנט אודיו נסתר שמשרת את כל הדף */}
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} />

      <main className="container mx-auto px-4 pt-32 pb-20">
        <Link href="/">
          <motion.div whileHover={{ x: 5 }} className="flex items-center gap-2 text-primary cursor-pointer mb-12 w-fit group">
            <div className="bg-primary/10 p-1 rounded-lg group-hover:bg-primary/20 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight">חזרה לראשי</span>
          </motion.div>
        </Link>

        <div className="max-w-4xl mb-16 border-r-4 border-primary pr-8 py-2">
          <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter mb-4">שיאי הפלוגה</h1>
          <p className="text-zinc-400 text-xl font-medium">המילים והצלילים שמלווים את 603</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {UNIT_SONGS.map((song, i) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={song.special ? 'md:col-span-2' : ''}
            >
              <Card className={`relative overflow-hidden border-zinc-800 transition-all duration-500 ${playingId === song.id ? 'bg-primary/10 border-primary/40 shadow-[0_0_30px_rgba(234,179,8,0.1)]' : 'bg-zinc-900/40 hover:bg-zinc-900/60'}`}>
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div className="space-y-1">
                      {song.special && (
                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">The Anthem</span>
                      )}
                      <h3 className={`text-2xl font-bold italic ${song.special ? 'text-primary' : 'text-white'}`}>
                        {song.title}
                      </h3>
                    </div>
                    
                    <Button 
                      variant={playingId === song.id ? "default" : "outline"}
                      size="icon"
                      className={`rounded-2xl w-14 h-14 shrink-0 transition-all duration-300 ${playingId === song.id ? 'shadow-[0_0_15px_rgba(var(--primary),0.5)]' : 'border-zinc-700'}`}
                      onClick={() => toggleSong(song.id, song.audioSrc)}
                    >
                      {playingId === song.id ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-1 fill-current" />}
                    </Button>
                  </div>

                  <p className="text-lg leading-relaxed whitespace-pre-line text-zinc-300 italic font-medium opacity-90">
                    {song.content}
                  </p>

                  {/* Equalizer animation when playing */}
                  <AnimatePresence>
                    {playingId === song.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-1.5 mt-10 h-6 items-end justify-center bg-primary/5 py-4 rounded-xl"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((b) => (
                          <motion.div
                            key={b}
                            animate={{ height: [6, 20, 10, 24, 6] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: b * 0.05 }}
                            className="w-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="py-16 border-t border-zinc-900/50 text-center bg-black/20">
        <p className="text-zinc-500 font-bold tracking-widest uppercase text-xs">פלוגה 603 | חיל ההנדסה הקרבית</p>
      </footer>
    </div>
  );
}
