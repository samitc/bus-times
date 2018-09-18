import {Component} from "react"
import React from "react"
import ChoseBox from "./ChoseBox";

import {default as DataBuses} from "../data/Buses"

class Buses extends Component {
    constructor() {
        super();
        this.state = {
            buses: []
        }
    }

    componentDidMount() {
        DataBuses.getStationBuses(this.props.stationId).then(buses => this.setState({buses}))
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
                noValue='בחר קו'
                emptyFilterValue='אין קוים'
            />
        )
    }
}

export default Buses;