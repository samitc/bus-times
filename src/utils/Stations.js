import { default as DataBuses } from '../data/Buses';
import { getDistance } from 'geolib';
export async function getAllStations() {
    return await DataBuses.getAllStations();
}
export function filterStation(station, term) {
    const { label } = station;
    return label.indexOf(term) !== -1 || label.replace('.ת', 'תחנה').indexOf(term) !== -1 || label.replace('ת.', 'ת').indexOf(term) !== -1 || label.indexOf(term.replace('ת ', 'ת.')) !== -1;
}
export function sortByDistanceInPlace(stations, location) {
    stations.sort((a, b) => {
        const aDis = getDistance(location, createLocation(a.lat, a.lon));
        const bDis = getDistance(location, createLocation(b.lat, b.lon));
        return aDis - bDis;
    });
}
function createLocation(lat, lon) {
    return { lat: lat, lon: lon };
}