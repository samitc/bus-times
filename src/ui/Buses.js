import {Component} from "react"
import React from "react"
import ChoseBox from "./ChoseBox";
import {isMobile} from "../utils/env";
import {default as DataBuses} from "../data/Buses"

class Buses extends Component {
    constructor() {
        super();
        this.state = {
            buses: []
        }
    }

    componentDidMount() {
        if (this.props.stationId != null) {
            DataBuses.getStationBuses(this.props.stationId).then(buses => this.setState({buses}))
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.stationId !== prevProps.stationId && this.props.stationId !== null) {
            this.componentDidMount()
        }
    }

    render() {
        return (
            <ChoseBox
                items={this.state.buses}
                onSelectedChanged={this.props.selectedChange}
                numOfOptions={isMobile() ? 4 : 7}
                noValue='בחר קו'
                emptyFilterValue='אין קוים'
                selectOpened={this.props.selectOpened}
                selectClosed={this.props.selectClosed}
            />
        )
    }
}

export default Buses;