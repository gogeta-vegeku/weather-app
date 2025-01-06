import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
    const [weather, setWeather] = useState(null); // Stato per i dati meteo
    const [cityName, setCityName] = useState(""); // Stato per il nome della città
    const [location, setLocation] = useState(null); // Stato per la posizione geografica
    const [error, setError] = useState(null); // Stato per gestire errori
    const [loading, setLoading] = useState(false); // Stato per il caricamento

    // Funzione per ottenere la posizione dell'utente
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                () => {
                    setError("Impossibile ottenere la posizione");
                }
            );
        } else {
            setError("Geolocalizzazione non supportata");
        }
    };

    // Funzione per ottenere il meteo e inviarlo al server
    const fetchWeather = async () => {
        if (!cityName && !location) {
            setError("Inserisci una città o attiva la geolocalizzazione!");
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
            });
            console.log('Dati inviati al server:', response.data);
        } catch (err) {
            console.error('Errore nell\'invio dei dati al server:', err);
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
                placeholder="Inserisci una città"
            />
            <button onClick={fetchWeather}>Ottieni Meteo</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {loading ? (
                <p>Caricamento...</p>
            ) : (
                weather && (
                    <div>
                        <h3>Meteo Attuale</h3>
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                            alt={weather.weather[0].description}
                        />
                        <p>Nebulosità: {weather.clouds.all}%</p>
                        <p>Temperatura: {weather.main.temp}°C</p>
                        <p>Umidità: {weather.main.humidity}%</p>
                        <p>Vento: {weather.wind.speed} m/s, Direzione: {weather.wind.deg}°</p>
                    </div>
                )
            )}
        </div>
    );
};

export default Weather;
