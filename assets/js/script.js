// set up variables to target html elements
// i would like to use jquery here...but something wasn't working - debug
var formEl = document.querySelector("#search-form");
// var submitBtn = document.querySelector("#submitBtn");
var cityInput = document.querySelector("#city-input");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastEl = document.querySelector("#forecast");
var searchHistoryListEl = document.querySelector("#search-history");
var savedCityBtn = document.querySelector(".btn");

// put this here so you dont need to copy and paste it in each time
var myApiKey = `c9f4436f54acb5291e5113e098327c64`;

// empty array to hold search history
var searchHistoryArr = [];
// add arr to local storage
localStorage.setItem("search-history", JSON.stringify(searchHistoryArr));
// retrieve from local storage - check not empty
if (localStorage.getItem("search-history") !== null) {
  searchHistoryArr = JSON.parse(localStorage.getItem("search-history"));
  searchHistoryListEl.innerHTML = "";
  renderSavedSearch();
}

// event listener for the search form submit button
formEl.addEventListener("submit", (event) => {
  // remember to do this to prevent auto clearing and reload
  event.preventDefault();
  //   use asynchronous
  currentWeatherEl.innerHTML = "";
  forecastEl.innerHTML = "";
  // what are we getting?
  // get the user input value
  var city = cityInput.value;
  console.log(city);
  searchHistoryArr.push(city);

  //   add city to the saved search list
  function renderSavedSearch() {
    searchHistoryListEl.innerHTML = "";
    for (var i = 0; i < searchHistoryArr.length; i++) {
      //   var search = searchHistoryArr[i];
      var buttonEl = document.createElement("button");
      buttonEl.setAttribute("id", `${searchHistoryArr[i]}`);
      buttonEl.classList.add("btn");
      buttonEl.textContent = searchHistoryArr[i].toString();
      searchHistoryListEl.appendChild(buttonEl);
    }
  }
  renderSavedSearch();

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
        // date comes in like this: 1680477816 --- seconds multiply by 1000 to get miliseconds format
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
        temperature: ((data.main.temp - 273.15) * (9 / 5) + 32).toFixed(2),
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
        // use the description as the alt << see above
      }" alt="${data.weather[0].description}"></h3>
      <p>Temperature: ${currentWeather.temperature} °F</p>
      <p>Humidity: ${currentWeather.humidity}%</p>
      <p>Wind Speed: ${currentWeather.windSpeed} MPH</p>
      <p>Description: ${currentWeather.description}</p>
    `;

      // get the forecast data >>> research forecaset api docs here - having trouble finding the right keys
      return fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${myApiKey}`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // this needs some research here - get the five day
      //   the list key of the forecast object gives you the days out..you need the
      // correct time (every 24 hours - the api gives you increments of 3 hours...)
      // this is getting complex - so heres whats going on - filtering the list of forecast objects based on a 24 hour interval, then creating a new array with the data that we want and are going to use here, then slicing that array and grabbing only the first five items...5x day-objects ...
      //   note: we could implement a 5, 7, 10 day forecast option button and target the slice below - but we will do that later..
      var forecastData = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      const forecast = forecastData
        .map((item) => ({
          date: new Date(item.dt * 1000),
          icon: `https://openweathermap.org/img/w/${item.weather[0].icon}.png`,
          temperature: ((item.main.temp - 273.15) * (9 / 5) + 32).toFixed(2),
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          //   forgot to put this in...
          description: item.weather[0].description,
        }))
        .slice(0, 5);
      console.log(forecast);
      //   ok good we are getting the list of 5 days objects

      // display the forecast data
      for (let i = 0; i < forecast.length; i++) {
        console.log(forecast[i]);
        var forecastChildEl = document.createElement("div");
        forecastChildEl.classList.add("card");
        forecastChildEl.innerHTML = `
          <h3>${forecast[i].date.toLocaleDateString()}
          <img src="${forecast[i].icon}" alt="${forecast[i].description}"></h3>
          <p>Temperature: ${forecast[i].temperature} °F</p>
          <p>Humidity: ${forecast[i].humidity}%</p>
          <p>Wind Speed: ${forecast[i].windSpeed} MPH</p>
          <p>Description: ${forecast[i].description}</p>
          `;
        forecastEl.appendChild(forecastChildEl);
      }
    });
});

//   set up event listener for each city button
function displaySaved() {
  searchHistoryListEl.addEventListener("click", function (event) {
    var element = event.target;
    if (element.matches(".btn")) {
      currentWeatherEl.innerHTML = "";
      forecastEl.innerHTML = "";
      // find the local storage object that matches the name/id of the btn and return the display based on its data
    }
  });
}
