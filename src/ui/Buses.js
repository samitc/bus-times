import React, { Component } from "react"
import { default as DataBuses, stationBusesHash } from "../data/Buses"
import { chooseBusStation, getObjectId } from "../utils/GA";
import Select from "./Select";

class Buses extends Component {
    static sortBuses(buses) {
        buses.sort((a, b) => {
            let aL = a.number;
            let bL = b.number;
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
        let isFirstRead = true;
        const busHash = (stationId, busId) => stationBusesHash(stationId, busId);
        const busSelect = (bus) => {
            if (bus.length > 0) {
                chooseBusStation(this.props.stations, bus);
            }
            this.props.selectedChange(bus);
        };
        const readData = (callback) => {
            if (!this.props.isBusesFilter || isFirstRead) {
                if (this.props.stations != null && this.props.stations.length > 0) {
                    let prom = [];
                    for (let station of this.props.stations) {
                        prom.push(DataBuses.getStationBuses(getObjectId(station)).then(buses => {
                            for (let bus of buses) {
                                bus.stationId = getObjectId(station);
                                bus.station = station;
                                bus.value = busHash(bus.stationId, bus.id)
                            }
                            return buses
                        }).catch(reason => {
                            console.log(reason);
                            return []
                        }));
                    }
                    Promise.all(prom).then(busesArrays => {
                        let buses = [];
                        for (let busArray of busesArrays) {
                            buses = buses.concat(busArray)
                        }
                        callback(buses)
                    })
                } else if (this.props.isBusesFilter) {
                    DataBuses.getBuses().then(buses => callback(buses)).catch(reason => console.log(reason))
                }
                isFirstRead = false;
            }
        };
        return (
            <Select
                readData={readData}
                selectedChange={busSelect}
                setItems={Buses.sortBuses}
                values={this.props.isBusesFilter ? null : this.props.stations}
                isMulti={!this.props.isBusesFilter}
                cookieName='buses'
                noValue='בחר קו'
                emptyFilterValue='אין קוים'
                selectOpened={this.props.selectOpened}
                selectClosed={this.props.selectClosed}
                newOptionAvailable={this.props.stations.length !== 0}
                itemCompare={(itemA, itemB) => itemA.label === itemB.label}
            />
        )
    }
}

export default Buses;