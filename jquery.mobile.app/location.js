
gps_disabled_message = 'You have denied us access to your location. Please change your device settings to use this feature. If you need assistance please use the "Help" button in the menu.';
gps_missing_message = 'Your browser does not support geolocation services. Please Upgrade your browser to use this feature.';
//from https://github.com/gwilson/getAccurateCurrentPosition/blob/master/geo.js
//with modification
navigator.geolocation.getAccurateCurrentPosition = function (geolocationSuccess, geolocationError, options) {
    var lastCheckedPosition,
        locationEventCount = 0,
        watchID,
        timerID;

    options = options || {};

    var checkLocation = function (position) {
        lastCheckedPosition = position;
        locationEventCount = locationEventCount + 1;
        // We ignore the first event unless it's the only one received because some devices seem to send a cached
        // location even when maxaimumAge is set to zero
        if ((position.coords.accuracy <= options.desiredAccuracy) && (locationEventCount > 1)) {
            clearTimeout(timerID);
            navigator.geolocation.clearWatch(watchID);
            foundPosition(position);
        } else {
            //geoprogress(position);
            console.log(position);
        }
    };

    var stopTrying = function () {
        navigator.geolocation.clearWatch(watchID);
        foundPosition(lastCheckedPosition);
    };

    var onError = function (error) {
        clearTimeout(timerID);
        navigator.geolocation.clearWatch(watchID);
        geolocationError(error);
    };

    var foundPosition = function (position) {
        geolocationSuccess(position);
    };

    if (!options.maxWait)            options.maxWait = 5000; // Default 10 seconds
    if (!options.desiredAccuracy)    options.desiredAccuracy = 1000; // Default 20 meters
    if (!options.timeout)            options.timeout = options.maxWait; // Default to maxWait

    options.maximumAge = 0; // Force current locations only
    options.enableHighAccuracy = true; // Force high accuracy (otherwise, why are you using this function?)

    watchID = navigator.geolocation.watchPosition(checkLocation, onError, options);
    timerID = setTimeout(stopTrying, options.maxWait); // Set a timeout that will abandon the location loop
};


function location_declined(error)
{
	$.mobile.loading( 'hide');
	
	console.log(JSON.stringify(error));
	
	if(error.code != 3)
	{
		alert(gps_disabled_message);
	}
	else
	{
		alert('Your GPS Service timed out.');
	}
}

/*
function location_accepted(position)
{
	console.log(JSON.stringify(position));
	my_lat_long =  position.coords.latitude + ',' + position.coords.longitude;
}
*/
