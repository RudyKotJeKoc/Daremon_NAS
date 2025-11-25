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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
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
 * Tworzy HTML template dla widgetu pogody (tylko przy pierwszym renderze)
 */
function createWeatherTemplate() {
  return `
    <div class="weather-content">
      <div class="weather-main">
        <div class="weather-temp-section">
          <div class="weather-icon-large"></div>
          <div class="weather-temp-value"></div>
        </div>
        <div class="weather-description"></div>
      </div>
      <div class="weather-details">
        <div class="weather-detail-item">
          <div class="weather-detail-icon">💧</div>
          <div class="weather-detail-label"></div>
          <div class="weather-detail-value weather-humidity"></div>
        </div>
        <div class="weather-detail-item">
          <div class="weather-detail-icon">💨</div>
          <div class="weather-detail-label"></div>
          <div class="weather-detail-value weather-wind"></div>
        </div>
      </div>
      <div class="weather-simulated-label" style="display: none;"></div>
    </div>
  `;
}

/**
 * Renderuje widget pogody (zoptymalizowane - unika innerHTML)
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

  // Pierwszy render - użyj innerHTML
  if (!displayElement.dataset.initialized) {
    displayElement.innerHTML = createWeatherTemplate();
    displayElement.dataset.initialized = 'true';

    // Cache element references
    displayElement._weatherElements = {
      icon: displayElement.querySelector('.weather-icon-large'),
      temp: displayElement.querySelector('.weather-temp-value'),
      description: displayElement.querySelector('.weather-description'),
      humidityLabel: displayElement.querySelectorAll('.weather-detail-label')[0],
      windLabel: displayElement.querySelectorAll('.weather-detail-label')[1],
      humidity: displayElement.querySelector('.weather-humidity'),
      wind: displayElement.querySelector('.weather-wind'),
      simulatedLabel: displayElement.querySelector('.weather-simulated-label'),
    };
  }

  const els = displayElement._weatherElements;

  // Update tylko zawartości tekstowej - ZNACZNIE szybsze niż innerHTML
  if (els.icon) els.icon.textContent = data.icon;
  if (els.temp) els.temp.textContent = `${data.temperature}°C`;
  if (els.description) els.description.textContent = data.description;
  if (els.humidityLabel) els.humidityLabel.textContent = humidityLabel;
  if (els.windLabel) els.windLabel.textContent = windLabel;
  if (els.humidity) els.humidity.textContent = `${data.humidity}%`;
  if (els.wind) els.wind.textContent = `${data.windSpeed} km/h`;

  if (els.simulatedLabel) {
    els.simulatedLabel.textContent = simulatedLabel;
    els.simulatedLabel.style.display = data.simulated ? 'block' : 'none';
  }

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

// Weather update interval management
let weatherUpdateInterval = null;

/**
 * Rozpoczyna automatyczne aktualizacje pogody
 */
function startWeatherUpdates() {
  if (weatherUpdateInterval) {
    return; // Already running
  }

  const UPDATE_INTERVAL = 10 * 60 * 1000; // 10 minut

  // Pierwsza aktualizacja natychmiast
  updateWeatherWidget();

  // Kolejne co 10 minut, ale tylko jeśli tab jest widoczny
  weatherUpdateInterval = setInterval(() => {
    if (!document.hidden) {
      updateWeatherWidget();
    }
  }, UPDATE_INTERVAL);
}

/**
 * Zatrzymuje automatyczne aktualizacje pogody
 */
function stopWeatherUpdates() {
  if (weatherUpdateInterval) {
    clearInterval(weatherUpdateInterval);
    weatherUpdateInterval = null;
  }
}

/**
 * Inicjalizuje widget pogody
 */
export function initWeatherWidget() {
  startWeatherUpdates();
}

/**
 * Cleanup function
 */
export function cleanupWeatherWidget() {
  stopWeatherUpdates();
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

  // Page Visibility API - zatrzymaj updaty gdy tab ukryty
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopWeatherUpdates();
    } else {
      startWeatherUpdates();
    }
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    cleanupWeatherWidget();
  });
};

autoStart();

// Export dla testów
export const __test__ = {
  fetchWeatherData,
  parseWeatherData,
  getWeatherTypeFromCode,
  getSimulatedWeather,
  renderWeatherWidget,
  startWeatherUpdates,
  stopWeatherUpdates,
};
