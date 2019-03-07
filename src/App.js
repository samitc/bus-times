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
import SpecificPanel from "./ui/SpecificPanel"
import Keyboard from './services/Keyboard';
import Gps from './services/Gps';
class App extends Component {
    constructor() {
        super();
        initializeGA();
        this.isMobile = isMobile();
        this.state = {
            busesData: null,
            startTime: 0,
            endTime: 86400,
            appError: null
        };
        this.keyboard = new Keyboard()
        this.gps = new Gps()
    }
    componentDidMount() {
        this.keyboardCallback = () => this.forceUpdate()
        this.gpsCallback = (location) => {
            if (location === null) {
                this.setState({ appError: this.gps.getErrorReason })
            }
        }
        this.keyboard.addCallback(this.keyboardCallback)
        this.gps.addCallback(this.gpsCallback)
    }
    componentWillUnmount() {
        this.keyboard.removeCallback(this.keyboardCallback)
        this.gps.removeCallback(this.gpsCallback)
    }
    static timeToHour(time) {
        return Math.trunc(time / (60 * 60))
    }

    static timeToMinute(time, hour) {
        return Math.trunc(time / 60 - hour * 60)
    }
    render() {
        const printBusesTimes = () => {
            let data = this.state.busesData
            if (data !== null) {
                let numOfStations = data.size
                return Array.from(data.keys()).map(station => (
                    <div key={station.id}>
                        {numOfStations > 1 && <h3 className='Buses-times'>
                            {station.name}
                        </h3>}
                        {
                            data.get(station).map(bus =>
                                <BusesTimes
                                    key={stationBusesHash(station.id, bus.id)}
                                    stationId={station.id}
                                    busId={bus.id} busNumber={bus.label}
                                    filterTimeStart={this.state.startTime} filterTimeEnd={this.state.endTime} />)
                        }
                    </div>
                ))
            }
            return null;
        };
        const printCurBusesTimes = () => {
            let data = this.state.busesData
            if (data !== null) {
                return Array.from(data.keys()).map(station =>
                    data.get(station).map(bus =>
                        <CurBusesTimes
                            key={stationBusesHash(station.id, bus.id)}
                            stationId={station.id}
                            busId={bus.id} busNumber={bus.label}
                            stationName={station.name} />)
                )
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
        const createError = () => {
            if (this.state.appError !== null) {
                return <span className='Error'>{this.state.appError.message}</span>
            }
        }
        const headerClasses = classNames('App-header', { 'App-header-shrink': isMobile() && this.keyboard.hasKeyboard() });
        return (
            <div className="App">
                <header className={headerClasses}>
                    <h1 className="App-title">זמני אוטובוס</h1>
                </header>
                {createError()}
                <SpecificPanel
                    keyboard={this.keyboard}
                    gps={this.gps}
                    setData={(data) => this.setState({ busesData: data })}
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
