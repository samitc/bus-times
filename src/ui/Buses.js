import React, {Component} from "react"
import ChoseBox from "./ChoseBox";
import {isMobile} from "../utils/env";
import {default as DataBuses} from "../data/Buses"
import Cookies from 'js-cookie'
import {chooseBusStation} from "../utils/GA";

class Buses extends Component {
    constructor() {
        super();
        this.state = {
            buses: [],
            selectedBus: []
        }
    }

    loadData(buses) {
        let selectedBus = [];
        let selectedBusArr = Cookies.get('busId');
        if (selectedBusArr != null) {
            for (let bus of selectedBusArr.split('|')) {
                bus = parseInt(bus, 10);
                let selectBus = buses.find((val) => {
                    return bus === val.value
                });
                if (selectBus != null) {
                    selectedBus.push(selectBus)
                }
            }
            if (selectedBus.length > 0) {
                this.props.selectedChange(selectedBus);
            }
        }
        buses.sort((a, b) => {
            if (a.length !== b.length) {
                return a.length - b.length;
            }
            let l = a.length;
            let aL = a.label;
            let bL = b.label;
            if (aL[l - 1] < '0' || aL[l - 1] > '9') {
                aL = aL.substring(0, l - 1)
            }
            if (bL[l - 1] < '0' || bL[l - 1] > '9') {
                bL = bL.substring(0, l - 1)
            }
            return parseInt(aL, 10) - parseInt(bL, 10)
        });
        if (selectedBus.length > 0) {
            chooseBusStation(this.props.stationId, selectedBus);
        }
        this.setState({buses, selectedBus});
    }

    componentDidMount() {
        if (this.props.stationId != null) {
            DataBuses.getStationBuses(this.props.stationId).then(buses => this.loadData(buses)).catch(reason => console.log(reason))
        } else {
            DataBuses.getBuses().then(buses => this.loadData(buses)).catch(reason => console.log(reason))
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.stationId !== prevProps.stationId) {
            this.setState({buses: [], selectedBus: null});
            if (prevProps.stationId != null) {
                Cookies.remove('busId');
            }
            this.componentDidMount()
        }
    }

    render() {
        const busSelect = (bus) => {
            if (this.state.stationId == null) {
                let newBus = [];
                for (let b of bus) {
                    newBus = newBus.concat(this.state.buses.filter(value => value.label === b.label))
                }
                bus = newBus
            }
            if (bus.length > 0) {
                chooseBusStation(this.props.stationId, bus);
            }
            this.setState({selectedBus: bus});
            let busesId = bus.map(busJ => {
                return busJ.value
            });
            Cookies.set('busId', busesId.join("|"));
            this.props.selectedChange(bus);
        };
        return (
            <ChoseBox
                items={this.state.buses.filter((value, index, array) => !index || value.label !== array[index - 1].label)}
                onSelectedChanged={busSelect}
                numOfOptions={isMobile() ? 4 : 7}
                noValue='בחר קו'
                emptyFilterValue='אין קוים'
                selectOpened={this.props.selectOpened}
                selectClosed={this.props.selectClosed}
                value={this.state.selectedBus}
                multi={true}
            />
        )
    }
}

export default Buses;