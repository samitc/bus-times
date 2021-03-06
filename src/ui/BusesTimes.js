import React, { Component } from "react"
import Buses from "../data/Buses";
import { isMobile } from "../utils/env";
import { timeToString } from "../utils/time";
class BusesTimes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            busesTimes: [],
            fullData: false,
            isShowBusesCount: false
        };
    }

    static filterBuses(fullData, buses) {
        if (fullData) {
            return buses;
        }
        let sum = 0;
        let count = 0;
        for (let bus of buses) {
            sum += bus.count;
            count++;
        }
        let newBuses = [];
        const avg = (sum / count) / 2;
        for (let bus of buses) {
            if (bus.count > avg) {
                newBuses.push(bus)
            }
        }
        return newBuses;
    }

    static busTimeToString(busTime, busCount, isShowCount) {
        let baseString = timeToString(busTime);
        if (!isMobile() && isShowCount) {
            baseString += ` והגיע בשעה הזו ${busCount} פעמים`;
        }
        return baseString;
    }

    updateBusData() {
        if (this.props.stationId !== null && this.props.busId != null) {
            Buses.getBusesTimes(this.props.stationId, this.props.busId).then(busesTimes => this.setState({ busesTimes })).catch(reason => console.log(reason));
        }
    }

    componentDidMount() {
        this.updateBusData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.stationId !== prevProps.stationId || this.props.busId !== prevProps.busId) {
            this.setState({ busesTimes: [] });
            this.updateBusData();
        }
    }

    render() {
        return (
            <div className='Buses-times'>
                <h4>קו {this.props.busNumber}</h4>
                <label className='Buses-times-list-desc'>האוטובוס אמור להגיע בשעות הבאות:</label>
                <br />
                <div className='Arrow-up'>></div>
                <ul className='Buses-times-list'>
                    {BusesTimes.filterBuses(this.state.fullData, this.state.busesTimes).filter(value => value.time >= this.props.filterTimeStart && value.time <= this.props.filterTimeEnd).map(value =>
                        <li className={!isMobile() ? 'Buses-times-list-desktop' : ''}
                            key={value.id}>{BusesTimes.busTimeToString(value.time, value.count, this.state.isShowBusesCount)}</li>)}
                </ul>
                <div className='Arrow-down'>></div>
            </div>
        )
    }
}

export default BusesTimes;