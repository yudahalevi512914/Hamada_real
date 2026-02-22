import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(input);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.orders.list.path, async (req, res) => {
    const ordersList = await storage.getOrders();
    res.json(ordersList);
  });

  app.get(api.songs.list.path, async (req, res) => {
    const songs = await storage.getSongs();
    res.json(songs);
  });

  app.post(api.songs.create.path, async (req, res) => {
    const song = await storage.createSong(req.body);
    res.status(201).json(song);
  });

  app.get(api.content.list.path, async (req, res) => {
    const content = await storage.getContent();
    res.json(content);
  });

  app.post(api.content.update.path, async (req, res) => {
    const { key, value } = req.body;
    const content = await storage.updateContent(key, value);
    res.json(content);
  });

  // Initial seeding
  const existingSongs = await storage.getSongs();
  if (existingSongs.length === 0) {
    await storage.createSong({
      title: "שיר למפקד אמיר",
      lyrics: "המפקד אמיר, יאללה המפקד אמיר, יאללה המפקד אמיר, יאללה המפקד אמיר",
      category: "מפקדים"
    });
    await storage.createSong({
      title: "שיר למחלקה 4",
      lyrics: "מחלקה 4 יאללה מחלקה 4 יאללה מחלקה 4 יאללה מחלקה 4 יותר חזק מחלקה 4 יאללה מחלקה 4 יאללה מחלקה 4 יאללה מחלקה 4",
      category: "מחלקות"
    });
    await storage.createSong({
      title: "שיר למ״מ",
      lyrics: "היה היה מ״מ , קראו לו העכבר, תפקיד אחרי תפקיד בבהלת תמיד היום כל זה נגמר x2. אווו הוא עולה לגדוד הוא עולה לגדוד הוא עולה לגדוד הוא עולה לגדוד.",
      category: "מפקדים"
    });
    await storage.createSong({
      title: "שיר למ״פ",
      lyrics: "טירונות הנפצות ואבנונים \nחצי פלוגה פה חדולים \nהמפ מנפיץ את המפקדים \n\nגם אם נראה שהשחר לא יפציע לעולם \nהנה בא מ״פ חדש\nגם אם זה נראה שהשחר לא יפציע לעולם \nיאללה כולם תעשו כאן רעש\n\nמ״פ נעול, חולה על בית \nיושב לו בול במדים של זית \nאין בלבולי מח הוא נשבע \nנעלמו החדולים מהפלוגה",
      category: "מפקדים"
    });
    await storage.createSong({
      title: "שיר סוגרי השבתות",
      lyrics: "יום רביעי, הסופ״ש כבר מורגש בידיים מדי א בשלוף בארון, הסמל אומר תכין כומתה תגלחצ נעליים אתה עולה משפט למ״פ אתה נכנס הנה יום הדין הגיע. פתאום אני טיפה לחוץ שולף תירוץ אחרי תירוץ על המפ זה לא משפיע \n\nבהלצ שישי בצהריים \nסופ שבוע זה רק אני בס והממ של שתיים \nכל הנבחרים פה בפלוגה \nהתחצפות כוננות והפקרה אחד גם על חצי מימיה \nהנה עוד שיחה מאמא\nיא איבני איך אתה תלמד \nלא מטווסים עם כל אחד \nהשארת אותנו פה לבד…\n\nיום ראשון \nאמא אומרת הגזמת \nתיזהר \nהשבת אצל סבא וסבתא \nאני אומר לה תירגעי\nהשבוע אני נקי\nלא יהיה פה שום אירוע \n\nכל השבוע אני ספץ פתאום המפקד שוב מתפוצץ \nבסהכ רציתי פיצה",
      videoUrl: "https://youtu.be/euG7A3CuIlI?si=T6jS4qDFrta6oAGZ",
      category: "כללי"
    });
  }

  const existingContent = await storage.getContent();
  if (existingContent.length === 0) {
    await storage.updateContent("site_title", "פלוגה 603");
    await storage.updateContent("site_subtitle", "אוגוסט 2025");
  }

  return httpServer;
}