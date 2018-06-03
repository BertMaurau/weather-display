
const baseUrl = "//api.openweathermap.org/data/2.5/weather?";
const iconUrl = "//openweathermap.org/img/w/";
const apiKey = "6884e265f61fb7ed0707eafd3c5d853c";

const units = {imperial: "°F", metric: "°C"};

// elements for showing the error
const elError = $('#respError');
const elShowError = $('#showError');

const elShowResp = $('#resp');

// element that holds the GEO result
const elGeolocation = $('#currentLocationGeo');

const elLocationName = $('#locationName');
const elLocationInput = $('#locationInput');

const elRespHead = $('#respHead');
const elRespTemperature = $('#respTemperature');
const elRespHumidity = $('#respHumidity');
const elRespPressure = $('#respPressure');
const elRespWind = $('#respWind');
const elRespClouds = $('#respClouds');

// part for defining the overlay spinner
const opts = {
    lines: 13, // The number of lines to draw
    length: 11, // The length of each line
    width: 5, // The line thickness
    radius: 17, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    color: '#FFF', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
};
const target = document.createElement("div");
document.body.appendChild(target);
const spinner = new Spinner(opts).spin(target);

// holds the actual loading overlay
var overlay;

/**
 * Things to do on document ready
 */
$(function () {

    // hide the error output
    elShowError.hide();
    elShowResp.hide();

    // get the current position
    getLocation();

   /**
    * Generate the actual result
    */
   $('#load').click(function () {
      
    let location = elLocationInput.val();
    if(location){
        getWeatherByLocation(location);
    }
   })

});

/**
 * Get weather via Location name
 * @param {string} location 
 */
function getWeatherByLocation(location) {

    // show loading
    showSpinner("Loading weather");

    const uri = baseUrl + "q=" + location;

    // make the API call
    getWeather(uri);

}

/**
 * Request weather via GEO coordinates
 * @param {float} latitude 
 * @param {float} longitude 
 */
function getWeatherByGeoCoordinates(latitude, longitude) {

    // show loading
    showSpinner("Loading weather");

    const uri = baseUrl + "lat=" + latitude + "&lon=" + longitude;

    // make the API call
    getWeather(uri);

}

/**
 * Make the API call
 * @param {string} uri 
 */
function getWeather(uri) {

    // get the unit format
    const format = $('input[name=unitFormat]:checked', '#inputForm').val()

    $.getJSON(uri + "&units=" + format + "&appid=" + apiKey, function (data) {

        let locationName = data.name;

        // set the display and input
        elLocationInput.val(locationName);
        elLocationName.html(locationName);

        // overwrite coordinates
        elGeolocation.html("(<strong>Lat</strong> " + data.coord.lat + " <strong>Lng</strong> " + data.coord.lon + ")");

        elRespHead.html(data.main.temp + units[format] + " | " + data.weather[0].description + " | <img src='" + iconUrl + data.weather[0].icon + ".png'>");

        elRespTemperature.html(data.main.temp + units[format] + " (min. " + data.main.temp_min + units[format] + " | max. " + data.main.temp_max + units[format] +")");
        elRespHumidity.html(data.main.humidity + "%");
        elRespPressure.html(data.main.pressure + " hPa.");
        elRespClouds.html(data.clouds.all + "%");
        elRespWind.html("Speed " + data.wind.speed + ((data.wind.deg) ? " Degree " + data.wind.deg : ""));

        // hide the loader
        hideSpinner();

        elShowResp.show();
    });
    
}

/**
 * Get the current user's location
 */
function getLocation() {

    if (navigator.geolocation) {

        // show loading
        showSpinner("Getting location");

        navigator.geolocation.getCurrentPosition(onLocation, onError);
    } else {
        elError.html("Geolocation is not supported by this browser.");
        elShowError.show();

        // hide the loader
        hideSpinner();
    }
}

/**
 * Handle the success response
 * @param {any} position 
 */
function onLocation(position) {
    
    elGeolocation.html("(<strong>Lat</strong> " + position.coords.latitude + " <strong>Lng</strong> " + position.coords.longitude + ")");

    // hide the loader
    hideSpinner();
    
    // load the weather info
    getWeatherByGeoCoordinates(position.coords.latitude, position.coords.longitude);
    
}

/**
 * Handle the error response
 * @param {any} error 
 */
function onError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            elError.html("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            elError.html("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            elError.html("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            elError.html("An unknown error occurred.");
            break;
    }

    elShowError.show();

    // hide the loader
    hideSpinner();

}

/**
 * Show the spinner overlay
 * @param {string} text 
 */
function showSpinner(text) {
    overlay = iosOverlay({
        text: text,
        spinner: spinner
    });
}

/**
 * Hide the spinner overlay
 */
function hideSpinner() {
    overlay.hide();
}