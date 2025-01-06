import React, { useState } from "react"; 
import Location from "./components/Location"; 
import Weather from "./components/Weather"; 
import "./App.css";
function App() {
  const [location, setLocation] = useState(null); 

  const handleLocation = (loc) => {
    setLocation(loc); 
  };

  return (
    <div className="App">
      <h1>Application Meteo</h1>
      <Location onLocation={handleLocation} />
      {location && <Weather location={location} />}
    </div>
  );
}

export default App;
