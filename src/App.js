import React, { Component } from 'react';
import './App.css';
import BusesTimes from "./ui/BusesTimes";
import { isMobile } from './utils/env'
import classNames from 'classnames';
import { initializeGA } from "./utils/GA";
import { stationBusesHash } from "./data/Buses";
import TimePicker from 'rc-time-picker'
import 'rc-time-picker/assets/index.css';
import CurBusesTimes from "./ui/CurBusesTimes";
import { getLocation } from "./utils/Gps";
import SpecificPanel from "./ui/SpecificPanel"
import Keyboard from './services/Keyboard';
class App extends Component {
    constructor() {
        super();
        initializeGA();
        this.isMobile = isMobile();
        this.state = {
            stations: [],
            buses: [],
            isBusesFilter: false,
            startTime: 0,
            endTime: 86400,
            isLocationOk: true
        };
        getLocation(() => {
        }, () => {
            this.setState({ isLocationOk: false })
        })
        this.keyboard = new Keyboard()
    }
    componentDidMount() {
        this.keyboardCallback = (hasKeyboard) => this.forceUpdate()
        this.keyboard.addCallback(this.keyboardCallback)
    }
    componentWillUnmount() {
        this.keyboard.removeCallback(this.keyboardCallback)
    }
    static timeToHour(time) {
        return Math.trunc(time / (60 * 60))
    }

    static timeToMinute(time, hour) {
        return Math.trunc(time / 60 - hour * 60)
    }
    render() {
        const busChange = (buses) => {
            let stations = this.state.isBusesFilter ? [] : this.state.stations;
            this.setState({ stations, buses });
        };
        const iterateData = () => {
            let data = new Map();
            if (this.state.isBusesFilter) {
                if (this.state.buses.length > 0) {
                    for (let station of this.state.stations) {
                        if (!data.has(station.id)) {
                            data.set(station.id, [])
                        }
                        data.get(station.id).push({ 'station': station, 'bus': this.state.buses[0] })
                    }
                }
            } else {
                for (let bus of this.state.buses) {
                    if (bus.stationId != null) {
                        if (!data.has(bus.stationId)) {
                            data.set(bus.stationId, [])
                        }
                        data.get(bus.stationId).push({ 'station': null, 'bus': bus });
                    }
                }
            }
            if (data.size === 0) {
                return null;
            }
            return data;
        };
        const printBusesTimes = () => {
            let data = iterateData();
            if (data !== null) {
                return this.state.stations.map(station => (
                    data.has(station.id) &&
                    <div key={station.id}>
                        {
                            data.size > 1 && <h3 className='Buses-times'>
                                {station.name}
                            </h3>
                        }
                        {
                            data.get(station.id).map(value =>
                                <BusesTimes
                                    key={stationBusesHash(value.station === null ? value.bus.stationId : value.station.id, value.bus.id)}
                                    stationId={value.bus.stationId != null ? value.bus.stationId : value.station.id}
                                    busId={value.bus.id} busNumber={value.bus.label}
                                    filterTimeStart={this.state.startTime} filterTimeEnd={this.state.endTime} />)
                        }
                    </div>)
                )
            }
            return null;
        };
        const printCurBusesTimes = () => {
            let data = iterateData();
            if (data !== null) {
                return this.state.stations.map(station => data.has(station.id) && data.get(station.id).map(value =>
                    <CurBusesTimes
                        key={stationBusesHash(value.station === null ? value.bus.stationId : value.station.id, value.bus.id)}
                        stationId={value.bus.stationId != null ? value.bus.stationId : value.station.id}
                        busId={value.bus.id} busNumber={value.bus.label}
                        stationName={value.station == null ? value.bus.station.name : value.station.name} />))

            }
        };
        const getTimeFromPicker = (time, defaultValue) => {
            if (time === null) {
                return defaultValue
            }
            let strTime = time.format("HH:mm");
            let strArr = strTime.split(":");
            return (parseInt(strArr[0], 10) * 60 + parseInt(strArr[1], 10)) * 60
        };
        const headerClasses = classNames('App-header', { 'App-header-shrink': this.keyboard.hasKeyboard() });
        return (
            <div className="App">
                <header className={headerClasses}>
                    <h1 className="App-title">זמני אוטובוס</h1>
                </header>
                <div>
                    {!this.state.isLocationOk && <span className='Error'>מיקום אינו זמין</span>}
                </div>
                <SpecificPanel
                    keyboard={this.keyboard}
                    reset={() => this.setState({ stations: [], buses: [] })}
                    buses={this.state.buses}
                    stations={this.state.stations}
                    stationChange={(stations) => this.setState({ stations: stations })}
                    busesChange={busChange}
                />
                <label>סנן לפי זמן התחלה: </label>
                <TimePicker
                    className='Time-picker-filter'
                    showSecond={false}
                    onChange={(time) => this.setState({ startTime: getTimeFromPicker(time, 0) })}
                    disabledHours={() => {
                        const arr = [];
                        for (let v = App.timeToHour(this.state.endTime) + 1; v < 24; v++) {
                            arr.push(v)
                        }
                        return arr;
                    }}
                    disabledMinutes={(h) => {
                        const arr = [];
                        if (h === App.timeToHour(this.state.endTime)) {
                            for (let v = App.timeToMinute(this.state.endTime, h) + 1; v < 60; v++) {
                                arr.push(v)
                            }
                        }
                        return arr;
                    }}
                />
                <label> וזמן סיום: </label>
                <TimePicker
                    className='Time-picker-filter'
                    showSecond={false}
                    onChange={(time) => this.setState({ endTime: getTimeFromPicker(time, 86400) })}
                    disabledHours={() => {
                        const arr = [];
                        for (let v = 0; v < App.timeToHour(this.state.startTime); v++) {
                            arr.push(v)
                        }
                        return arr;
                    }}
                    disabledMinutes={(h) => {
                        const arr = [];
                        if (h === App.timeToHour(this.state.startTime)) {
                            for (let v = 0; v < App.timeToMinute(this.state.startTime, h); v++) {
                                arr.push(v)
                            }
                        }
                        return arr;
                    }}
                />
                {
                    printCurBusesTimes()
                }
                {
                    printBusesTimes()
                }
            </div>
        );
    }
}

export default App;
