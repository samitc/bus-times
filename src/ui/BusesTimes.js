import React, {Component} from "react"
import Buses from "../data/Buses";
import {isMobile} from "../utils/env";

class BusesTimes extends Component {
    constructor(props) {
        const REFRESH_TIMEOUT = 10000
        super(props);
        this.state = {
            busesTimes: [],
            curTime: null
        }
        if (this.props.autoRefresh == null || this.props.autoRefresh === true) {
            this.refreshInterval = setInterval(() => {
                this.updateBusData();
            }, REFRESH_TIMEOUT);
        }
    }

    updateBusData() {
        if (this.props.stationId !== null && this.props.busId != null) {
            Buses.getBusesTimes(this.props.stationId, this.props.busId).then(busesTimes => this.setState({busesTimes}));
            Buses.getBusesCurTimes(this.props.stationId, this.props.busId).then(curTime => this.setState({curTime}));
        }
    }

    componentDidMount() {
        this.updateBusData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.stationId !== prevProps.stationId || this.props.busId !== prevProps.busId) {
            this.updateBusData();
        }
    }
    componentWillUnmount() {
        if (this.refreshInterval != null) {
            clearInterval(this.refreshInterval);
        }
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
            <div>
                {this.state.curTime != null && <h2>{BusesTimes.busCurTimeToString(this.state.curTime)}</h2>}
                <ul className={'Buses-times-list'}>
                    {this.state.busesTimes.map(value =>
                        <li className={!isMobile() ? 'Buses-times-list-desktop' : ''}
                            key={value.id}>{BusesTimes.busTimeToString(value.time, value.count)}</li>)}
                </ul>
            </div>
        )
    }
}

export default BusesTimes;