import { event } from "./events";
import Service from "./Service";
function sendGpsEvent(locationFound, errorCode) {
  event("gps", { locationFound, errorCode });
}
export default class Gps extends Service {
  constructor(refreshTimeout) {
    super();
    this.location = null;
    this.errorReason = null;
    const refreshFunction = () => {
      this.calcLocation();
      setTimeout(refreshFunction, refreshTimeout);
    };
    refreshFunction();
  }
  calcLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          sendGpsEvent(true);
          this.onChanged(this.location);
        },
        (err) => {
          sendGpsEvent(false, err.code);
          this.errorReason = new Error("מיקום אינו זמין");
          this.onChanged(null);
        }
      );
    } else {
      sendGpsEvent(false, -1);
      this.errorReason = new Error("מיקום אינו זמין");
    }
  }
  isLocationOk() {
    return this.errorReason === null;
  }
  getErrorReason() {
    return this.errorReason;
  }
  getLocation() {
    return this.location;
  }
}
