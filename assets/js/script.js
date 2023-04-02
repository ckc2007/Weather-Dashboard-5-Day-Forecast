// set up variables to target html elements
var formEl = $("#search-form");
var cityInput = $("#city-input");
var currentWeatherEl = $("#current-weather");
var forecastEl = $("#forecast");
var searchHistoryListEl = $("#search-history");

// put this here so you dont need to copy and paste it in each time
var myApiKey = `c9f4436f54acb5291e5113e098327c64`;

// empty array to hold search history
var searchHistoryArr = [];

// event listener for the search form submit button
formEl.on("submit", (event) => {
  // remember to do this to prevent auto clearing and reload
  event.preventDefault();
  // what are we getting?
  // get the user input value
  var city = cityInput.value;
  console.log(city);

  // need to call the api now and enter the city to the query parameter
  // use fetch?
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myApiKey}`
  )
    .then(function (response) {
      // use an arrow function here maybe? looks ugly like this...
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      //   need current and future conditions:
      //   we need city name, date, icon, temperature, humidity and wind speed
      var currentWeather = {
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
    <h3>${
      currentWeather.city
    } ${currentWeather.date.toLocaleDateString()} <img src="${
        currentWeather.icon
      }"></h2>
    <p>Temperature: ${currentWeather.temperature} degrees Farenheit</p>
    <p>Humidity: ${currentWeather.humidity}%</p>
    <p>Wind Speed: ${currentWeather.windSpeed} MPH</p>`;
    });
});
