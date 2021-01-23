import { default as DataBuses } from '../data/Buses';
export async function readBusesData(stations) {
    const busesPromise = stations.map(station => DataBuses.getStationBuses(station.id));
    const buses = await Promise.all(busesPromise);
    return stations.reduce((acc, station, index) => {
        return acc.concat(buses[index].map(bus => {
            return { ...bus, stationId: station.id };
        }));
    }, []);
}