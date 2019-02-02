export function getLocation(locationCallback, errorCallback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                locationCallback(position.coords.latitude, position.coords.longitude)
            },
            errorCallback
        )
    } else {
        errorCallback(Error("location is not support"))
    }
}