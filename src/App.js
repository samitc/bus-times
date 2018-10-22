import React, {Component} from 'react';
import './App.css';
import Stations from "./ui/Stations";
import Buses from "./ui/Buses";
import BusesTimes from "./ui/BusesTimes";
import {isMobile} from './utils/env'
import classNames from 'classnames';
import {initializeGA} from "./utils/GA";
import {stationBusesHash} from "./data/Buses";
import Cookies from "js-cookie";

class App extends Component {
    static IS_BUSES_FILTER_COOKIE_NAME = 'isBusesFilter';

    constructor() {
        super();
        initializeGA();
        this.isMobile = isMobile();
        this.isBusesFilter = Cookies.get(App.IS_BUSES_FILTER_COOKIE_NAME) || "false";
        this.isBusesFilter = this.isBusesFilter === "true";
        this.state = {stations: [], buses: [], hasKeyboard: false};
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
            if (this.state.stations.length === 0) {
                this.isBusesFilter = true
            }
            if (buses.length === 0) {
                this.isBusesFilter = false
            }
            Cookies.set(App.IS_BUSES_FILTER_COOKIE_NAME, this.isBusesFilter);
            let stations = this.isBusesFilter ? [] : this.state.stations;
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
                    isBusesFilter={this.isBusesFilter}
                    selectedChanged={stationChange}
                    selectOpened={selectOpened}
                    selectClosed={selectClosed}
                />
                <Buses
                    stations={this.state.stations}
                    isBusesFilter={this.isBusesFilter}
                    selectedChange={busChange}
                    selectOpened={selectOpened}
                    selectClosed={selectClosed}
                />
                {
                    this.isBusesFilter ?
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
