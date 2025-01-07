import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Location from "./components/Location";
import Weather from "./components/Weather";
import Previsions from "./components/Previsions"; // Importa la nuova pagina
import axios from "axios";

import "./App.css";

function App() {
  const [location, setLocation] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]); // Stato per salvare le ricerche
  const navigate = useNavigate();

  const handleLocation = (loc) => {
    setLocation(loc);
  };

  const sendWeatherData = async (weatherData) => {
    try {
      const response = await axios.post("/api/weather", weatherData);
      console.log(response.data.message);

      // Aggiorna la cronologia delle ricerche
      setSearchHistory((prev) => [weatherData, ...prev]);

      // Naviga alla pagina Previsions
      navigate("/previsions");
    } catch (error) {
      console.error(
        "Errore nell'invio dei dati:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="App">
            <div className="container">
              <h1>Application Meteo</h1>
              <Location onLocation={handleLocation} />
              {location && (
                <Weather location={location} onSendWeatherData={sendWeatherData} />
              )}
            </div>
          </div>
        }
      />
      <Route
        path="/previsions"
        element={<Previsions searchHistory={searchHistory} />}
      />
    </Routes>
  );
}

export default function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
