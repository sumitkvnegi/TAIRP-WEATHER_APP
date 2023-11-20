const searchInput = document.getElementById("search");
const temp = document.querySelector(".main-info h1");
const loc = document.getElementById("location");
const rain = document.getElementById("rain");
const img = document.querySelector(".main-info img");
API_key = "ee6426d765574a768a1130626232610";

// Access the detailed info list items and store them in an array
const detailedInfoItems = Array.from(
  document.querySelectorAll(".weather-info-container li")
);

const CURRENT_WEATHER = async (city) => {
    const data = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_key}&q=${city}&aqi=no`);
    const json = await data.json();
  return json;
};

const displayData = (data) => {
    const current = data.current;
    
    loc.textContent = data.location.name;
    temp.textContent = current.temp_c+" °C";
    rain.textContent = current.precip_mm +" %";

    img.src = current.condition.icon;
    detailedInfoItems.forEach((item) => {
        const title = item.querySelector("strong");
        const value = item.querySelector("span");

      
        if (title.textContent === "UV INDEX:") {
          value.textContent = current.uv; 
        } else if (title.textContent === "HUMIDITY:") {
          value.textContent = current.humidity +" %"; 
        }else if (title.textContent === "WIND:") {
            value.textContent = current.wind_kph +" km"; 
          }else if (title.textContent === "FEELS LIKE:") {
            value.textContent = current.feelslike_c +" °"; 
          }else if (title.textContent === "VISIBILITY:") {
            value.textContent = current.vis_km +" km"; 
          }else if (title.textContent === "PRESSURE:") {
            value.textContent = current.pressure_mb +" mbar"; 
          }else if (title.textContent === "CHANCE OF RAIN:") {
            value.textContent = current.precip_mm +" %"; 
          }else if (title.textContent === "CLOUD:") {
            value.textContent = current.cloud +" Lvl"; 
          }
      });
}
let value = "";
searchInput.addEventListener("keydown", function(e){
    value = e.target.value;
    if(e.key=="Enter" && value.length>0){
        CURRENT_WEATHER(e.target.value).then((data)=>{
            displayData(data);
        });
        searchInput.value = "";
    }
});

function handleClick(){
    if(value.length>0){
        CURRENT_WEATHER(value).then((data)=>{
            displayData(data);
        });
        searchInput.value = "";
    }
}

  // Check if the browser supports geolocation
  if ('geolocation' in navigator) {
    // Get the user's current position
    navigator.geolocation.getCurrentPosition((position) => {
      CURRENT_WEATHER(`${position.coords.latitude +
        " " + position.coords.longitude}`).then((data)=>{
        displayData(data);
      });
    });
  } else {
    console.log('Geolocation is not supported in this browser.');
  }
  