// set up variables to target html elements
var formEl = $("#search-form");
var cityInput = $("#city-input");
var currentWeatherEl = $("#current-weather");
var forecastEl = $("#forecast");
var searchHistoryListEl = $("#search-history");

// empty array to hold search history
var searchHistoryArr = [];

// event listener for the search form submit button
formEl.on("submit", (event)=>{
    // remember to do this to prevent auto clearing and reload
    event.preventDefault();
    // what are we getting?
    // get the user input value
    var city = cityInput.value;

    // need to call the api now and enter the city to the query parameter
    // use fetch?


})