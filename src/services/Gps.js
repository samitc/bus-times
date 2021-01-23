import Service from "./Service";
export function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({ lat: position.coords.latitude, lon: position.coords.longitude });
                },
                () => {
                    reject(new Error("מיקום אינו זמין"));
                }
            )
        } else {
            reject(new Error("מיקום אינו זמין"));
        }
    });
}
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
                () => {
                    this.errorReason = new Error("מיקום אינו זמין")
                    this.onChanged(null)
                }
            )
        } else {
            this.errorReason = new Error("מיקום אינו זמין")
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