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

class App extends Component {
    constructor() {
        super();
        initializeGA();
        this.isMobile = isMobile();
        this.state = {stations: [], buses: [], hasKeyboard: false, isBusesFilter: false};
    }

    static createBusesTimes(station, bus) {
        return <BusesTimes key={stationBusesHash(station === null ? bus.stationId : station.id, bus.id)}
                           stationId={bus.stationId != null ? bus.stationId : station.id}
                           busId={bus.id} busNumber={bus.label}/>
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
                    this.state.isBusesFilter ?
                        this.state.buses.length > 0 ?
                            this.state.stations.map(station => {
                                return App.createBusesTimes(station, this.state.buses[0])
                            }) : null
                        :
                        this.state.buses.map(bus => {
                            if (bus.stationId != null) {
                                return App.createBusesTimes(null, bus)
                            } else {
                                return null
                            }
                        })
                }
            </div>
        );
    }
}

export default App;
