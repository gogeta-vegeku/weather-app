import React, { useState } from "react";
import Location from "./components/Location";
import Weather from "./components/Weather";
import axios from "axios"; // Importa Axios
import "./App.css";

function App() {
  const [location, setLocation] = useState(null);

  const handleLocation = (loc) => {
    setLocation(loc);
  };

  const sendWeatherData = async (weatherData) => {
    try {
      const response = await axios.post("/api/weather", weatherData); 
      console.log(response.data.message); 
    } catch (error) {
      console.error(
        "Errore nell'invio dei dati:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="App">
      <h1>Application Meteo</h1>
      <Location onLocation={handleLocation} />
      {location && (
        <Weather location={location} onSendWeatherData={sendWeatherData} />
      )}
    </div>
  );
}

export default App;
