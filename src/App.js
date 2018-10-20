import React, {Component} from 'react';
import './App.css';
import Stations from "./ui/Stations";
import Buses from "./ui/Buses";
import BusesTimes from "./ui/BusesTimes";
import {isMobile} from './utils/env'
import classNames from 'classnames';
import {initializeGA} from "./utils/GA";
import {stationBususHash} from "./data/Buses";

class App extends Component {

    constructor() {
        super();
        initializeGA();
        this.isMobile = isMobile();
        this.state = {stations: [], buses: [], hasKeyboard: false};
    }

    render() {
        const stationChange = (stations) => {
            this.setState({stations, buses: []})
        };
        const busChange = (buses) => {
            this.setState({buses});
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
                    selectedChanged={stationChange}
                    selectOpened={selectOpened}
                    selectClosed={selectClosed}
                />
                <Buses
                    stations={this.state.stations}
                    selectedChange={busChange}
                    selectOpened={selectOpened}
                    selectClosed={selectClosed}
                />
                {
                    this.state.buses.map(bus => {
                        return <BusesTimes key={stationBususHash(bus.stationId, bus.id)}
                                           stationId={bus.stationId != null ? bus.stationId : this.state.stationId}
                                           busId={bus.id} busNumber={bus.label}/>
                    })
                }
            </div>
        );
    }
}

export default App;
