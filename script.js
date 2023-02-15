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

// END GLOBAL VARIABLES //

// Define function to capitalize the first letter of a string
function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

//load cities from local storage and recreate history buttons
function loadSearchHistory() {
    var searchHistoryArray = JSON.parse(localStorage.getItem('search history'));

    // if nothing in localStorage, create a new object to track all user info
    if (!searchHistoryArray) {
        searchHistoryArray = {
            searchedCity: [],
        };
    } else {
        //add search history buttons to page
        for (var i = 0; i < searchHistoryArray.searchedCity.length; i++) {
            searchHistory(searchHistoryArray.searchedCity[i]);
        }
    }

    return searchHistoryArray;
}

//save to local storage
function saveSearchHistory() {
    localStorage.setItem('search history', JSON.stringify(searchHistoryArray));
};

//funciton to create history buttons
function searchHistory(city) {
    var searchHistoryBtn = $('<button>')
        .addClass('btn')
        .text(city)
        .on('click', function () {
            $('#current-weather').remove();
            $('#five-day').empty();
            $('#five-day-header').remove();
            getWeather(city);
        })
        .attr({
            type: 'button'
        });

    // append btn to search history div
    searchHistoryEl.append(searchHistoryBtn);
}

//function to get weather data from apiUrl
function getWeather(city) {
    // apiUrl for coordinates
    var apiCoordinatesUrl = openWeatherCoordinatesUrl + city + '&appid=' + openWeatherApiKey;
    // fetch the coordinates for parameter city
    fetch(apiCoordinatesUrl)
        .then(function (coordinateResponse) {
            if (coordinateResponse.ok) {
                coordinateResponse.json().then(function (data) {
                    var cityLatitude = data.coord.lat;
                    var cityLongitude = data.coord.lon;
                    // fetch weather information
                    var apiOneCallUrl = oneCallUrl + cityLatitude + '&lon=' + cityLongitude + '&appid=' + openWeatherApiKey + '&units=imperial';

                    fetch(apiOneCallUrl)
                        .then(function (weatherResponse) {
                            if (weatherResponse.ok) {
                                weatherResponse.json().then(function (weatherData) {


                                     // ** START CURRENT DAY DISPLAY ** //

                                    //add div to hold current day details
                                    var currentWeatherEl = $('<div>')
                                        .attr({
                                            id: 'current-weather'
                                        })

                                    // get the weather icon from city
                                    var weatherIcon = weatherData.current.weather[0].icon;
                                    var cityCurrentWeatherIcon = weatherIconUrl + weatherIcon + '.png';

                                    // create h2 to display city + current day + current weather icon
                                    var currentWeatherHeadingEl = $('<h2>')
                                        .text(city + ' (' + currentDay + ')');
                                    // create img element to display icon
                                    var iconImgEl = $('<img>')
                                        .attr({
                                            id: 'current-weather-icon',
                                            src: cityCurrentWeatherIcon,
                                            alt: 'Weather Icon'
                                        })

                                         //create list of current weather details
                                    var currWeatherListEl = $('<ul>')

                                    var currWeatherDetails = ['Temp: ' + weatherData.current.temp + ' °F', 'Wind: ' + weatherData.current.wind_speed + ' MPH', 'Humidity: ' + weatherData.current.humidity + '%', 'UV Index: ' + weatherData.current.uvi]

                                    for (var i = 0; i < currWeatherDetails.length; i++) {
                                        //create an indiviual list item and append to ul

                                        // run conditional to assign background color to UV index depending how high it is
                                        if (currWeatherDetails[i] === 'UV Index: ' + weatherData.current.uvi) {

                                            var currWeatherListItem = $('<li>')
                                                .text('UV Index: ')

                                            currWeatherListEl.append(currWeatherListItem);

                                            var uviItem = $('<span>')
                                                .text(weatherData.current.uvi);

                                            if (uviItem.text() <= 2) {
                                                uviItem.addClass('favorable');
                                            } else if (uviItem.text() > 2 && uviItem.text() <= 7) {
                                                uviItem.addClass('moderate');
                                            } else {
                                                uviItem.addClass('severe');
                                            }

                                            currWeatherListItem.append(uviItem);

                                            //create every list item that isn't uvIndex
                                        } else {
                                            var currWeatherListItem = $('<li>')
                                                .text(currWeatherDetails[i])
                                            //append to ul
                                            currWeatherListEl.append(currWeatherListItem);
                                        }

                                    }

                                    //append curr weather div to col2 before #five-day
                                    $('#five-day').before(currentWeatherEl);
                                    //append current weather heading to current weather div
                                    currentWeatherEl.append(currentWeatherHeadingEl);
                                    //append icon to current weather header
                                    currentWeatherHeadingEl.append(iconImgEl);
                                    //append ul to current weather
                                    currentWeatherEl.append(currWeatherListEl);


                                    // ** END CURRENT DAY DISPLAY ** //

                                    // ** START 5-DAY FORECAST DISPLAY ** //

                                    //create h2 header for 5-day forecast
                                    var fiveDayHeaderEl = $('<h2>')
                                        .text('5-Day Forecast:')
                                        .attr({
                                            id: 'five-day-header'
                                        })

                                    //append 5 day forecast header to col2 after current weather div
                                    $('#current-weather').after(fiveDayHeaderEl)

                                    // create array for the dates for the next 5 days

                                    var fiveDayArray = [];

                                    for (var i = 0; i < 5; i++) {
                                        let forecastDate = moment().add(i + 1, 'days').format('M/DD/YYYY');

                                        fiveDayArray.push(forecastDate);
                                    }

                                    // for each date in the array create a card displaying temp, wind and humidity
                                    for (var i = 0; i < fiveDayArray.length; i++) {
                                        // create a div for each card
                                        var cardDivEl = $('<div>')
                                            .addClass('col3');

                                        // create div for the card body
                                        var cardBodyDivEl = $('<div>')
                                            .addClass('card-body');

                                        // create the card-title
                                        var cardTitleEl = $('<h3>')
                                            .addClass('card-title')
                                            .text(fiveDayArray[i]);

                                            