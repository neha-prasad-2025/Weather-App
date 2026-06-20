const loc = document.querySelector("#location");
const date = document.querySelector("#date");
const hrs = document.querySelector("#hrs");
const mins = document.querySelector("#mins");
const amPm = document.querySelector("#am-pm");
const temperature = document.querySelector(".temperature");
const tempText = document.querySelector("#temp-text");
const searchBtn = document.querySelector(".search-button");
const input = document.querySelector("input");
const feelsLikeText = document.querySelector("#feels-like-text");
const humidityText = document.querySelector("#humidity-text");
const windspeedText = document.querySelector("#windspeed-text");
const airqualityText = document.querySelector("#airquality-text");
const img = document.querySelector("img");
let dayArr = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthArr = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function updateClock() {
  const dateNow = new Date();
  let day = dateNow.getDay();

  day = dayArr[day];

  let todayDate = dateNow.getDate();
  let month = dateNow.getMonth();
  month = monthArr[month];

  let year = dateNow.getFullYear();
  date.innerText = `${day}, ${todayDate} ${month} ${year}`;
  let hours = dateNow.getHours();
  if (hours > 12) {
    hours = hours - 12;
  } else if (hours === 0) {
    hours = 12;
  }
  hrs.innerHTML = hours < 10 ? `&nbsp| 0${hours}:` : `&nbsp| ${hours}:`;

  mins.innerText =
    dateNow.getMinutes() < 10
      ? "0" + dateNow.getMinutes()
      : dateNow.getMinutes();

  if (dateNow.getHours() >= 12) {
    amPm.innerHTML = "&nbsp PM";
  } else {
    amPm.innerHTML = "&nbsp AM";
  }
}
updateClock();
setInterval(updateClock, 1000);

// weather api

async function getApi(cityName) {
  try {
    const apiKey = "ae0bbeb59dfb429db8194522261806";
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}&aqi=yes`;
    const response = await fetch(url);
    if (!response.ok) {
      alert("City cannot be found!");
      throw new Error("City not found.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`Error:${error.message}`);
    return null;
  }
}
async function getWeather() {
  let data = await getApi("New Delhi");
  changeUi(data);
}
searchBtn.addEventListener("click", async () => {
  let data = await getApi(input.value);
  changeUi(data);
});

function changeUi(data) {
  loc.innerText = `${data.location.name}, ${data.location.country}`;
  temperature.innerText = `${Math.round(data.current.temp_c)}`;
  tempText.innerText = data.current.condition.text;
  feelsLikeText.innerText = `${Math.round(data.current.feelslike_c)}°C`;
  humidityText.innerText = `${data.current.humidity}%`;
  windspeedText.innerText = `${Math.round(data.current.wind_kph)} km/h`;
  const code = data.current.condition.code;

  if (code === 1000) {
    img.src = "assets/clear.png";
  } else if (code === 1003 || code === 1006 || code === 1009) {
    img.src = "assets/cloud.png";
  } else if (code === 1030 || code === 1135 || code === 1147) {
    img.src = "assets/mist.png";
  } else if (
    code === 1063 ||
    code === 1150 ||
    code === 1153 ||
    code === 1180 ||
    code === 1183 ||
    code === 1186 ||
    code === 1189 ||
    code === 1192 ||
    code === 1195 ||
    code === 1240 ||
    code === 1243 ||
    code === 1246 ||
    code === 1273 ||
    code === 1276
  ) {
    img.src = "assets/rain.png";
  } else {
    img.src = "assets/snow.png";
  }
  let quality = data.current.air_quality["us-epa-index"];
  switch (quality) {
    case 1:
      airqualityText.innerText = "Good";
      break;
    case 2:
      airqualityText.innerText = "Moderate";
      break;
    case 3:
      airqualityText.innerText = "Unhealthy for Sensitive Groups";
      break;
    case 4:
      airqualityText.innerText = "Unhealthy";
      break;
    case 5:
      airqualityText.innerText = "Very Unhealthy";
      break;
    case 6:
      airqualityText.innerText = "Hazardous";
      break;
  }
}
getWeather();
