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
            selectedBus: null
        }
    }

    loadData(buses) {
        let selectedBus = parseInt(Cookies.get('busId'), 10);
        selectedBus = buses.find((val) => {
            return selectedBus === val.value
        });
        if (selectedBus != null) {
            this.props.selectedChange(selectedBus);
        }
        if (selectedBus === undefined) {
            selectedBus = null;
        }
        this.setState({buses, selectedBus})
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
                Cookies.set('busId', null);
            }
            this.componentDidMount()
        }
    }

    render() {
        const busSelect = (bus) => {
            this.setState({selectedBus: bus});
            Cookies.set('busId', bus.value);
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
            />
        )
    }
}

export default Buses;