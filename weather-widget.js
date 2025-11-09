/**
 * Weather Widget - Wyświetlacz warunków atmosferycznych
 * Pokazuje aktualną pogodę z efektami wizualnymi
 */

const WEATHER_ICONS = {
  clear: '☀️',
  clouds: '☁️',
  rain: '🌧️',
  snow: '❄️',
  thunderstorm: '⛈️',
  mist: '🌫️',
  fog: '🌫️',
  drizzle: '🌦️',
};

/**
 * Get translated weather descriptions
 */
function getWeatherDescriptions() {
  const translations = window.daremonState?.translations || {};

  return {
    clear: translations.weatherClear || 'Clear',
    clouds: translations.weatherClouds || 'Cloudy',
    rain: translations.weatherRain || 'Rain',
    snow: translations.weatherSnow || 'Snow',
    thunderstorm: translations.weatherThunderstorm || 'Thunderstorm',
    mist: translations.weatherMist || 'Mist',
    fog: translations.weatherFog || 'Fog',
    drizzle: translations.weatherDrizzle || 'Drizzle',
  };
}

/**
 * Pobiera dane pogodowe z geolokalizacji
 */
async function fetchWeatherData() {
  try {
    // Próba uzyskania geolokalizacji
    const position = await new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolokalizacja niedostępna'));
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 5000,
        maximumAge: 300000, // 5 minut cache
      });
    });

    const { latitude, longitude } = position.coords;

    // Użyj Open-Meteo API (darmowe, bez klucza)
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
    );

    if (!response.ok) {
      throw new Error('Błąd pobierania danych pogodowych');
    }

    const data = await response.json();
    return parseWeatherData(data);
  } catch (error) {
    console.warn('Nie udało się pobrać danych pogodowych:', error);
    return getSimulatedWeather();
  }
}

/**
 * Parsuje dane z Open-Meteo API
 */
function parseWeatherData(data) {
  const current = data.current;
  const weatherCode = current.weather_code;

  // Mapowanie kodów pogody Open-Meteo na nasze kategorie
  const weatherType = getWeatherTypeFromCode(weatherCode);
  const descriptions = getWeatherDescriptions();

  return {
    temperature: Math.round(current.temperature_2m),
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    description: descriptions[weatherType],
    icon: WEATHER_ICONS[weatherType],
    type: weatherType,
  };
}

/**
 * Mapuje kod pogody Open-Meteo na typ pogody
 */
function getWeatherTypeFromCode(code) {
  if (code === 0) return 'clear';
  if (code <= 3) return 'clouds';
  if (code >= 95) return 'thunderstorm';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 51 && code <= 67) return 'drizzle';
  if (code >= 45 && code <= 48) return 'fog';
  return 'clouds';
}

/**
 * Generuje symulowane dane pogodowe (fallback)
 */
function getSimulatedWeather() {
  const types = ['clear', 'clouds', 'rain', 'drizzle'];
  const type = types[Math.floor(Math.random() * types.length)];

  const baseTemp = 15;
  const tempVariation = Math.random() * 20 - 10;
  const descriptions = getWeatherDescriptions();

  return {
    temperature: Math.round(baseTemp + tempVariation),
    humidity: Math.round(40 + Math.random() * 40),
    windSpeed: Math.round(Math.random() * 30),
    description: descriptions[type],
    icon: WEATHER_ICONS[type],
    type: type,
    simulated: true,
  };
}

/**
 * Renderuje widget pogody
 */
function renderWeatherWidget(data) {
  const displayElement = document.getElementById('weather-display');
  if (!displayElement) {
    return;
  }

  const translations = window.daremonState?.translations || {};
  const humidityLabel = translations.weatherHumidity || 'Humidity';
  const windLabel = translations.weatherWind || 'Wind';
  const simulatedLabel = translations.weatherSimulated || '⚠️ Simulated data';

  const html = `
    <div class="weather-content">
      <div class="weather-main">
        <div class="weather-temp-section">
          <div class="weather-icon-large">${data.icon}</div>
          <div class="weather-temp-value">${data.temperature}°C</div>
        </div>
        <div class="weather-description">${data.description}</div>
      </div>
      <div class="weather-details">
        <div class="weather-detail-item">
          <div class="weather-detail-icon">💧</div>
          <div class="weather-detail-label">${humidityLabel}</div>
          <div class="weather-detail-value">${data.humidity}%</div>
        </div>
        <div class="weather-detail-item">
          <div class="weather-detail-icon">💨</div>
          <div class="weather-detail-label">${windLabel}</div>
          <div class="weather-detail-value">${data.windSpeed} km/h</div>
        </div>
      </div>
      ${data.simulated ? `<div class="weather-simulated-label">${simulatedLabel}</div>` : ''}
    </div>
  `;

  displayElement.innerHTML = html;

  // Dodaj klasę dla animacji wejścia
  displayElement.classList.add('weather-loaded');

  // Ustaw tło w zależności od typu pogody
  displayElement.setAttribute('data-weather-type', data.type);
}

/**
 * Aktualizuje widget pogody
 */
async function updateWeatherWidget() {
  const displayElement = document.getElementById('weather-display');
  if (!displayElement) {
    return;
  }

  try {
    const weatherData = await fetchWeatherData();
    renderWeatherWidget(weatherData);
  } catch (error) {
    console.error('Błąd aktualizacji widgetu pogody:', error);
    displayElement.innerHTML = `
      <div class="weather-error">
        ⚠️ Nie udało się pobrać danych pogodowych
      </div>
    `;
  }
}

/**
 * Inicjalizuje widget pogody
 */
export function initWeatherWidget() {
  // Pierwsza aktualizacja
  updateWeatherWidget();

  // Aktualizuj co 10 minut
  const UPDATE_INTERVAL = 10 * 60 * 1000;
  setInterval(updateWeatherWidget, UPDATE_INTERVAL);
}

/**
 * Auto-start w kontekście przeglądarki
 */
const autoStart = () => {
  if (typeof document === 'undefined') {
    return;
  }

  const startWidget = () => {
    initWeatherWidget();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startWidget, { once: true });
  } else {
    startWidget();
  }
};

autoStart();

// Export dla testów
export const __test__ = {
  fetchWeatherData,
  parseWeatherData,
  getWeatherTypeFromCode,
  getSimulatedWeather,
  renderWeatherWidget,
};
