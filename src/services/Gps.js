import Service from "./Service";

export default class Gps extends Service {
    constructor() {
        super()
        this.location = null
        this.errorReason = null
    }
    calcLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.location = { lat: position.coords.latitude, lon: position.coords.longitude }
                    this.onChanged(this.location)
                },
                error => {
                    this.errorReason = new Error(error.message)
                    this.onChanged(null)
                }
            )
        } else {
            this.errorReason = new Error("location is not support")
        }
    }
    isLocationOk() {
        return this.errorReason === null
    }
    getErrorReason() {
        return this.errorReason
    }
    getLocation() {
        return this.location
    }
}