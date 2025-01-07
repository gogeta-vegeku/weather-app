import React, { useState } from "react";

function Previsions({ searchHistory }) {
  // Ordina le ricerche in modo che l'ultima eseguita sia in cima
  const sortedSearchHistory = [...searchHistory].reverse();

  return (
    <div className="container mt-5">
      <h1>Recherches Météo</h1>
      {sortedSearchHistory.length === 0 ? (
        <p>Aucune recherche effectuée.</p>
      ) : (
        <ul className="list-group">
          {sortedSearchHistory.map((search, index) => (
            <li key={index} className="list-group-item">
              <h5>{search.location}</h5>
              <p>Température : {search.temperature}°C</p>
              <p>Vitesse du vent : {search.windSpeed} m/s</p>
              <p>Direction du vent : {search.windDirection}°</p>
              <p>Date : {search.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Previsions;
