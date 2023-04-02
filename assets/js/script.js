// set up variables to target html elements
var formEl = $("#search-form");
var cityInput = $("#city-input");
var currentWeatherEl = $("#current-weather");
var forecastEl = $("#forecast");
var searchHistoryListEl = $("#search-history");

// put this here so you dont need to copy and paste it in each time
var myApiKey = "c9f4436f54acb5291e5113e098327c64";

// empty array to hold search history
var searchHistoryArr = [];

// event listener for the search form submit button
formEl.on("submit", (event) => {
  // remember to do this to prevent auto clearing and reload
  event.preventDefault();
  // what are we getting?
  // get the user input value
  var city = cityInput.value;

  // need to call the api now and enter the city to the query parameter
  // use fetch?
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myApiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var currentWeather = {};
      
    });
});
