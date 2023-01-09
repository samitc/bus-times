import React, { Component } from "react";
import Buses from "../data/Buses";
import TimePicker from "rc-time-picker";
import moment from "moment";
import InputChoseBox from "./InputChoseBox";
import LoaderComponent from "./Loader/Loader";
import { event } from "../services/events";
import { sortByDistanceInPlace } from "../utils/Stations";
export default class RoutePanel extends Component {
  constructor() {
    super();
    this.state = {
      originStation: null,
      destinationStation: null,
      time: moment(),
      routeCalculationId: 0,
      isLoading: false,
    };
  }
  static checkEqualNotNull(preVal, val) {
    return val !== null && preVal !== val;
  }
  getStationData(stationId) {
    return this.props.stations.find((station) => stationId === station.id);
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
    const { originStation, destinationStation, time } = this.state;
    if (originStation && destinationStation && time) {
      const routeCalculationId = this.state.routeCalculationId + 1;
      this.setState({ routeCalculationId }, () => {
        event("route", {
          kind: "start route calculation",
          originStationId: originStation.id,
          destinationStationId: destinationStation.id,
          time: RoutePanel.createTime(time),
          routeCalculationId,
        });
        this.calcRoute(routeCalculationId)
          .then((data) => {
            event("route", {
              kind: "found route",
              originStationId: originStation.id,
              destinationStationId: destinationStation.id,
              time: RoutePanel.createTime(time),
              routeCalculationId,
              numOfTrips: data.length,
            });
            this.props.setData(data);
          })
          .catch((err) => {
            let error = err;
            if (err.httpCode === 404) {
              error = new Error("לא נמצא מסלול");
            }
            event("route", {
              kind: "error",
              reason: error.message,
              originStationId: originStation.id,
              destinationStationId: destinationStation.id,
              time: RoutePanel.createTime(time),
              routeCalculationId,
            });
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
    const startPointStations = this.state.destinationStation
      ? this.props.stations.filter(
          (station) => station.id !== this.state.destinationStation.id
        )
      : this.props.stations;
    const endPointStations = this.state.originStation
      ? this.props.stations.filter(
          (station) => station.id !== this.state.originStation.id
        )
      : this.props.stations;
    return (
      <div>
        <div>
          <span>נקודת התחלה</span>
          <InputChoseBox
            items={startPointStations}
            onSelectedChanged={(station, options) => {
              const {
                addedOption: addedStation,
                addedIndex,
                removedOption: removedStation,
                input,
              } = options;
              event("routes", {
                kind: "choose start station",
                station: station.id,
                screen: "route",
                input,
                inputLength: input.length,
                stations: station && [station.id],
                ...(addedStation && {
                  addedStation: addedStation.id,
                  addedIndex,
                }),
                ...(removedStation && { removedStation: removedStation.id }),
              });
              this.setState({ originStation: station });
            }}
            noValue="בחר תחנה"
            inputEventData={{
              name: "station select",
              resultLengthKeyName: "numOfFilteredStations",
              data: {
                kind: "filter",
                stationRouteType: "start",
                screen: "route",
                stations: startPointStations.length,
              },
            }}
          />
        </div>
        <div>
          <span>נקודת סיום</span>
          <InputChoseBox
            items={endPointStations}
            onSelectedChanged={(station, options) => {
              const {
                addedOption: addedStation,
                addedIndex,
                removedOption: removedStation,
                input,
              } = options;
              event("routes", {
                kind: "choose stop station",
                station: station.id,
                screen: "route",
                input,
                inputLength: input.length,
                stations: station && [station.id],
                ...(addedStation && {
                  addedStation: addedStation.id,
                  addedIndex,
                }),
                ...(removedStation && { removedStation: removedStation.id }),
              });
              this.setState({ destinationStation: station });
            }}
            noValue="בחר תחנה"
            inputEventData={{
              name: "station select",
              resultLengthKeyName: "numOfFilteredStations",
              data: {
                kind: "filter",
                stationRouteType: "stop",
                screen: "route",
                stations: endPointStations.length,
              },
            }}
          />
        </div>
        <div>
          <span>זמן יציאה</span>
          <TimePicker
            showSecond={false}
            onChange={(time) => {
              event("routes", {
                kind: "choose start time",
                time: RoutePanel.createTime(time),
              });
              this.setState({ time: time });
            }}
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
