const BASE_URL = 'http://localhost:8088/';
const stationUrl = BASE_URL + 'stations';
const busesUrl = stationUrl + '/';
const busesTimePrefixUrl = stationUrl + '/';
const busesTimeSuffixUrl = '/bus/';
let testIndex = 1;

function hash() {
    return testIndex++
}

function createJsonResult(result) {
    if (result.ok) {
        return result.json()
    } else {
        console.log("error while fetching " + result.url)
    }
}

class Buses {

    static getStations() {
        const stationsToValidJson = (json) => {
            return Object.keys(json).map(value => {
                const intVal = parseInt(value, 10);
                return {id: intVal, value: intVal, label: json[value] + '(' + value + ')'}
            });
        };
        return fetch(stationUrl).then(result => createJsonResult(result)).then(json => stationsToValidJson(json))
    }

    static getStationBuses(stationId) {
        const fetchUrl = busesUrl + stationId;
        const busesToValidJson = (arr) => {
            return arr.map(value => {
                return {id: value.id, value: value.id, label: value.number}
            });
        };
        return fetch(fetchUrl).then(result => createJsonResult(result)).then(json => busesToValidJson(json));
    }


    static getBusesTimes(stationId, busId) {
        const fetchUrl = busesTimePrefixUrl + stationId + busesTimeSuffixUrl + busId;
        const busesTimeToValidJson = (json) => {
            return json.map(val => {
                return {id: hash(val.time, val.count), time: val.time, count: val.count}
            })
        };
        return fetch(fetchUrl).then(result => createJsonResult(result)).then(json => busesTimeToValidJson(json));
    }
}

export default Buses