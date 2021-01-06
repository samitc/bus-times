import React, { Component } from "react"
import Stations from './Stations'
import Buses from './Buses'
import Switch from 'react-switch'
import classNames from 'classnames';
import { isMobile } from "../utils/env";
import { changeScreen } from '../utils/GA'
export default class SpecificPanel extends Component {
    constructor() {
        super()
        this.state = {
            stations: [],
            buses: [],
            isBusesFilter: false,
        }
    }
    componentDidMount() {
        this.keyboardCallback = () => this.forceUpdate()
        this.props.keyboard.addCallback(this.keyboardCallback)
    }
    componentWillUnmount() {
        this.props.keyboard.removeCallback(this.keyboardCallback)
    }
    recalcData() {
        const data = [];
        for (let bus of this.state.buses) {
            if (bus.stationId != null) {
                const station = this.state.stations.find(aStation => aStation.id === bus.stationId);
                if (station) {
                    data.push({ destinationStation: station, bus });
                }
            }
        }
        if (data.size === 0) {
            data = null
        }
        this.props.setData(data)
    }
    render() {
        const handleBusesFilterChange = () => {
            changeScreen(this.state.isBusesFilter ? 'real time by station' : 'real time by bus');
            this.setState({ stations: [], buses: [], isBusesFilter: !this.state.isBusesFilter }, this.recalcData)
        };
        const setKeyboard = (hasKeyboard) => {
            this.props.keyboard.setHasKeyboard(hasKeyboard)
        }
        const busChange = (buses) => {
            let stations
            if (this.state.isBusesFilter) {
                stations = []
                buses = buses.length > 0 ? [buses[0]] : []
            } else {
                stations = this.state.stations
            }
            this.setState({ stations, buses }, this.recalcData);
        }
        const introClasses = classNames('App-intro', { 'App-intro-shrink': isMobile() && this.props.keyboard.hasKeyboard() });
        return (
            <div>
                <p className={introClasses}>
                    בחרו תחנה ומספר קו והזמנים יופיעו למטה
                    </p>
                <Stations
                    gps={this.props.gps}
                    buses={this.state.isBusesFilter ? this.state.buses : null}
                    selectedChanged={(stations) => this.setState({ stations: stations }, this.recalcData)}
                    selectOpened={() => setKeyboard(true)}
                    selectClosed={() => setKeyboard(false)}
                />
                <div className='Flex-display'>
                    <div className='Full-width'>
                        <Buses
                            stations={this.state.stations}
                            isBusesFilter={this.state.isBusesFilter}
                            selectedChange={busChange}
                            selectOpened={() => setKeyboard(true)}
                            selectClosed={() => setKeyboard(false)}
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
                    />
                </div>
            </div>
        )
    }
}