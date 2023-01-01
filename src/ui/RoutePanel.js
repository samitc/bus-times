import React, { Component } from "react";
import Buses from "../data/Buses";
import TimePicker from "rc-time-picker";
import moment from "moment";
import { getLocation } from "../services/Gps";
import InputChoseBox from "./InputChoseBox";
import LoaderComponent from "./Loader/Loader";
import { sortByDistanceInPlace } from "../utils/Stations";
export default class RoutePanel extends Component {
  constructor() {
    super();
    this.state = {
      stations: [],
      originStation: null,
      destinationStation: null,
      time: moment(),
      routeCalculationId: 0,
      isLoading: false,
    };
  }
  componentDidMount() {
    Buses.getAllStations().then((stations) => {
      this.setState({ stations });
      getLocation()
        .then((location) => {
          const stationsByDistance = stations.slice();
          sortByDistanceInPlace(stationsByDistance, location);
          this.setState({ stations: stationsByDistance });
        })
        .catch((err) => this.setState({ appError: err }));
    });
  }
  static checkEqualNotNull(preVal, val) {
    return val !== null && preVal !== val;
  }
  getStationData(stationId) {
    return this.state.stations.find((station) => stationId === station.id);
  }
  async calcRoute(routeCalculationId) {
    this.setState({ isLoading: true });
    this.props.onError();
    const data = [];
    try {
      const jsonRoutesArray = await Buses.getRoutes(
        this.state.originStation.id,
        this.state.destinationStation.id,
        RoutePanel.createTime(this.state.time)
      );
      for (let stop of jsonRoutesArray) {
        const bus = stop.busId && { id: stop.busId, label: stop.busNumber };
        data.push({
          originStation: this.getStationData(stop.originStationId),
          destinationStation: this.getStationData(stop.destinationStationId),
          bus,
          destinationTime: stop.destinationTime,
          originTime: stop.originTime,
        });
      }
    } finally {
      if (this.state.routeCalculationId === routeCalculationId) {
        this.setState({ isLoading: false });
      }
    }
    return data;
  }
  getRoute() {
    if (
      this.state.originStation &&
      this.state.destinationStation &&
      this.state.time
    ) {
      const routeCalculationId = this.state.routeCalculationId + 1;
      this.setState({ routeCalculationId }, () => {
        this.calcRoute(routeCalculationId)
          .then((data) => {
            this.props.setData(data);
          })
          .catch((err) => {
            let error = err;
            if (err.httpCode === 404) {
              error = new Error("לא נמצא מסלול");
            }
            this.props.onError(error);
          });
      });
    }
  }
  componentDidUpdate(_prevProps, prevState) {
    if (
      prevState?.originStation?.id !== this.state?.originStation?.id ||
      prevState?.destinationStation?.id !==
        this.state?.destinationStation?.id ||
      (prevState.time !== null && prevState.time.diff(this.state.time) !== 0)
    ) {
      this.getRoute();
    }
  }
  static createTime(time) {
    if (time !== null) {
      time = time.diff(moment().startOf("day"), "seconds");
    }
    return time;
  }
  render() {
    return (
      <div>
        <div>
          <span>נקודת התחלה</span>
          <InputChoseBox
            items={
              this.state.destinationStation
                ? this.state.stations.filter(
                    (station) => station.id !== this.state.destinationStation.id
                  )
                : this.state.stations
            }
            keyboard={this.props.keyboard}
            onSelectedChanged={(station) =>
              this.setState({ originStation: station })
            }
            noValue="בחר תחנה"
          />
        </div>
        <div>
          <span>נקודת סיום</span>
          <InputChoseBox
            items={
              this.state.originStation
                ? this.state.stations.filter(
                    (station) => station.id !== this.state.originStation.id
                  )
                : this.state.stations
            }
            keyboard={this.props.keyboard}
            onSelectedChanged={(station) =>
              this.setState({ destinationStation: station })
            }
            noValue="בחר תחנה"
          />
        </div>
        <div>
          <span>זמן יציאה</span>
          <TimePicker
            showSecond={false}
            onChange={(time) => this.setState({ time: time })}
            use12Hours={false}
            value={this.state.time}
            allowEmpty={false}
          />
        </div>
        <LoaderComponent isLoading={this.state.isLoading} />
      </div>
    );
  }
}
