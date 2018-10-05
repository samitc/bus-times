const BASE_URL = 'http://localhost:8088/';
const stationUrl = BASE_URL + 'stations';
const busesUrl = stationUrl + '/';
const busesTimePrefixUrl = stationUrl + '/';
const busesTimeSuffixUrl = '/bus/';
const busesCurTimeUrl = '/time';
let testIndex = 1;

function hash() {
    return testIndex++
}

function fetchFromServer(url) {
    return fetch(url).then(result => {
        if (result.ok) {
            return result;
        } else {
            throw new Error('Network response was not ok.');
        }
    });
}

class Buses {

    static getStations() {
        const stationsToValidJson = (json) => {
            return Object.keys(json).map(value => {
                const intVal = parseInt(value, 10);
                return {id: intVal, value: intVal, label: json[value] + '(' + value + ')'}
            });
        };
        return fetchFromServer(stationUrl).then(result => result.json()).then(json => stationsToValidJson(json))
    }

    static getStationBuses(stationId) {
        const fetchUrl = busesUrl + stationId;
        const busesToValidJson = (arr) => {
            return arr.map(value => {
                return {id: value.id, value: value.id, label: value.number}
            });
        };
        return fetchFromServer(fetchUrl).then(result => result.json()).then(json => busesToValidJson(json));
    }


    static getBusesTimes(stationId, busId) {
        const fetchUrl = busesTimePrefixUrl + stationId + busesTimeSuffixUrl + busId;
        const busesTimeToValidJson = (json) => {
            return json.map(val => {
                return {id: hash(val.time, val.count), time: val.time, count: val.count}
            })
        };
        return fetchFromServer(fetchUrl).then(result => result.json()).then(json => busesTimeToValidJson(json));
    }

    static getBusesCurTimes(stationId, busId) {
        const fetchUrl = busesTimePrefixUrl + stationId + busesTimeSuffixUrl + busId + busesCurTimeUrl;
        return fetchFromServer(fetchUrl).then(result => result.text());
    }
}

export default Buses