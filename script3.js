const API_KEY = "ee6426d765574a768a1130626232610";
const searchInput = document.getElementById("search");
const temp = document.querySelector(".main-info h1");
const loc = document.getElementById("location");
const rain = document.getElementById("rain");
const img = document.querySelector(".main-info img");
const detailedInfoItems = Array.from(document.querySelectorAll(".weather-info-container li"));

const fetchCurrentWeather = async (city) => {
  try {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

const displayData = (data) => {
  const current = data.current;

  loc.textContent = data.location.name;
  temp.textContent = current.temp_c + " °C";
  rain.textContent = current.precip_mm + " %";
  img.src = current.condition.icon;

  detailedInfoItems.forEach((item) => {
    const title = item.querySelector("strong");
    const value = item.querySelector("span");

    switch (title.textContent) {
      case "UV INDEX:":
        value.textContent = current.uv;
        break;
      case "HUMIDITY:":
        value.textContent = current.humidity + " %";
        break;
      case "WIND:":
        value.textContent = current.wind_kph + " km";
        break;
      case "FEELS LIKE:":
        value.textContent = current.feelslike_c + " °";
        break;
      case "VISIBILITY:":
        value.textContent = current.vis_km + " km";
        break;
      case "PRESSURE:":
        value.textContent = current.pressure_mb + " mbar";
        break;
      case "CHANCE OF RAIN:":
        value.textContent = current.precip_mm + " %";
        break;
      case "CLOUD:":
        value.textContent = current.cloud + " Lvl";
        break;
      default:
        break;
    }
  });
};

const fetchAndDisplayWeather = async (city) => {
  const data = await fetchCurrentWeather(city);
  if (data) {
    displayData(data);
  }
};

const handleSearch = (e) => {
  if (e.key === "Enter" && searchInput.value.trim().length > 0) {
    fetchAndDisplayWeather(searchInput.value.trim());
    searchInput.value = "";
  }
};

searchInput.addEventListener("keydown", handleSearch);

// Check if the browser supports geolocation
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const city = `${latitude} ${longitude}`;
    fetchAndDisplayWeather(city);
  });
} else {
  console.log('Geolocation is not supported in this browser.');
}
