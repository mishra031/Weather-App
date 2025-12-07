const API_KEY = "3045dd712ffe6e702e3245525ac7fa38";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const weatherIconMap = {
  "01d": "☀️", "01n": "🌙",
  "02d": "⛅", "02n": "☁️",
  "03d": "☁️", "03n": "☁️",
  "04d": "☁️", "04n": "☁️",
  "09d": "🌧️", "09n": "🌧️",
  "10d": "🌦️", "10n": "🌧️",
  "11d": "⛈️", "11n": "⛈️",
  "13d": "❄️", "13n": "❄️",
  "50d": "🌫️", "50n": "🌫️"
};

// Fetch Weather API
async function fetchWeather(city) {
  const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("City not found");
  }

  return await response.json();
}

// Render UI
function displayWeather(data) {
  const date = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

  document.getElementById("locationName").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("weatherDate").textContent = date.toLocaleDateString("en-US", options);
  document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById("weatherIcon").textContent = weatherIconMap[data.weather[0].icon];
  document.getElementById("weatherDescription").textContent = data.weather[0].description;

  document.getElementById("feelsLike").textContent = `${data.main.feels_like}°C`;
  document.getElementById("humidity").textContent = `${data.main.humidity}%`;
  document.getElementById("windSpeed").textContent = `${data.wind.speed} m/s`;
  document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;

  document.getElementById("weatherCard").classList.add("visible");
  document.getElementById("errorMessage").classList.remove("visible");
}

// Error UI
function showError() {
  document.getElementById("weatherCard").classList.remove("visible");
  document.getElementById("errorMessage").classList.add("visible");
}

// Loader
function showLoading(isLoading) {
  const spinner = document.getElementById("loadingSpinner");
  const button = document.getElementById("searchButton");

  if (isLoading) {
    spinner.classList.add("visible");
    button.disabled = true;
  } else {
    spinner.classList.remove("visible");
    button.disabled = false;
  }
}

// Form handler
document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;

  showLoading(true);

  try {
    const data = await fetchWeather(city);
    displayWeather(data);
  } catch (err) {
    showError();
  } finally {
    showLoading(false);
  }
});
