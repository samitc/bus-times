import React, {Component} from "react"
import Buses from "../data/Buses";

class BusesTimes extends Component {
    constructor() {
        super();
        this.state = {
            busesTimes: []
        }
    }

    componentDidMount() {
        if (this.props.stationId !== null && this.props.busId != null) {
            Buses.getBusesTimes(this.props.stationId, this.props.busId).then(busesTimes => this.setState({busesTimes}))
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.stationId !== prevProps.stationId || this.props.busId !== prevProps.busId) {
            this.componentDidMount()
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
        return 'האוטובוס אמור להגיע בשעה: ' + this.timeToString(busTime) + ' והוא הגיע ' + busCount + ' פעמים בשעה הזו';
    }

    render() {
        return (
            <div>
                <ul>
                    {this.state.busesTimes.map(value =>
                        <li key={value.id}>{BusesTimes.busTimeToString(value.time, value.count)}</li>)}
                </ul>
            </div>
        )
    }
}

export default BusesTimes;