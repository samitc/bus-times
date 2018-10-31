import React, {Component} from "react"
import Buses from "../data/Buses";

class CurBusesTimes extends Component {
    constructor(props) {
        const REFRESH_TIMEOUT = 10000;
        super(props);
        this.state = {
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
            Buses.getBusesCurTimes(this.props.stationId, this.props.busId).then(curTime => this.setState({curTime})).catch(reason => console.log(reason));
        }
    }

    componentDidMount() {
        this.updateBusData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.stationId !== prevProps.stationId || this.props.busId !== prevProps.busId) {
            this.setState({curTime: null});
            this.updateBusData();
        }
    }

    componentWillUnmount() {
        if (this.refreshInterval != null) {
            clearInterval(this.refreshInterval);
        }
    }

    render() {
        const preBus = 'קו ';
        let preStation;
        let postStation;
        if (this.state.curTime === "") {
            preStation = ' לא אמור להגיע ל ';
            postStation = ' בקרוב'
        }
        else {
            preStation = ' מגיע לתחנת ';
            if (this.state.curTime === 0) {
                postStation = ' עכשיו';
            }
            else if (this.state.curTime === 1) {
                postStation = ' בעוד כדקה';
            }
            else {
                postStation = ' בעוד כ ' + this.state.curTime + ' דקות';
            }
        }
        return (
            this.state.curTime != null ?
                <div>{preBus}<b>{this.props.busNumber}</b>{preStation}<b>{this.props.stationName}</b>{postStation}
                </div> : null
        )
    }
}

export default CurBusesTimes;