// Weather Widget for DAREMON Radio
// Uses Open-Meteo API (free, no API key required)

const weatherWidget = {
    //默认位置: Eindhoven, Netherlands
    defaultLat: 51.4416,
    defaultLon: 5.4697,

    // Weather code to emoji mapping
    weatherCodes: {
        0: { icon: '☀️', desc: 'Bezchmurnie' },
        1: { icon: '🌤️', desc: 'Prawie bezchmurnie' },
        2: { icon: '⛅', desc: 'Częściowo pochmurnie' },
        3: { icon: '☁️', desc: 'Pochmurnie' },
        45: { icon: '🌫️', desc: 'Mgła' },
        48: { icon: '🌫️', desc: 'Szadź' },
        51: { icon: '🌦️', desc: 'Lekka mżawka' },
        53: { icon: '🌦️', desc: 'Mżawka' },
        55: { icon: '🌧️', desc: 'Intensywna mżawka' },
        61: { icon: '🌧️', desc: 'Lekki deszcz' },
        63: { icon: '🌧️', desc: 'Deszcz' },
        65: { icon: '🌧️', desc: 'Intensywny deszcz' },
        71: { icon: '🌨️', desc: 'Lekki śnieg' },
        73: { icon: '🌨️', desc: 'Śnieg' },
        75: { icon: '❄️', desc: 'Intensywny śnieg' },
        77: { icon: '🌨️', desc: 'Śnieg ziarnisty' },
        80: { icon: '🌦️', desc: 'Przelotne opady' },
        81: { icon: '🌧️', desc: 'Przelotne opady' },
        82: { icon: '⛈️', desc: 'Gwałtowne opady' },
        85: { icon: '🌨️', desc: 'Przelotny śnieg' },
        86: { icon: '❄️', desc: 'Intensywny przelotny śnieg' },
        95: { icon: '⛈️', desc: 'Burza' },
        96: { icon: '⛈️', desc: 'Burza z gradem' },
        99: { icon: '⛈️', desc: 'Burza z intensywnym gradem' }
    },

    async init() {
        try {
            // Try to get user's location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.fetchWeather(position.coords.latitude, position.coords.longitude);
                    },
                    (error) => {
                        console.log('Geolocation error, using default location:', error);
                        this.fetchWeather(this.defaultLat, this.defaultLon);
                    }
                );
            } else {
                // Use default location if geolocation not available
                this.fetchWeather(this.defaultLat, this.defaultLon);
            }

            // Update weather every 10 minutes
            setInterval(() => {
                this.fetchWeather(this.defaultLat, this.defaultLon);
            }, 600000);

        } catch (error) {
            console.error('Weather widget initialization error:', error);
            this.showError();
        }
    },

    async fetchWeather(lat, lon) {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl&timezone=Europe%2FBerlin`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.updateUI(data);

        } catch (error) {
            console.error('Error fetching weather:', error);
            this.showError();
        }
    },

    updateUI(data) {
        const current = data.current;

        // Temperature
        const temp = Math.round(current.temperature_2m);
        document.getElementById('weather-temp').textContent = `${temp}°C`;

        // Weather code to icon and description
        const weatherCode = current.weather_code;
        const weather = this.weatherCodes[weatherCode] || { icon: '🌤️', desc: 'Nieznane' };
        document.getElementById('weather-icon').textContent = weather.icon;
        document.getElementById('weather-desc').textContent = weather.desc;

        // Humidity
        document.getElementById('weather-humidity').textContent = `${Math.round(current.relative_humidity_2m)}%`;

        // Wind speed (convert m/s to km/h)
        const windKmh = Math.round(current.wind_speed_10m * 3.6);
        document.getElementById('weather-wind').textContent = `${windKmh} km/h`;

        // Pressure
        document.getElementById('weather-pressure').textContent = `${Math.round(current.pressure_msl)} hPa`;

        // Feels like temperature
        const feelsLike = Math.round(current.apparent_temperature);
        document.getElementById('weather-feels-like').textContent = `${feelsLike}°C`;

        // Add animation
        this.animateWidget();
    },

    animateWidget() {
        const widget = document.getElementById('weather-widget');
        widget.style.animation = 'none';
        setTimeout(() => {
            widget.style.animation = 'fadeIn 0.5s ease';
        }, 10);
    },

    showError() {
        document.getElementById('weather-temp').textContent = '--°C';
        document.getElementById('weather-desc').textContent = 'Błąd pobierania danych';
        document.getElementById('weather-icon').textContent = '⚠️';
    }
};

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize weather widget when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => weatherWidget.init());
} else {
    weatherWidget.init();
}

// Export for use in other modules
export default weatherWidget;
