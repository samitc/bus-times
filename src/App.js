import React, {Component} from 'react';
import './App.css';
import Stations from "./ui/Stations";
import Buses from "./ui/Buses";
import BusesTimes from "./ui/BusesTimes";
import {isMobile} from './utils/env'
import classNames from 'classnames';
import {initializeGA} from "./utils/GA";
import {stationBusesHash} from "./data/Buses";
import Switch from 'react-switch'
import CurBusesTimes from "./ui/CurBusesTimes";

class App extends Component {
    constructor() {
        super();
        initializeGA();
        this.isMobile = isMobile();
        this.state = {stations: [], buses: [], hasKeyboard: false, isBusesFilter: false};
    }

    render() {
        const stationChange = (stations) => {
            this.setState({stations})
        };
        const busChange = (buses) => {
            let stations = this.state.isBusesFilter ? [] : this.state.stations;
            this.setState({stations, buses});
        };
        const selectOpened = () => {
            if (this.isMobile) {
                this.setState({hasKeyboard: true});
            }
        };
        const selectClosed = () => {
            if (this.isMobile) {
                this.setState({hasKeyboard: false});
            }
        };
        const handleBusesFilterChange = () => {
            this.setState({stations: [], buses: [], isBusesFilter: !this.state.isBusesFilter})
        };
        const iterateData = () => {
            let data = new Map();
            if (this.state.isBusesFilter) {
                if (this.state.buses.length > 0) {
                    for (let station of this.state.stations) {
                        if (!data.has(station.id)) {
                            data.set(station.id, [])
                        }
                        data.get(station.id).push({'station': station, 'bus': this.state.buses[0]})
                    }
                }
            } else {
                for (let bus of this.state.buses) {
                    if (bus.stationId != null) {
                        if (!data.has(bus.stationId)) {
                            data.set(bus.stationId, [])
                        }
                        data.get(bus.stationId).push({'station': null, 'bus': bus});
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
                    <div key={station.id}>
                        <h2 className='Buses-times'>
                            {station.name}</h2>
                        {
                            data.has(station.id) &&
                            data.get(station.id).map(value =>
                                <BusesTimes
                                    key={stationBusesHash(value.station === null ? value.bus.stationId : value.station.id, value.bus.id)}
                                    stationId={value.bus.stationId != null ? value.bus.stationId : value.station.id}
                                    busId={value.bus.id} busNumber={value.bus.label}/>)
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
                        stationName={value.station == null ? value.bus.station.name : value.station.name}/>))

            }
        };
        const headerClasses = classNames('App-header', {'App-header-shrink': this.state.hasKeyboard});
        const introClasses = classNames('App-intro', {'App-intro-shrink': this.state.hasKeyboard});
        return (
            <div className="App">
                <header className={headerClasses}>
                    <h1 className="App-title">זמני אוטובוס</h1>
                </header>
                <p className={introClasses}>
                    בחרו תחנה ומספר קו והזמנים יופיעו למטה
                </p>
                <Stations
                    buses={this.state.buses}
                    isBusesFilter={this.state.isBusesFilter}
                    selectedChanged={stationChange}
                    selectOpened={selectOpened}
                    selectClosed={selectClosed}
                />
                <div className='Flex-display'>
                    <div className='Full-width'>
                        <Buses
                            stations={this.state.stations}
                            isBusesFilter={this.state.isBusesFilter}
                            selectedChange={busChange}
                            selectOpened={selectOpened}
                            selectClosed={selectClosed}
                        />
                    </div>
                    <label>סנן לפי אוטובוס</label>
                    <Switch
                        checked={this.state.isBusesFilter}
                        onChange={handleBusesFilterChange}
                        onColor="#86d3ff"
                        onHandleColor="#2693e6"
                        handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={20}
                        width={48}
                        className="Ltr-align"
                        id="material-switch"
                    />
                </div>
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
