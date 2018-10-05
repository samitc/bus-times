import {Component} from "react"
import React from "react"
import ChoseBox from "./ChoseBox";
import {isMobile} from "../utils/env";
import {default as DataBuses} from "../data/Buses"

class Buses extends Component {
    constructor() {
        super();
        this.state = {
            buses: [],
            selectedBus: null
        }
    }

    componentDidMount() {
        this.setState({buses: [], selectedBus: null});
        if (this.props.stationId != null) {
            DataBuses.getStationBuses(this.props.stationId).then(buses => this.setState({buses}))
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.stationId !== prevProps.stationId) {
            this.componentDidMount()
        }
    }

    render() {
        const busSelect = (bus) => {
            this.setState({selectedBus: bus});
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