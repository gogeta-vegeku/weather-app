const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001;

app.use(cors()); 
app.use(express.json()); 

app.post('/api/weather', (req, res) => {
    const { temperature, humidity, windSpeed, windDirection, cloudCoverage } = req.body;

    if (!temperature || !humidity || !windSpeed || !windDirection || cloudCoverage === undefined) {
        return res.status(400).json({ message: 'Données incomplètes' });
    }

    console.log('Données météorologiques reçues:', { temperature, humidity, windSpeed, windDirection,cloudCoverage });

    res.status(200).json({ message: 'Données reçues avec succès!' });
});

app.listen(port, () => {
    console.log(`Serveur exécuté sur le port ${port}`);
});
