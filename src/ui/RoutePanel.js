import React, { Component } from "react"
import Buses from "../data/Buses";
import TimePicker from 'rc-time-picker'
import moment from 'moment'
import InputChoseBox from "./InputChoseBox";
export default class RoutePanel extends Component {
    constructor() {
        super()
        this.state = {
            stations: [],
            originStationId: null,
            destinationStationId: null,
            time: moment()
        }
    }
    componentDidMount() {
        Buses.getAllStations().then(stations => this.setState({ stations: stations }))
    }
    static checkEqualNotNull(preVal, val) {
        return val !== null && preVal !== val
    }
    getStationData(stationId) {
        return this.state.stations.find(station => stationId === station.id)
    }
    getRoute() {
        if (this.state.originStationId !== null && this.state.destinationStationId !== null && this.state.time !== null) {
            Buses.getRoutes(this.state.originStationId, this.state.destinationStationId, RoutePanel.createTime(this.state.time))
                .then(jsonRoutesArray => {
                    let data = new Map()
                    for (let stop of jsonRoutesArray) {
                        let buses = [{ id: stop.busId, label: stop.busNumber }]
                        let station = this.getStationData(stop.originStationId)
                        data.set({ id: station.id, name: station.name }, buses)
                    }
                    this.props.setData(data)
                })
        }
    }
    componentDidUpdate(_prevProps, prevState) {
        if (prevState.originStationId !== this.state.originStationId ||
            prevState.destinationStationId !== this.state.destinationStationId ||
            prevState.time !== this.state.time) {
            this.getRoute()
        }
    }
    static createTime(time) {
        if (time !== null) {
            time = time.diff(moment().startOf('day'), 'seconds')
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
                    <InputChoseBox
                        items={this.state.stations}
                        keyboard={this.props.keyboard}
                        onSelectedChanged={station => this.setState({ originStationId: station.id })}
                        noValue='בחר תחנה'
                    />
                </div>
                <div>
                    <span>
                        נקודת סיום
                    </span>
                    <InputChoseBox
                        items={this.state.stations}
                        keyboard={this.props.keyboard}
                        onSelectedChanged={station => this.setState({ destinationStationId: station.id })}
                        noValue='בחר תחנה'
                    />
                </div>
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