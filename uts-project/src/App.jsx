import { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const App = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [citiesWeather, setCitiesWeather] = useState([]);

  const apiKey = "3cb5e8671912ce68075df020ecddab77";
  
  const cities = ["Jakarta", "Bandung", "Semarang", "Yogyakarta"];

  const getWeather = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("City not found! Please try again.");
    }
  };

  const fetchCitiesWeather = async () => {
    const weatherDataArray = [];
    for (const city of cities) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        weatherDataArray.push(response.data);
      } catch (err) {
        console.error(`Error fetching weather data for ${city}: ${err}`);
      }
    }
    setCitiesWeather(weatherDataArray);
  };

  useEffect(() => {
    fetchCitiesWeather();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Display weather data for Malang initially
  const initialWeatherCity = "Malang";
  const [initialWeatherData, setInitialWeatherData] = useState(null);

  useEffect(() => {
    const fetchInitialWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${initialWeatherCity}&appid=${apiKey}&units=metric`
        );
        setInitialWeatherData(response.data);
      } catch (err) {
        console.error(`Error fetching weather data for ${initialWeatherCity}: ${err}`);
      }
    };

    fetchInitialWeather();
  }, []);

  return (
    <div className="main-container">
      <div className="app-container">
        <h1>Weather App</h1>
        <form className="input-form" onSubmit={getWeather}>
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="city-input"
          />
          <button type="submit" className="search-button">Get Weather</button>
        </form>

        {error && <p className="error">{error}</p>}

        {/* Display weather data for Malang initially or searched city */}
        {(weatherData || initialWeatherData) && (
          <div className="weather-info">
            <h2>{(weatherData ? weatherData.name : initialWeatherData.name)}, {(weatherData ? weatherData.sys.country : initialWeatherData.sys.country)}</h2>
            <h3>{Math.round((weatherData ? weatherData.main.temp : initialWeatherData.main.temp))}°C</h3>
            <p>{(weatherData ? weatherData.weather[0].description : initialWeatherData.weather[0].description)}</p>
            <div className="details">
              <p>Humidity: {(weatherData ? weatherData.main.humidity : initialWeatherData.main.humidity)}%</p>
              <p>Wind: {(weatherData ? weatherData.wind.speed : initialWeatherData.wind.speed)} m/s</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="forecast-container">
        <div className="cities-container">
          {citiesWeather.map((cityWeather, index) => (
            <div key={index} className="city-card">
              <h3>{cityWeather.name}</h3>
              <p>{Math.round(cityWeather.main.temp)}°C</p>
              <p>{cityWeather.weather[0].description}</p>
              <div className="city-details">
                <p>Humidity: {cityWeather.main.humidity}%</p>
                <p>Wind: {cityWeather.wind.speed} m/s</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
