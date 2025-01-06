const express = require('express');
const cors = require('cors');  // Aggiungi il pacchetto cors
const app = express();
const port = 5001;

app.use(cors()); // Abilita il CORS
app.use(express.json()); // Per elaborare il JSON nel corpo delle richieste

app.post('/api/weather', (req, res) => {
    const { temperature, humidity, windSpeed } = req.body;

    if (!temperature || !humidity || !windSpeed) {
        return res.status(400).json({ message: 'Dati incompleti' });
    }

    console.log('Dati meteo ricevuti:', { temperature, humidity, windSpeed });

    res.status(200).json({ message: 'Dati ricevuti con successo!' });
});

// Middleware per la gestione degli errori generali
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Errore interno del server' });
});

app.listen(port, () => {
    console.log(`Server in esecuzione sulla porta ${port}`);
});
