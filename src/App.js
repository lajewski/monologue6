import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

// get 5 day forecast  
const locationKey = process.env.REACT_APP_LOCATION_KEY;
const apiKey = process.env.REACT_APP_API_KEY;
const apiUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=false`;

  useEffect(() => {

      // Log values inside useEffect to confirm client-side execution
      console.log("API Key:", apiKey);
      console.log("Location Key:", locationKey);
      console.log("API URL:", apiUrl);




    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        return response.json();
      })
      .then(data => setWeatherData(data))
      .catch(error => setError(error.message));
  }, []);

  return (
    <div className="App">
      <h1>5-Day Weather Forecast</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : weatherData ? (
        <ul>
          {weatherData.DailyForecasts.map((day, index) => (
            <li key={index}>
              <h2>{new Date(day.Date).toDateString()}</h2>
              <p>Min: {day.Temperature.Minimum.Value}°{day.Temperature.Minimum.Unit}</p>
              <p>Max: {day.Temperature.Maximum.Value}°{day.Temperature.Maximum.Unit}</p>
              <p>{day.Day.IconPhrase}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
}


export default App;
