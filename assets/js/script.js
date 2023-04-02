// set up variables to target html elements
var formEl = document.querySelector("#search-form");
// var submitBtn = document.querySelector("#submitBtn");
var cityInput = document.querySelector("#city-input");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastEl = document.querySelector("#forecast");
var searchHistoryListEl = document.querySelector("#search-history");

// put this here so you dont need to copy and paste it in each time
var myApiKey = `c9f4436f54acb5291e5113e098327c64`;

// empty array to hold search history
var searchHistoryArr = [];

// event listener for the search form submit button
formEl.addEventListener("submit", (event) => {
  // remember to do this to prevent auto clearing and reload
  event.preventDefault();
  // what are we getting?
  // get the user input value
  var city = cityInput.value;
  //   console.log(city);

  // need to call the api now and enter the city to the query parameter
  // use fetch?
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myApiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      //   console.log(data);
      //   need current and future conditions:
      //   we need city name, date, icon, temperature, humidity and wind speed
      const currentWeather = {
        city: data.name,
        date: new Date(data.dt * 1000),
        icon: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      };

      //   show current weather data
      //   create a paragraph, or maybe make a card and asign innerText - for now <p>
      currentWeatherEl.innerHTML = `
      <h2>${
        currentWeather.city
      } (${currentWeather.date.toLocaleDateString()})<img src="${
        currentWeather.icon
      }" alt="${data.weather[0].description}"></h2>
      <p>Temperature: ${currentWeather.temperature} °F</p>
      <p>Humidity: ${currentWeather.humidity}%</p>
      <p>Wind Speed: ${currentWeather.windSpeed} MPH</p>
    `;

      // get the forecast data
      return fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${myApiKey}`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      // this needs some research here - get the five day
      var forecastData = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      const forecast = forecastData.map((item) => ({
        date: new Date(item.dt * 1000),
        icon: `https://openweathermap.org/img/w/${item.weather[0].icon}.png`,
        temperature: item.main.temp,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
      }));

      // display the forecast data
      //   forecastDiv.innerHTML = forecast.map(item => `
      //     <div>
      //       <h3>${item.date.toLocaleDateString()}</h3>
      //       <img src="${item.icon}" alt="${data.weather[0].description}">
      //       <p>Temperature: ${item.temperature}
    });
});
