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
            originStation: null,
            destinationStation: null,
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
        if (this.state.originStation && this.state.destinationStation && this.state.time) {
            Buses.getRoutes(this.state.originStation.id, this.state.destinationStation.id, RoutePanel.createTime(this.state.time))
                .then(jsonRoutesArray => {
                    const data = [];
                    for (let stop of jsonRoutesArray) {
                        const bus = stop.busId && { id: stop.busId, label: stop.busNumber };
                        data.push({
                            originStation: this.getStationData(stop.originStationId),
                            destinationStation: this.getStationData(stop.destinationStationId), bus
                        });
                    }
                    this.props.setData(data)
                })
        }
    }
    componentDidUpdate(_prevProps, prevState) {
        if (prevState?.originStation?.id !== this.state?.originStation?.id ||
            prevState?.destinationStation?.id !== this.state?.destinationStation?.id ||
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
                        items={this.state.destinationStation ? this.state.stations.filter(station => station.id !== this.state.destinationStation.id) : this.state.stations}
                        keyboard={this.props.keyboard}
                        onSelectedChanged={station => this.setState({ originStation: station })}
                        noValue='בחר תחנה'
                    />
                </div>
                <div>
                    <span>
                        נקודת סיום
                    </span>
                    <InputChoseBox
                        items={this.state.originStation ? this.state.stations.filter(station => station.id !== this.state.originStation.id) : this.state.stations}
                        keyboard={this.props.keyboard}
                        onSelectedChanged={station => this.setState({ destinationStation: station })}
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