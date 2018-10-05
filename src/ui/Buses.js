import {Component} from "react"
import React from "react"
import ChoseBox from "./ChoseBox";
import {isMobile} from "../utils/env";
import {default as DataBuses} from "../data/Buses"
import Cookies from 'js-cookie'

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
                selectedBus.push(selectBus)
            }
            if (selectedBus.length > 0) {
                this.props.selectedChange(selectedBus);
            }
        }
        this.setState({buses, selectedBus});
    }

    componentDidMount() {
        if (this.props.stationId != null) {
            DataBuses.getStationBuses(this.props.stationId).then(buses => this.loadData(buses)).catch(reason => console.log(reason))
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
            this.setState({selectedBus: bus});
            let busesId = bus.map(busJ => {
                return busJ.value
            });
            Cookies.set('busId', busesId.join("|"));
            this.props.selectedChange(bus);
        };
        return (
            <ChoseBox
                items={this.state.buses}
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