import { event } from "./events";
import Service from "./Service";
let gpsEventData = {};
function handleGpsCb(locationFound, err) {
  const { code: errorCode, message: errorMessage } = err || {};
  const newGpsEventData = { locationFound, errorCode };
  if (JSON.stringify(gpsEventData) !== JSON.stringify(newGpsEventData)) {
    console.log(errorMessage);
    gpsEventData = newGpsEventData;
    event("gps", gpsEventData);
  }
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
          handleGpsCb(true);
          this.onChanged(this.location);
        },
        (err) => {
          handleGpsCb(false, err);
          this.errorReason = new Error("מיקום אינו זמין");
          this.onChanged(null);
        }
      );
    } else {
      handleGpsCb(false, { code: -1, message: "מיקום אינו זמין" });
      this.errorReason = new Error("מיקום אינו זמין");
      this.onChanged(null);
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
