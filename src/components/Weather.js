import React, { useState, useEffect } from "react";

const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [cityName, setCityName] = useState(""); 
    const [location, setLocation] = useState(null); 
    const [loading, setLoading] = useState(false); 

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

    
    const fetchWeather = async () => {
        let url = "";
        setLoading(true); 

        if (cityName) {
            
            url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=0e1ebadc01860a4c71769c7e78c6d863`;
        } else if (location) {
            
            const { latitude, longitude } = location;
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=0e1ebadc01860a4c71769c7e78c6d863`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("City not found");
            const data = await response.json();
            setWeather(data);
            setError(null); 
        } catch (err) {
            setError("Ville introuvable ou erreur dans la demande");
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        
        if (!cityName) {
            getLocation();
        }
    }, [cityName]); 
    
    useEffect(() => {
        
        if (cityName || location) {
            fetchWeather();
        }
    }, [cityName, location]);

    return (
        <div>
            
            <input
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)} 
                placeholder="Entrez une ville"
            />
            <button onClick={fetchWeather}>Ottieni Meteo</button>

            
            {error && <p style={{ color: "red" }}>{error}</p>}

            
            {loading && <p>Caricamento dei dati meteo...</p>}

            
            {weather ? (
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
            ) : (
                <p>Télécharger des données météorologiques...</p>
            )}
        </div>
    );
};

export default Weather;
