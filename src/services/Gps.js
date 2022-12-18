import { event } from "./events";
import Service from "./Service";
function sendGpsEvent(locationFound, errorCode) {
  event("gps", { locationFound, errorCode });
}
export function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          sendGpsEvent(true);
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          sendGpsEvent(false, err.code);
          reject(new Error("מיקום אינו זמין"));
        }
      );
    } else {
      sendGpsEvent(false, -1);
      reject(new Error("מיקום אינו זמין"));
    }
  });
}
export default class Gps extends Service {
  constructor() {
    super();
    this.location = null;
    this.errorReason = null;
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
