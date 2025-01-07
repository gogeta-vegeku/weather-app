import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = ({ onSendWeatherData }) => {
    const [weather, setWeather] = useState(null); 
    const [cityName, setCityName] = useState(""); 
    const [location, setLocation] = useState(null); 
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false); 

    // Ottieni la posizione dell'utente
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                () => {
                    setError("Impossible d'obtenir l'emplacement");
                }
            );
        } else {
            setError("Géolocalisation non prise en charge");
        }
    };

    // Funzione per ottenere il meteo e inviarlo al server
    const fetchWeather = async () => {
        if (!cityName && !location) {
            setError("Entrez une ville ou activez la géolocalisation !");
            return;
        }

        setLoading(true); // Inizia il caricamento

        let url = "";
        if (cityName) {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=0e1ebadc01860a4c71769c7e78c6d863`;
        } else if (location) {
            const { latitude, longitude } = location;
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=0e1ebadc01860a4c71769c7e78c6d863`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Città non trovata o errore API');
            const data = await response.json();
            setWeather(data);
            setError(null);

            // Invia i dati meteo al server
            await sendWeatherData(data);

            // Passa i dati al parent component per aggiornare la cronologia
            onSendWeatherData({
                location: data.name,
                temperature: data.main.temp,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                windDirection: data.wind.deg,
                cloudCoverage: data.clouds.all,
                description: data.weather[0].description,
                date: new Date().toLocaleString(),
            });
        } catch (err) {
            setError(err.message || 'Errore nella richiesta meteo');
        } finally {
            setLoading(false); // Finisce il caricamento
        }
    };

    // Funzione per inviare i dati al server usando Axios
    const sendWeatherData = async (weatherData) => {
        try {
            const response = await axios.post('/api/weather', {
                temperature: weatherData.main.temp,
                humidity: weatherData.main.humidity,
                windSpeed: weatherData.wind.speed,
                windDirection: weatherData.wind.deg,
                cloudCoverage: weatherData.clouds.all,
            });
            console.log('Données envoyées au serveur:', response.data);
        } catch (err) {
            console.error("Erreur lors de l'envoi des données au serveur:", err);
        }
    };

    useEffect(() => {
        if (!cityName) {
            getLocation();
        }
    }, [cityName]);

    return (
        <div>
            <input
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="Entrez une ville"
            />
            <button onClick={fetchWeather}>Obtenir la météo</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {loading ? (
                <p>Chargement...</p>
            ) : (
                weather && (
                    <div>
                        <h3>Météo actuelle</h3>
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                            alt={weather.weather[0].description}
                        />
                        <p>Nébulosité: {weather.clouds.all}%</p>
                        <p>Température: {weather.main.temp}°C</p>
                        <p>Humidité: {weather.main.humidity}%</p>
                        <p>Vent: {weather.wind.speed} m/s, Direction: {weather.wind.deg}°</p>
                    </div>
                )
            )}
        </div>
    );
};

export default Weather;
