
const baseUrl = "//api.openweathermap.org/data/2.5/weather?";
const apiKey = "6884e265f61fb7ed0707eafd3c5d853c";

// elements for showing the error
const elError = $('#respError');
const elShowError = $('#showError');

// element that holds the GEO result
const elGeolocation = $('#currentLocationGeo');

const elLocationName = $('#locationName');
const elLocationInput = $('#locationInput');

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

    // get the current position
    getLocation();

   /**
    * Generate the actual result
    */
   $('#load').click(function () {
      
      // render the output in the output field
      $('#resp').html(resp);

   })


});

/**
 * Get weather via Location name
 * @param {string} location 
 */
function getWeatherByLocation(location) {
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
    const format = $('input[name=unitFormat]:checked', '#locationInput').val()

    $.getJSON(uri + "&units=" + format + "&appid=" + apiKey, function (data) {
        console.log(data);

        let locationName = data.name;

        // set the display and input
        elLocationInput.val(locationName);
        elLocationName.html(locationName);

        // hide the loader
        hideSpinner();
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