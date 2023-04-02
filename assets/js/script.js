// set up variables to target html elements
var form = $("#search-form");
var cityInput = $("#city-input");
var currentWeatherEl = $("#current-weather");
var forecastEl = $("#forecast");
var searchHistoryListEl = $("#search-history");

// empty array to hold search history
var searchHistoryArr = [];

// event listener for the search form submit button
form.on("submit", (event)=>{
    // remember to do this to prevent auto clearing and reload
    event.preventDefault();
})