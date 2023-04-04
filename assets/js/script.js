var formEl = document.querySelector("#search-form");
var cityInput = document.querySelector("#city-input");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastEl = document.querySelector("#forecast");
var searchHistoryListEl = document.querySelector("#search-history");
var savedCityBtn = document.querySelector(".btn");
var clearSearchBtn = document.querySelector("#clearBtn");
// empty array to hold search history
var searchHistoryArr = [];
// put this here so you dont need to copy and paste it in each time
var myApiKey = `c9f4436f54acb5291e5113e098327c64`;

// local storage
if (localStorage.getItem("search-history") !== null) {
  searchHistoryArr = JSON.parse(localStorage.getItem("search-history"));
  searchHistoryListEl.innerHTML = "";
  console.log(searchHistoryArr);
  renderSavedSearch();
}
// add arr to local storage
function saveLocal() {
  localStorage.setItem("search-history", JSON.stringify(searchHistoryArr));
}
//   add city to the saved search list
function renderSavedSearch() {
  searchHistoryListEl.innerHTML = "";
  console.log(searchHistoryArr);
  for (var i = 0; i < searchHistoryArr.length; i++) {
    var buttonEl = document.createElement("button");
    buttonEl.setAttribute("id", `${searchHistoryArr[i]}`);
    buttonEl.classList.add("btn");
    buttonEl.textContent = searchHistoryArr[i].toString();
    searchHistoryListEl.appendChild(buttonEl);
    var breakEl = document.createElement("br");
    searchHistoryListEl.appendChild(breakEl);
  }
  saveLocal();
}

renderSavedSearch();
// render the info based on a button click - id is city name:
$(document).on("click", ".btn", function () {
  var city = $(this).attr("id");
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myApiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      //   console.log(data);
      const currentWeather = {
        city: data.name,
        date: new Date(data.dt * 1000),
        icon: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
        temperature: ((data.main.temp - 273.15) * (9 / 5) + 32).toFixed(2),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
      };
      currentWeatherEl.innerHTML = "";
      currentWeatherEl.innerHTML = `
            <h3>${
              currentWeather.city
            } (${currentWeather.date.toLocaleDateString()})<img src="${
        currentWeather.icon
      }"></h3>
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
      forecastEl.innerHTML = "";
      // display the forecast data
      for (let i = 0; i < forecast.length; i++) {
        //   console.log(forecast[i]);
        var forecastChildEl = document.createElement("div");
        forecastChildEl.classList.add("card");
        forecastChildEl.innerHTML = `
              <h3>${forecast[i].date.toLocaleDateString()}
              <img src="${forecast[i].icon}"}"></h3>
              <p>Temperature: ${forecast[i].temperature} °F</p>
              <p>Humidity: ${forecast[i].humidity}%</p>
              <p>Wind Speed: ${forecast[i].windSpeed} MPH</p>
              <p>Description: ${forecast[i].description}</p>
              `;
        forecastEl.appendChild(forecastChildEl);
      }
    });
});
// end button listener

function findWeather() {
  formEl.addEventListener("submit", (event) => {
    // remember to do this to prevent auto clearing and reload
    event.preventDefault();
    //   use asynchronous
    currentWeatherEl.innerHTML = "";
    forecastEl.innerHTML = "";
    // get the user input value
    // I would probably move this inside the fetch so that if the city does not exist it will not create a button - but come back to this later
    var city = cityInput.value;
    // console.log(city);
    // need a tile case function here:
    function title(string) {
      return string
        .toLowerCase()
        .split(" ")
        .map(function (word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    }
    let cityProper = title(city);
    searchHistoryArr.push(cityProper);
    saveLocal();
    // debug here - do we need this here? - yes
    renderSavedSearch();
    // need to call the api now and enter the city to the query parameter
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
          // date comes in like this: 1680477816 --- seconds multiply by 1000 to get MILISECONDS format
          // according to api docs, this is: Time of data forecasted, unix, UTC
          // if not modified returns 1970
          // The UNIX timestamp is defined as the number of SECONDS since January 1, 1970 UTC. In JavaScript, in order to get the current timestamp, you can use Date. now() . It's important to note that Date.
          // new Date()
          // When called as a constructor, returns a new Date object.
          date: new Date(data.dt * 1000),
          // list.weather.icon Weather icon id
          icon: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
          // need to adjust the units here:
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
        // console.log(data);
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
        // console.log(forecast);
        //   ok good we are getting the list of 5 days objects

        // display the forecast data
        for (let i = 0; i < forecast.length; i++) {
          //   console.log(forecast[i]);
          var forecastChildEl = document.createElement("div");
          //   forecastChildEl.setAttribute("id", `${forecast[i].city}`);
          forecastChildEl.classList.add("card");
          forecastChildEl.innerHTML = `
          <h3>${forecast[i].date.toLocaleDateString()}
          <img src="${forecast[i].icon}"></h3>
          <p>Temperature: ${forecast[i].temperature} °F</p>
          <p>Humidity: ${forecast[i].humidity}%</p>
          <p>Wind Speed: ${forecast[i].windSpeed} MPH</p>
          <p>Description: ${forecast[i].description}</p>
          `;
          forecastEl.appendChild(forecastChildEl);
          //   console.log(forecastChildEl);
          //   console.log(forecastHistoryArr);
        }
      });
  });
  //   end submit button event listener
}
// end submit button function
findWeather();

clearSearchBtn.addEventListener("click", function () {
  localStorage.removeItem("search-history");
  searchHistoryListEl.innerHTML = "";
  searchHistoryArr = [];
});
