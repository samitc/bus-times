import React, {Component} from "react"
import {default as DataBuses, stationBususHash} from "../data/Buses"
import {chooseBusStation} from "../utils/GA";
import Select from "./Select";

class Buses extends Component {
    static sortBuses(buses) {
        buses.sort((a, b) => {
            let aL = a.label;
            let bL = b.label;
            if (aL.length !== bL.length) {
                return aL.length - bL.length;
            }
            let l = aL;
            if (aL[l - 1] < '0' || aL[l - 1] > '9') {
                aL = aL.substring(0, l - 1)
            }
            if (bL[l - 1] < '0' || bL[l - 1] > '9') {
                bL = bL.substring(0, l - 1)
            }
            return parseInt(aL, 10) - parseInt(bL, 10)
        });
    }

    render() {
        const busHash = (stationId, busId) => stationBususHash(stationId,busId);
        const busSelect = (bus) => {
            chooseBusStation(this.props.stations, bus);
            this.props.selectedChange(bus);
        };
        const readData = (callback) => {
            if (this.props.stations != null && this.props.stations.length > 0) {
                let prom = [];
                for (let station of this.props.stations) {
                    prom.push(DataBuses.getStationBuses(station.id).then(buses => {
                        for (let bus of buses) {
                            bus.stationId = station.id;
                            bus.value = busHash(bus.stationId, bus.id)
                        }
                        return buses
                    }).catch(reason => console.log(reason)));
                    Promise.all(prom).then(busesArrays => {
                        let buses = [];
                        for (let busArray of busesArrays) {
                            buses = buses.concat(busArray)
                        }
                        callback(buses)
                    })
                }
            } else {
                DataBuses.getBuses().then(buses => callback(buses)).catch(reason => console.log(reason))
            }
        };
        return (
            <Select
                readData={readData}
                selectedChange={busSelect}
                setItems={Buses.sortBuses}
                values={this.props.stations}
                cookieName='buses'
                noValue='בחר קו'
                emptyFilterValue='אין קוים'
                selectOpened={this.props.selectOpened}
                selectClosed={this.props.selectClosed}
            />
        )
    }
}

export default Buses;