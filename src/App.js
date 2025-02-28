import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [error, setError] = useState(null);

  const locationKey = process.env.REACT_APP_LOCATION_KEY;
  const apiKey = process.env.REACT_APP_API_KEY;

  // Fetch 5-day forecast
  useEffect(() => {
    fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=false`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch weather data');
        return response.json();
      })
      .then(data => setWeatherData(data))
      .catch(error => setError(error.message));
  }, []);

  // Fetch 12-hour forecast
  useEffect(() => {
    fetch(`https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&metric=false`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch hourly data');
        return response.json();
      })
      .then(data => setHourlyData(data))
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
                <p className="error">{error}</p>
              ) : weatherData ? (
                <ul className="forecast-list">
                  {weatherData.DailyForecasts.map((day, index) => (
                    <li key={index} className="forecast-item">
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

              <h1>12-Hour Hourly Forecast</h1>
              {error ? (
                <p className="error">{error}</p>
              ) : hourlyData ? (
                <ul className="hourly-list">
                  {hourlyData.map((hour, index) => (
                    <li key={index} className="hourly-item">
                      <h3>{new Date(hour.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h3>
                      <p>Temp: {hour.Temperature.Value}°{hour.Temperature.Unit}</p>
                      <p>{hour.IconPhrase}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Loading hourly data...</p>
              )}

              {/* AccuWeather Attribution */}
              <div className="accuweather">
                <p>Powered by</p>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2e/AccuWeather_Logo.svg" 
                  alt="AccuWeather Logo" 
                  className="accuweather-logo"
                />
              </div>
            </div>
          } />

          {/* About Tab */}
          <Route path="/about" element={
            <div>
              <h1>About Us</h1>
              <p>This is a weather app that provides 5-day and hourly weather forecasts using AccuWeather API.</p>
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
