import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

async function fetchEventsFromTicketmaster() {
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TICKETMASTER_API_KEY}&countryCode=TR&classificationName=Music&size=20`;
    const response = await fetch(url);
    const data = await response.json();
    // Eğer _embedded ve events varsa gönder, yoksa boş array
    return data._embedded?.events || [];
}

app.get('/api/events', async (req, res) => {
    try {
        const events = await fetchEventsFromTicketmaster();
        // Android tarafı için mapleyip JSON gönder
        const mapped = events.map(event => ({
            id: event.id,
            name: event.name,
            artist: event._embedded?.attractions?.map(a => a.name).join(", ") || "Various Artists",
            date: event.dates?.start?.localDate || "",
            time: event.dates?.start?.localTime || "20:00",
            venue: event._embedded?.venues?.[0]?.name || "Unknown Venue",
            address: `${event._embedded?.venues?.[0]?.address?.line1 || ""}, ${event._embedded?.venues?.[0]?.city?.name || ""}`,
            imageUrl: event.images?.[0]?.url || "",
            latitude: parseFloat(event._embedded?.venues?.[0]?.location?.latitude) || 0.0,
            longitude: parseFloat(event._embedded?.venues?.[0]?.location?.longitude) || 0.0,
            type: event.classifications?.[0]?.segment?.name?.toUpperCase() || "CONCERT",
            ticketUrl: event.url || ""
        }));
        res.json(mapped);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ticketmaster fetch error" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
