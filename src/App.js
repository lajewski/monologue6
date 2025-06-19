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

  // Function to get the day initials and date number
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dayNumber = date.getDate();
    const dayNames = ['Su', 'M', 'T', 'W', 'R', 'F', 'Sa'];
    const dayInitial = dayNames[date.getDay()];

    return (
      <div>
        <div>{dayInitial}</div>
        <div>{dayNumber}</div>
      </div>
    );
  };

  // Function to format the time
  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return timeString;
  };

  // Function to chunk array into smaller arrays
  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

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
                  {weatherData.DailyForecasts.map((day, index) => {
                    const iconNumber = String(day.Day.Icon).padStart(2, '0');
                    const iconUrl = `https://developer.accuweather.com/sites/default/files/${iconNumber}-s.png`;

                    return (
                      <li key={index} className="forecast-item">
                        <h2>{formatDate(day.Date)}</h2>
                        <p>Max: {day.Temperature.Maximum.Value}°{day.Temperature.Maximum.Unit}</p>
                        <p>Min: {day.Temperature.Minimum.Value}°{day.Temperature.Minimum.Unit}</p>
                        <img src={iconUrl} alt={day.Day.IconPhrase} />
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>Loading weather data...</p>
              )}

              <h1>12-Hour Hourly Forecast</h1>
              {error ? (
                <p className="error">{error}</p>
              ) : hourlyData ? (
                chunkArray(hourlyData, 4).map((chunk, chunkIndex) => (
                  <ul key={chunkIndex} className="hourly-list">
                    {chunk.map((hour, index) => {
                      const iconNumber = String(hour.WeatherIcon).padStart(2, '0');
                      const iconUrl = `https://developer.accuweather.com/sites/default/files/${iconNumber}-s.png`;

                      let precipIntensity = '';
                      if (hour.PrecipitationIntensity) {
                        switch (hour.PrecipitationIntensity.toLowerCase()) {
                          case 'light':
                            precipIntensity = 'lite';
                            break;
                          case 'moderate':
                            precipIntensity = 'mod';
                            break;
                          case 'heavy':
                            precipIntensity = 'hvy';
                            break;
                          default:
                            precipIntensity = hour.PrecipitationIntensity.toLowerCase(); // use default if not mapped
                        }
                      }

                      return (
                        <li key={index} className="hourly-item">
                          <h3>{formatTime(hour.DateTime)}</h3>
                          <p>Temp: {hour.Temperature.Value}°{hour.Temperature.Unit}</p>
                          <img src={iconUrl} alt={hour.IconPhrase} />
                          {hour.HasPrecipitation && (
                            <p>Precip: {hour.PrecipitationProbability}%, {precipIntensity}</p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ))
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