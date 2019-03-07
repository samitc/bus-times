import React, { Component } from "react";
import Buses from "../data/Buses";
import { chooseStation, getObjectId } from "../utils/GA";
import Select from "./Select";
import geolib from 'geolib'
class Stations extends Component {
    static createLocation(lat, lon) {
        return { lat: lat, lon: lon }
    }
    static sortStations(loc, stations) {
        stations.sort((a, b) => {
            let aDis = a.lat != null ? geolib.getDistance(loc, Stations.createLocation(a.lat, a.lon)) : Number.MAX_VALUE
            let bDis = b.lat != null ? geolib.getDistance(loc, Stations.createLocation(b.lat, b.lon)) : Number.MAX_VALUE
            return aDis - bDis
        })
    }
    render() {
        const selectedChange = (selectedOption) => {
            chooseStation(selectedOption);
            this.props.selectedChanged(selectedOption);
        };
        const readData = (callback) => {
            let fetch = null;
            if (this.props.buses !== null) {
                if (this.props.buses.length > 0) {
                    fetch = Buses.getBusesStations(this.props.buses.map((bus) => getObjectId(bus)))
                }
            } else {
                fetch = Buses.getStations()
            }
            if (fetch !== null) {
                fetch.then(stations => {
                    let gpsCallback
                    gpsCallback = (location) => {
                        this.props.gps.removeCallback(gpsCallback)
                        if (location !== null) {
                            Stations.sortStations(location, stations)
                            callback(stations)
                        }
                    }
                    this.props.gps.addCallback(gpsCallback)
                    this.props.gps.calcLocation()
                    callback(stations)
                }).catch(reason => console.log(reason))
            }
        };
        return (
            <Select
                readData={readData}
                selectedChange={selectedChange}
                values={this.props.buses}
                cookieName='stations'
                noValue='בחר תחנה'
                emptyFilterValue='אין תחנות'
                selectOpened={this.props.selectOpened}
                selectClosed={this.props.selectClosed}
                objectReplacement={[{ from: 'ת.', to: 'תחנה' }]}
                searchReplacement={[{ from: 'ת ', to: 'ת. ' }]}
                newOptionAvilible={true}
            />
        )
    }
}

export default Stations;