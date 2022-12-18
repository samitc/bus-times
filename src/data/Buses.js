import { startDataLoadingForPromise } from "../services/events";

const BASE_URL = "http://localhost:8088/";
const stationUrl = BASE_URL + "stations";
const allStationUrl = BASE_URL + "station";
const busesUrl = stationUrl + "/";
const busesTimePrefixUrl = stationUrl + "/";
const busesTimeSuffixUrl = "/bus/";
const busesCurTimeUrl = "/time";
export class HttpError extends Error {
  constructor(message, httpCode) {
    super(message);
    this.httpCode = httpCode;
  }
}
function fetchFromServer(url) {
  return fetch(url).then((result) => {
    if (result.ok) {
      return result;
    } else {
      throw new HttpError("Network response was not ok.", result.status);
    }
  });
}
function createLabelForBus(bus) {
  return bus.destination != null
    ? `${bus.number} ל${bus.destination}`
    : bus.number;
}
function busesToValidJson(arr) {
  return arr.map((value) => {
    return {
      id: value.id,
      value: value.id,
      number: value.number,
      label: createLabelForBus(value),
      destination: value.destination,
    };
  });
}
function stationsToValidJson(json) {
  return json.map((value) => {
    return {
      id: value.id,
      value: value.id,
      name: value.name,
      label: value.id + "(" + value.name + ")",
      lat: value.lat,
      lon: value.lon,
    };
  });
}
export function stationBusesHash(stationId, busId) {
  return (stationId << 16) | busId;
}
function busesTimeHash(stationId, busId, time, count) {
  return ((time << 16) | count) ^ stationBusesHash(stationId, busId);
}

class Buses {
  static allStationsPromise = null;
  static stationsPromise = null;
  static getAllStations() {
    if (Buses.allStationsPromise === null) {
      const dataLoadFunc = startDataLoadingForPromise("getAllStations");
      Buses.allStationsPromise = fetchFromServer(allStationUrl)
        .then((result) => result.json())
        .then((json) => stationsToValidJson(json))
        .then(dataLoadFunc);
    }
    return Buses.allStationsPromise;
  }
  static getStations() {
    if (Buses.stationsPromise === null) {
      const dataLoadFunc = startDataLoadingForPromise("getStations");
      Buses.stationsPromise = fetchFromServer(stationUrl)
        .then((result) => result.json())
        .then((json) => stationsToValidJson(json))
        .then(dataLoadFunc);
    }
    return Buses.stationsPromise;
  }
  static getStationBuses(stationId) {
    const fetchUrl = busesUrl + stationId;
    const dataLoadFunc = startDataLoadingForPromise("getStationBuses", {
      stationId,
    });
    return fetchFromServer(fetchUrl)
      .then((result) => result.json())
      .then((json) => busesToValidJson(json))
      .then(dataLoadFunc);
  }

  static getBusesTimes(stationId, busId) {
    const fetchUrl =
      busesTimePrefixUrl + stationId + busesTimeSuffixUrl + busId;
    const busesTimeToValidJson = (json) => {
      return json.map((val) => {
        return {
          id: busesTimeHash(stationId, busId, val.time, val.count),
          time: val.time,
          count: val.count,
        };
      });
    };
    const dataLoadFunc = startDataLoadingForPromise("getBusesTimes", {
      stationId,
      busId,
    });
    return fetchFromServer(fetchUrl)
      .then((result) => result.json())
      .then((json) => busesTimeToValidJson(json))
      .then(dataLoadFunc);
  }

  static getBusesCurTimes(stationId, busId) {
    const fetchUrl =
      busesTimePrefixUrl +
      stationId +
      busesTimeSuffixUrl +
      busId +
      busesCurTimeUrl;
    const dataLoadFunc = startDataLoadingForPromise("getBusesCurTimes", {
      stationId,
      busId,
    });
    return fetchFromServer(fetchUrl)
      .then((result) => result.text())
      .then((res) => {
        if (res !== "") {
          res = parseInt(res, 10);
        }
        return res;
      })
      .then(dataLoadFunc);
  }
  static getRoutes(originPlace, destinationPlace, time) {
    const fetchUrl = `${BASE_URL}routes/${originPlace}/${destinationPlace}/${time}/route`;
    const dataLoadFunc = startDataLoadingForPromise("getRoutes", {
      originPlace,
      destinationPlace,
      time,
    });
    return fetchFromServer(fetchUrl)
      .then((result) => result.json())
      .then(dataLoadFunc);
  }
}

export default Buses;
