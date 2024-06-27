document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'c6537f8d07c7df6968b04b8ad717041e'; // Replace with your OpenWeatherMap API key
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    
    const loadingIndicator = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const currentWeatherSection = document.getElementById('current-weather');
    const forecastSection = document.getElementById('forecast');
    const additionalInfoSection = document.getElementById('additional-info');
    
    const locationEl = document.getElementById('location');
    const temperatureEl = document.getElementById('temperature');
    const humidityEl = document.getElementById('humidity');
    const windSpeedEl = document.getElementById('wind-speed');
    const descriptionEl = document.getElementById('description');
    const weatherIconEl = document.getElementById('weather-icon');
    
    const forecastContainer = document.querySelector('.forecast-container');
    const sunriseEl = document.getElementById('sunrise');
    const sunsetEl = document.getElementById('sunset');
    const uvIndexEl = document.getElementById('uv-index');
    
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
        }
    });
    
    async function fetchWeatherData(city) {
        showLoading();
        try {
            const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
            if (!weatherResponse.ok) {
                throw new Error('City not found');
            }
            const weatherData = await weatherResponse.json();
            displayCurrentWeather(weatherData);
            
            const { lat, lon } = weatherData.coord;
            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
            const forecastData = await forecastResponse.json();
            displayForecast(forecastData);
            
            const uvResponse = await fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`);
            const uvData = await uvResponse.json();
            displayAdditionalInfo(weatherData, uvData);
            
            hideLoading();
        } catch (error) {
            console.error('Error fetching weather data:', error);
            showError();
        }
    }
    
    function showLoading() {
        loadingIndicator.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        currentWeatherSection.classList.add('hidden');
        forecastSection.classList.add('hidden');
        additionalInfoSection.classList.add('hidden');
    }
    
    function hideLoading() {
        loadingIndicator.classList.add('hidden');
    }
    
    function showError() {
        loadingIndicator.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }
    
    function displayCurrentWeather(data) {
        locationEl.textContent = `Location: ${data.name}, ${data.sys.country}`;
        temperatureEl.textContent = `Temperature: ${data.main.temp}°C`;
        humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
        windSpeedEl.textContent = `Wind Speed: ${data.wind.speed} m/s`;
        descriptionEl.textContent = `Condition: ${data.weather[0].description}`;
        
        const weatherIcon = data.weather[0].icon;
        weatherIconEl.src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
        
        currentWeatherSection.classList.remove('hidden');
    }
    
    function displayForecast(data) {
        forecastContainer.innerHTML = '';
        for (let i = 0; i < data.list.length; i += 8) { // 8 intervals per day
            const forecast = data.list[i];
            const forecastDiv = document.createElement('div');
            const weatherIcon = forecast.weather[0].icon;
            forecastDiv.innerHTML = `
                <h3>${new Date(forecast.dt_txt).toLocaleDateString()}</h3>
                <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="Weather Icon">
                <p>Temp: ${forecast.main.temp}°C</p>
                <p>Condition: ${forecast.weather[0].description}</p>
            `;
            forecastContainer.appendChild(forecastDiv);
        }
        forecastSection.classList.remove('hidden');
    }
    
    function displayAdditionalInfo(weatherData, uvData) {
        const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
        
        sunriseEl.textContent = `Sunrise: ${sunrise}`;
        sunsetEl.textContent = `Sunset: ${sunset}`;
        uvIndexEl.textContent = `UV Index: ${uvData.value}`;
        
        additionalInfoSection.classList.remove('hidden');
    }
});

