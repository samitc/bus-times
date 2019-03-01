import React, { Component } from "react"
import Stations from './Stations'
import Buses from './Buses'
import Switch from 'react-switch'
import classNames from 'classnames';
import { isMobile } from "../utils/env";
export default class SpecificPanel extends Component {
    constructor() {
        super()
        this.state = {
            isBusesFilter: false,
        }
    }
    componentDidMount() {
        this.keyboardCallback = (hasKeyboard) => this.forceUpdate()
        this.props.keyboard.addCallback(this.keyboardCallback)
    }
    componentWillUnmount() {
        this.props.keyboard.removeCallback(this.keyboardCallback)
    }
    render() {
        const handleBusesFilterChange = () => {
            this.setState({ isBusesFilter: !this.state.isBusesFilter })
            this.props.reset()
        };
        const setKeyboard = (hasKeyboard) => {
            this.props.keyboard.setHasKeyboard(hasKeyboard)
        }
        const introClasses = classNames('App-intro', { 'App-intro-shrink': isMobile() && this.props.keyboard.hasKeyboard() });
        return (
            <div>
                <p className={introClasses}>
                    בחרו תחנה ומספר קו והזמנים יופיעו למטה
                    </p>
                <Stations
                    gps={this.props.gps}
                    buses={this.props.buses}
                    isBusesFilter={this.state.isBusesFilter}
                    selectedChanged={(stations) => this.props.stationChange(stations)}
                    selectOpened={() => setKeyboard(true)}
                    selectClosed={() => setKeyboard(false)}
                />
                <div className='Flex-display'>
                    <div className='Full-width'>
                        <Buses
                            stations={this.props.stations}
                            isBusesFilter={this.state.isBusesFilter}
                            selectedChange={(buses) => this.props.busesChange(buses)}
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