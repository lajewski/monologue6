import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // Get 5-day forecast
  const locationKey = process.env.REACT_APP_LOCATION_KEY;
  const apiKey = process.env.REACT_APP_API_KEY;
  const apiUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=false`;

  useEffect(() => {
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
    <Router>
      <div className="App">
        {/* Navigation Tabs */}
        <div className="tabs">
          <Link to="/" className="tab">Homepage</Link>
          <Link to="/about" className="tab">About</Link>
          <Link to="/contact" className="tab">Contact Us</Link>
        </div>

        <Routes>
          {/* Homepage Tab */}
          <Route path="/" element={
            <div>
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
          } />

          {/* About Tab */}
          <Route path="/about" element={
            <div>
              <h1>About Us</h1>
              <p>This is a weather app that provides 5-day weather forecasts using AccuWeather API.</p>
              <p>We aim to deliver accurate and reliable weather information to users worldwide.</p>
            </div>
          } />

          {/* Contact Us Tab */}
          <Route path="/contact" element={
            <div>
              <h1>Contact Us</h1>
              <p>Email: contact@weatherapp.com</p>
              <p>Phone: +123-456-7890</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
