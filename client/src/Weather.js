import { useState, useEffect } from 'react';
import './Weather.css';
import logo from './assets/logo.png';
import PreLoader from './PreLoader';

function formatTime(unix, timezoneOffset) {
  const date = new Date((unix + timezoneOffset) * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function WeatherAdvisor() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loader , setLoader] =useState(false);
  const [hourlyWeather, setHourlyWeather] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [crop, setCrop] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [recError, setRecError] = useState('');
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });

  const API_KEY = '6da147bd812a11b5b3cfddcbff9bd73a';

  // Fetch user's crop from backend on mount
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    if (localUser && localUser.email) {
      fetch('http://localhost:5000/users')
        .then(res => res.json())
        .then(users => {
          const found = users.find(u => u.email === localUser.email);
          if (found && found.crop) setCrop(found.crop);
        });
    }
  }, []);

  // Function to fetch hourly forecast
  const getHourlyForecast = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
      );
      const data = await response.json();
      // Get next 24 hours (8 3-hour intervals)
      const hourlyData = data.list.slice(0, 8).map(item => ({
        dt: item.dt,
        temp: item.main.temp,
        weather: item.weather,
        humidity: item.main.humidity,
        wind: item.wind.speed
      }));
      setHourlyWeather(hourlyData);
    } catch (error) {
      console.error('Error fetching hourly forecast:', error);
      setHourlyWeather([]);
    }
  };

  const gotLocation = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    setLoader(true);
    // Fetch current weather
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`
    )
      .then(res => res.json())
      .then(data => {
        setWeatherData(data);
        setError('');
        // Fetch hourly forecast after getting current weather
        getHourlyForecast(lat, lon);
      })
      .catch(() => setError('Failed to fetch weather by location.'))
      .finally(() => setLoader(false));
  };

  const failedToGet = () =>
    setError('Location access denied. You can enter city manually.');

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(gotLocation, failedToGet);
  };

  const getWeatherByCity = () => {
    if (!city.trim()) {
      setError('Please enter a city name.');
      return;
    }
    setLoader(true);  // show loader
    setTimeout(() => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
      )
        .then(res => {
          if (!res.ok) throw new Error('City not found');
          return res.json();
        })
        .then(data => {
          setWeatherData(data);
          setError('');
          // Fetch hourly forecast using the city's coordinates
          getHourlyForecast(data.coord.lat, data.coord.lon);
        })
        .catch(() => setError('City not found. Please check the spelling.'))
        .finally(() => setLoader(false));  
    }, 1000); 
  };

  const getWeatherVideo = (main) => {
    switch (main) {
      case 'Clear': return '/videos/sunny.mp4';
      case 'Clouds': return '/videos/cloudy.mp4';
      case 'Rain':
      case 'Drizzle': return '/videos/rain.mp4';
      case 'Thunderstorm':
      case 'Tornado':
      case 'Squall': return '/videos/storm.mp4';
      case 'Snow': return '/videos/snow.mp4';
      case 'Mist':
      case 'Fog':
      case 'Haze':
      case 'Smoke': return '/videos/foggy.mp4';
      default: return '/videos/default.mp4';
    }
  };

  const getIrrigationAdvice = (data) => {
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const rain = data.rain?.['1h'] || 0;
    if (rain > 5) return 'No irrigation needed. Natural rainfall is sufficient.';
    if (temp > 30 && humidity < 40) return 'High evapotranspiration detected. Irrigate more frequently.';
    if (temp > 25 && humidity < 60) return 'Moderate watering advised.';
    if (temp < 20) return 'Watering not urgently required.';
    return 'Maintain regular irrigation schedule.';
  };

  const getSprayAdvice = (data) => {
    const wind = data.wind.speed;
    const condition = data.weather[0].main;
    if (wind > 10) return 'Avoid spraying — high wind may cause drift.';
    if (condition === 'Rain') return "Don't spray during rain.";
    if (condition === 'Clear' && wind < 5) return 'Ideal conditions for spraying.';
    if (condition === 'Clouds' && wind < 5) return 'You may spray, but avoid before expected rain.';
    return 'Monitor local conditions before spraying.';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleUnitToggle = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
    // Optionally, refetch weather for current city/location
    if (weatherData) {
      if (weatherData.name) {
        getWeatherByCity();
      } else if (weatherData.coord) {
        gotLocation({ coords: weatherData.coord });
      }
    }
  };

  // Fetch backend recommendation when weatherData or crop changes
  useEffect(() => {
    if (!weatherData || !crop) {
      setRecommendation(null);
      setRecError('');
      return;
    }
    // Only fetch if weatherData has required fields
    const temp = weatherData.main?.temp;
    const humidity = weatherData.main?.humidity;
    const rain = weatherData.rain?.['1h'] || 0;
    const wind_speed = weatherData.wind?.speed;
    if (
      temp === undefined ||
      humidity === undefined ||
      wind_speed === undefined
    ) {
      setRecommendation(null);
      setRecError('');
      return;
    }
    // Fetch from backend
    const params = new URLSearchParams({
      crop,
      temp: temp.toString(),
      humidity: humidity.toString(),
      rain: rain.toString(),
      wind_speed: wind_speed.toString(),
    });
    fetch(`http://localhost:5000/api/recommendations?${params.toString()}`)
      .then(res => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then(data => {
        setRecommendation(data);
        setRecError('');
      })
      .catch(async (err) => {
        if (err.status === 404) {
          setRecError('No matching recommendation found for these conditions.');
        } else {
          setRecError('Failed to fetch recommendation.');
        }
        setRecommendation(null);
      });
  }, [weatherData, crop]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    return () => document.body.classList.remove('sidebar-open');
  }, [sidebarOpen]);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    if (localUser) {
      setUserInfo({
        name: localUser.displayName || localUser.name || '',
        email: localUser.email || '',
      });
    }
  }, []);

  return (
    <>
    {loader? <PreLoader/>:
    <div className="weatherPage">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="background-video"
      >
        <source src={getWeatherVideo(weatherData?.weather?.[0]?.main)}  type="video/mp4" />
      </video>
      {/* Sidebar Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} id="sidebar-logo" alt="logo" />
          <button className="close-sidebar" onClick={closeSidebar} data-tooltip="Close Menu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path fill="#13321e" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
            </svg>
          </button>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-userinfo">
            <div className="sidebar-avatar" aria-label="User avatar">{userInfo.name ? userInfo.name[0].toUpperCase() : <svg width="32" height="32"><circle cx="16" cy="16" r="16" fill="#a5d6a7" /></svg>}</div>
            <div className="sidebar-user-details">
              <div className="sidebar-user-name">{userInfo.name || 'Guest'}</div>
              <div className="sidebar-user-email">{userInfo.email}</div>
              {crop && <div className="sidebar-user-crop">Crop: <span>{crop}</span></div>}
            </div>
          </div>
          <nav className="sidebar-nav" aria-label="Sidebar navigation">
            <a href="/" className="sidebar-nav-link" aria-label="Home"><span role="img" aria-label="Home">🏠</span> Home</a>
            <a href="/profile" className="sidebar-nav-link" aria-label="Profile"><span role="img" aria-label="Profile">👤</span> Profile</a>
            <a href="/about" className="sidebar-nav-link" aria-label="About Creators"><span role="img" aria-label="About">👨‍💻</span> About</a>
            <a href="#" className="sidebar-nav-link" aria-label="Logout" onClick={() => { localStorage.clear(); window.location.href = '/'; }}><span role="img" aria-label="Logout">🚪</span> Logout</a>
          </nav>
          <div className="sidebar-search">
            <input
              type="text"
              className="sidebar-search-input"
              placeholder="Search By City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="Search by city"
            />
            <button className="sidebar-search-btn" onClick={() => { getWeatherByCity(); closeSidebar(); }} data-tooltip="Search" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#13321e" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
            </button>
          </div>
          <button className="sidebar-location-btn" onClick={() => { getLocation(); closeSidebar(); }} data-tooltip="Use My Location" aria-label="Use my location">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="#13321e" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
            Use My Location
          </button>
        </div>
      </div>
      <div className="navbar">
        <div className="logo">
          <img src={logo} id="logo" alt="logo" />
        </div>
        <div className="nav-actions">
          <input
            type="text"
            className="search-input"
            placeholder="Search By City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="icon-btn search-btn" onClick={getWeatherByCity} data-tooltip="Search">
            <svg xmlns="http://www.w3.org/2000/svg" id="search" viewBox="0 0 512 512">
              <path fill="#13321e" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </button>
          <button className="icon-btn location-btn" onClick={getLocation} data-tooltip="Use My Location">
            <svg xmlns="http://www.w3.org/2000/svg" id="location" viewBox="0 0 384 512">
              <path fill="#13321e" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
            </svg>
          </button>
          <button className="hamburger-menu" onClick={toggleSidebar} data-tooltip="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path fill="#13321e" d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/>
            </svg>
          </button>
          {/* Unit Toggle */}
          <button className="unit-toggle-btn" onClick={handleUnitToggle} title="Toggle °C/°F">
            {unit === 'metric' ? '°C' : '°F'}
          </button>
        </div>
      </div>
      <div className="main-container">
        {/* Show user's crop */}
        {crop && (
          <div style={{ marginBottom: '20px', fontWeight: 600, color: '#195030', fontSize: '18px' }}>
            Crop: <span style={{ color: '#2e7d32' }}>{crop}</span>
          </div>
        )}
        {weatherData ? (
          <>
            <div className="weather-info">
            <div className="weather-image">
              {weatherData?.weather?.[0]?.icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                  alt={weatherData.weather[0].description}
                />
              )}
            </div>
              <div className="weather-details">
                <h2>{weatherData.name}, {weatherData.sys.country}</h2>
                <p className="temperature">{Math.round(weatherData.main.temp)}{unit === 'metric' ? '°C' : '°F'}</p>
                <p>Feels like: {Math.round(weatherData.main.feels_like)}{unit === 'metric' ? '°C' : '°F'}</p>
                <p>Humidity: {weatherData.main.humidity}%</p>
                <p>Wind: {weatherData.wind.speed} {unit === 'metric' ? 'km/h' : 'mph'}</p>
                <p>Pressure: {weatherData.main.pressure} hPa</p>
                <p>Visibility: {weatherData.visibility / 1000} km</p>
                <p>Sunrise: {formatTime(weatherData.sys.sunrise, weatherData.timezone)}</p>
                <p>Sunset: {formatTime(weatherData.sys.sunset, weatherData.timezone)}</p>
                <p>Rain (last 1h): {weatherData.rain?.['1h'] || 0} mm</p>
                <p>Condition: {weatherData.weather[0].main} — {weatherData.weather[0].description}</p>
                <p>Date: {new Date(weatherData.dt * 1000).toLocaleString()}</p>
              </div>
            </div>
            {/* Hourly Forecast Section */}
            {hourlyWeather.length > 0 && (
              <div className="hourly-forecast">
                <h3>24-Hour Forecast</h3>
                <div className="hourly-cards">
                  {hourlyWeather.map((hour, index) => (
                    <div key={index} className="hour-card">
                      <p>{new Date(hour.dt * 1000).getHours()}:00</p>
                      <img
                        src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                        alt={hour.weather[0].description}
                      />
                      <p className="temperature">{Math.round(hour.temp)}{unit === 'metric' ? '°C' : '°F'}</p>
                      <p style={{ fontSize: '11px', opacity: 0.8 }}>
                        {hour.weather[0].main}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Weekly Forecast Placeholder */}
            <div className="weekly-forecast">
              <h3>Weekly Forecast (Coming Soon)</h3>
              <div className="weekly-cards">
                {/* Future: Map weekly forecast data here */}
              </div>
            </div>
            <div className="recommendation-box">
              <h3>Recommendations</h3>
              {recError && <p style={{ color: 'red', fontWeight: 500 }}>{recError}</p>}
              {recommendation ? (
                <ul>
                  <li><strong>Action:</strong> {recommendation.action}</li>
                  <li><strong>Water Level:</strong> {recommendation.water_level}</li>
                  <li><strong>Spray Time:</strong> {recommendation.spray_time}</li>
                  <li><strong>Condition:</strong> {recommendation.condition}</li>
                </ul>
              ) : (
                <ul>
                  <li><strong>Irrigation:</strong> {getIrrigationAdvice(weatherData)}</li>
                  <li><strong>Spraying:</strong> {getSprayAdvice(weatherData)}</li>
                </ul>
              )}
            </div>
          </>
        ) : (
          <p style={{ margin: '20px 0', fontSize: '18px' }}>Enter a city or use location to get weather info.</p>
        )}
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      </div>
    </div>
    }
  </>
  );
} 