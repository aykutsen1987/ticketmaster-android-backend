import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/events', async (req, res) => {
    try {
        const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TICKETMASTER_API_KEY}&countryCode=TR&classificationName=Music&size=20`);
        const data = await response.json();
        res.json(data._embedded?.events || []);  // Eğer events yoksa boş array
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ticketmaster fetch error' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
