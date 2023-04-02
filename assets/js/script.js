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
  console.log(city);

  // need to call the api now and enter the city to the query parameter
  // use fetch?
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myApiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      //   need current and future conditions:
      //   we need city name, date, icon, temperature, humidity and wind speed
      const currentWeather = {
        //   find under the name property of data object returned from weather
        city: data.name,
        // date comes in like this: 1680477816
        // according to api docs, this is: Time of data forecasted, unix, UTC
        // lol returns 1970...
        // The UNIX timestamp is defined as the number of seconds since January 1, 1970 UTC. In JavaScript, in order to get the current timestamp, you can use Date. now() . It's important to note that Date.
        // new Date()
        // When called as a constructor, returns a new Date object.
        date: new Date(data.dt * 1000),
        // list.weather.icon Weather icon id
        icon: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
        // need to adjust the unity here:
        // forecast.temperature.unit Unit of measurements. Possible value is Celsius, Kelvin, Fahrenheit.
        // kelvin to farenheit conversion - also limit decimals
        temperature: (((data.main.temp) - 273.15) * (9/5) + 32).toFixed(2),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        // i like the description data - lets include that too
        description: data.weather[0].description,
      };

      //   show current weather data
      //   create a paragraph, or maybe make a card and asign innerText - for now <p>
      currentWeatherEl.innerHTML = `
      <h3>${
        currentWeather.city
      } (${currentWeather.date.toLocaleDateString()})<img src="${
        currentWeather.icon
      }" alt="${data.weather[0].description}"></h3>
      <p>Temperature: ${currentWeather.temperature} °F</p>
      <p>Humidity: ${currentWeather.humidity}%</p>
      <p>Wind Speed: ${currentWeather.windSpeed} MPH</p>
      <p>Description: ${currentWeather.description}</p>
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
