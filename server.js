import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let cachedEvents = []; // Günlük cache

// Endpoint
app.get("/api/events", (req, res) => {
  res.json(cachedEvents);
});

// Ticketmaster API çağrısı
async function updateEvents() {
  try {
    const keyword = "concert"; // İstersen query param veya sabit
    const tmKey = process.env.TM_API_KEY;
    const url = `https://app.ticketmaster.com/discovery/v1/events.json?apikey=${tmKey}&keyword=${keyword}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data && data._embedded && data._embedded.events) {
      cachedEvents = data._embedded.events.map(event => ({
        id: event.id,
        name: event.name,
        url: event.url,
        date: event.dates.start.dateTime || event.dates.start.localDate,
        venue: event._embedded.venues[0].name
      }));
      console.log(`Güncel ${cachedEvents.length} etkinlik cache'lendi.`);
    } else {
      console.log("Ticketmaster API’den etkinlik gelmedi.");
      cachedEvents = [];
    }
  } catch (err) {
    console.error("Ticketmaster update hatası:", err);
  }
}

// Cron ile günlük tetikleme (saat 02:00)
cron.schedule("0 2 * * *", () => {
  console.log("Günlük update tetiklendi");
  updateEvents();
});

// İsteğe bağlı: sunucu başlarken de bir defa çek
updateEvents();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
