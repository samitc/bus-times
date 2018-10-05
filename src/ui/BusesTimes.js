import React, {Component} from "react"
import Buses from "../data/Buses";
import {isMobile} from "../utils/env";

class BusesTimes extends Component {
    constructor(props) {
        const REFRESH_TIMEOUT = 10000;
        super(props);
        this.state = {
            busesTimes: [],
            curTime: null,
            fullData: false
        };
        if (this.props.autoRefresh == null || this.props.autoRefresh === true) {
            this.refreshInterval = setInterval(() => {
                this.updateBusData();
            }, REFRESH_TIMEOUT);
        }
    }

    updateBusData() {
        if (this.props.stationId !== null && this.props.busId != null) {
            Buses.getBusesTimes(this.props.stationId, this.props.busId).then(busesTimes => this.setState({busesTimes})).catch(reason => console.log(reason));
            Buses.getBusesCurTimes(this.props.stationId, this.props.busId).then(curTime => this.setState({curTime})).catch(reason => console.log(reason));
        }
    }

    componentDidMount() {
        this.updateBusData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.stationId !== prevProps.stationId || this.props.busId !== prevProps.busId) {
            this.setState({busesTimes: [], curTime: null});
            this.updateBusData();
        }
    }

    componentWillUnmount() {
        if (this.refreshInterval != null) {
            clearInterval(this.refreshInterval);
        }
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

    static pad(d) {
        if (d < 10) {
            return '0' + d;
        }
        else {
            return d;
        }
    }

    static timeToString(time) {
        let d = new Date(0);
        d.setUTCSeconds(time);
        return BusesTimes.pad(d.getUTCHours()) + ':' + BusesTimes.pad(d.getUTCMinutes()) + ':' + BusesTimes.pad(d.getUTCSeconds());
    }

    static busTimeToString(busTime, busCount) {
        let baseString = `האוטובוס אמור להגיע בשעה ${BusesTimes.timeToString(busTime)}`;
        if (!isMobile()) {
            baseString += ` והגיע בשעה הזו ${busCount} פעמים`;
        }
        return baseString;
    }

    static busCurTimeToString(busTime) {
        if (busTime === "") {
            return `האוטובוס לא אמור להגיע בשעה הקרובה`
        }
        else {
            const baseString = `האוטובוס מגיע `;
            const inString = `בעוד כ`;
            if (busTime === 0) {
                return baseString + `עכשיו`
            }
            else if (busTime === 1) {
                return baseString + inString + `דקה`
            }
            else {
                return baseString + inString + ` ${busTime} דקות`
            }
        }
    }

    render() {
        return (
            <div className='Buses-times'>
                <h3>קו {this.props.busNumber}</h3>
                {this.state.curTime != null && <h4>{BusesTimes.busCurTimeToString(this.state.curTime)}</h4>}
                <ul className='Buses-times-list'>
                    {BusesTimes.filterBuses(this.state.fullData, this.state.busesTimes).map(value =>
                        <li className={!isMobile() ? 'Buses-times-list-desktop' : ''}
                            key={value.id}>{BusesTimes.busTimeToString(value.time, value.count)}</li>)}
                </ul>
            </div>
        )
    }
}

export default BusesTimes;