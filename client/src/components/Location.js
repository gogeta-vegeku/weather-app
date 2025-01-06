import React, { useState, useEffect } from "react";

const Location = ({ onLocation }) => {
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [error, setError] = useState(null);

    useEffect(() => {
        // Controlliamo se il browser supporta la geolocalizzazione
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lon: longitude });
                    onLocation({ lat: latitude, lon: longitude });
                },
                (err) => {
                    setError("Impossibile ottenere la posizione."); // Salviamo l'errore
                }
            );
        } else {
            setError("La geolocalizzazione non è supportata dal browser."); // Messaggio per browser non compatibili
        }
    }, [onLocation]); // useEffect si attiva ogni volta che cambia la funzione onLocation

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Mostriamo eventuali errori */}
            {location.lat && location.lon ? (
                <p>Position: Lat {location.lat}, Lon {location.lon}</p> 
            ) : (
            <p>Ottenendo la posizione...</p> 
      )}
        </div>
    );
};

export default Location;