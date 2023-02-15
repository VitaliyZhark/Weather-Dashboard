// START GLOBAL VARIABLES //

var openWeatherApiKey = '26ba3a7e283acb9cd1e8665c6c3b319a';
var openWeatherCoordinatesUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='
var userFormEL = $('#city-search');
var col2El = $('.col2');
var cityInputEl = $('#city');
var fiveDayEl = $('#five-day');
var searchHistoryEl = $('#search-history');
var currentDay = moment().format('M/DD/YYYY');
const weatherIconUrl = 'http://openweathermap.org/img/wn/';
var searchHistoryArray = loadSearchHistory();
