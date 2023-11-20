class WeatherApp {
  constructor() {
    this.API_KEY = "ee6426d765574a768a1130626232610";
    this.searchInput = document.getElementById("search");
    this.temp = document.querySelector(".main-info h1");
    this.loc = document.getElementById("location");
    this.rain = document.getElementById("rain");
    this.img = document.querySelector(".main-info img");
    this.detailedInfoItems = Array.from(
      document.querySelectorAll(".weather-info-container li")
    );

    this.setupEventListeners();
    this.fetchCurrentWeatherByGeolocation();
  }

  async fetchCurrentWeather(city) {
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${this.API_KEY}&q=${city}&days=1&aqi=no&alerts=no`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }

  displayData(data) {
    const current = data.current;

    this.loc.textContent = data.location.name;
    this.temp.textContent = current.temp_c + " °C";
    this.rain.textContent = current.precip_mm + " %";
    this.img.src = current.condition.icon;

    this.detailedInfoItems.forEach((item) => {
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

    const sunrise = document.getElementById("sunrise");
    const sunset = document.getElementById("sunset");
    const moonrise = document.getElementById("moonrise");
    const moonPhase = document.getElementById("moonPhase");
    console.log(data.forecast.forecastday[0].astro.moon_phase);
    console.log(data.forecast.forecastday[0].hour);
    const astro = data.forecast.forecastday[0].astro;
    sunrise.innerText = astro.sunrise;
    sunset.innerText = astro.sunset;
    moonrise.innerText = astro.moonrise;
    moonPhase.innerText = astro.moon_phase;

    const forecaseContainer = document.querySelector(".forecast-container");

    data.forecast.forecastday[0].hour.forEach((item) => {
      // Given timestamp
      var timestamp = item.time_epoch;

      // Create a new Date object and convert the timestamp to milliseconds
      var date = new Date(timestamp * 1000);

      // Extract individual components (hours, minutes, seconds)
      var hours = date.getUTCHours();
      var minutes = date.getUTCMinutes();
      var seconds = date.getUTCSeconds();

      // Format the time as HH:mm:ss
      var formattedTime =
        hours.toString().padStart(2, "0") +
        ":" +
        minutes.toString().padStart(2, "0");
      const div = document.createElement("div");
      div.classList = "hourly-forecast";
      div.innerHTML = `<div class="time">${formattedTime}</div> <img src=${item.condition.icon} alt="Weather Icon">
  <div class="weather-details">
      <div class="temperature">${item.temp_c}°C</div>
      <div class="condition">${item.condition.text}</div>
      <div class="other-details">Wind: ${item.wind_kph} km/h</div>
  </div>`;

      forecaseContainer.appendChild(div);
    });
  }

  setupEventListeners() {
    this.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && this.searchInput.value.trim().length > 0) {
        this.fetchAndDisplayWeather(this.searchInput.value.trim());
        this.searchInput.value = "";
      }
    });

    // Add an event listener for a button or other element that triggers a search
    // Example: document.getElementById("searchButton").addEventListener("click", () => this.handleClick());
  }

  async fetchAndDisplayWeather(city) {
    const data = await this.fetchCurrentWeather(city);
    if (data) {
      this.displayData(data);
    }
  }

  async fetchCurrentWeatherByGeolocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const city = `${latitude} ${longitude}`;
        const data = await this.fetchCurrentWeather(city);
        if (data) {
          this.displayData(data);
        }
      });
    } else {
      console.log("Geolocation is not supported in this browser.");
    }
  }
}

const weatherApp = new WeatherApp();
