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
                    setError("Impossible d'obtenir l'emplacement."); // Salviamo l'errore
                }
            );
        } else {
            setError("La géolocalisation n'est pas supportée par le navigateur."); 
        }
    }, [onLocation]); 

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>} 
            {location.lat && location.lon ? (
                <p>Position: Lat {location.lat}, Lon {location.lon}</p> 
            ) : (
            <p>Obtenir le poste...</p> 
      )}
        </div>
    );
};

export default Location;
