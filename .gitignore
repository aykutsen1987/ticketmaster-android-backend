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

let cachedEvents = []; // Günlük cache için basit örnek

// Basit endpoint
app.get("/api/events", (req, res) => {
  res.json(cachedEvents);
});

// Ticketmaster API çağrısı için placeholder
async function updateEvents() {
  console.log("Ticketmaster API’den veri güncelleniyor...");
  // Buraya Ticketmaster API entegrasyonu eklenecek
  cachedEvents = []; // Örnek: güncellenen veriyi burada cachele
}

// Cron ile günlük tetikleme (saat 02:00)
cron.schedule("0 2 * * *", () => {
  console.log("Günlük update tetiklendi");
  updateEvents();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
