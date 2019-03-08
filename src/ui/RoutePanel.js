import React, { Component } from "react"
import Buses from "../data/Buses";
import RouteLocation from "./RouteLocation";
import TimePicker from 'rc-time-picker'
import moment from 'moment'
export default class RoutePanel extends Component {
    constructor() {
        super()
        this.state = {
            cities: [],
            originPlace: null,
            destinationPlace: null,
            time: moment()
        }
    }
    componentDidMount() {
        Buses.getCities().then(cities => this.setState({ cities: cities }))
    }
    static checkEqualNotNull(preVal, val) {
        return val !== null && preVal !== val
    }
    getRoute() {
        if (this.state.originPlace !== null && this.state.destinationPlace !== null && this.state.time !== null) {
            Buses.getRoutes(this.state.originPlace, this.state.destinationPlace, RoutePanel.createTime(this.state.time)).then(jsonRoutesArray => {
                let data = new Map()
                for (let location of jsonRoutesArray) {
                    let buses = [{ id: location.busId, label: location.busNumber }]
                    data.set({ id: location.originStationId, name: location.name }, buses)
                }
                this.props.setData(data)
            })
        }
    }
    componentDidUpdate(_prevProps, prevState) {
        if (prevState.originPlace !== this.state.originPlace || prevState.destinationPlace !== this.state.destinationPlace || prevState.time !== this.state.time) {
            this.getRoute()
        }
    }
    static createTime(time) {
        if (time !== null) {
            time = time.format("HH:mm")
        }
        return time
    }
    render() {
        return (
            <div>
                <div>
                    <span>
                        נקודת התחלה
                    </span>
                    <RouteLocation
                        cities={this.state.cities}
                        keyboard={this.props.keyboard}
                        placeSelected={place => this.setState({ originPlace: place.id })}
                    />
                </div>
                <span>
                    נקודת סיום
                </span>
                <RouteLocation
                    cities={this.state.cities}
                    keyboard={this.props.keyboard}
                    placeSelected={place => this.setState({ destinationPlace: place.id })}
                />
                <div>
                    <span>
                        זמן יציאה
                    </span>
                    <TimePicker
                        showSecond={false}
                        onChange={time => this.setState({ time: time })}
                        use12Hours={false}
                        value={this.state.time}
                    />
                </div>
            </div>
        )
    }
}