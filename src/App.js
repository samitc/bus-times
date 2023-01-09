import React, { Component } from "react";
import "./App.css";
import BusesTimes from "./ui/BusesTimes";
import { isMobile } from "./utils/env";
import { stationBusesHash } from "./data/Buses";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import CurBusesTimes from "./ui/CurBusesTimes";
import SpecificPanelComponent from "./ui/SpecificPanel/SpecificPanelComponent";
import { getAllStations, sortByDistanceInPlace } from "./utils/Stations";
import Gps from "./services/Gps";
import Switch from "react-switch";
import RoutePanel from "./ui/RoutePanel";
import * as EventsService from "./services/posthog";
import { timeToString } from "./utils/time";
import { event } from "./services/events";
class App extends Component {
  constructor() {
    super();
    EventsService.init();
    this.isMobile = isMobile();
    this.state = {
      busesData: null,
      isRoute: false,
      startTime: 0,
      endTime: 86400,
      appError: null,
      isLoading: false,
      stations: null,
    };
    this.gps = new Gps(10000);
  }
  componentDidMount() {
    this.setState({ isLoading: true });
    getAllStations().then((stations) => {
      this.setState({ stations, isLoading: false });
    });
    this.gps.addCallback(this.locationCallback);
  }
  componentWillUnmount() {
    this.gps.removeCallback(this.gpsCallback);
  }
  static timeToHour(time) {
    return Math.trunc(time / (60 * 60));
  }
  static timeToMinute(time, hour) {
    return Math.trunc(time / 60 - hour * 60);
  }
  locationCallback = (location) => {
    if (location === null) {
      this.setState({ appError: this.gps.getErrorReason() });
    } else {
      const { stations } = this.state;
      const stationsByDistance = stations.slice();
      sortByDistanceInPlace(stationsByDistance, location);
      this.setState({ appError: null, stations: stationsByDistance });
    }
  };
  render() {
    const printBusesTimes = () => {
      const stationBuses = new Map();
      this.state.busesData &&
        this.state.busesData.forEach((data) => {
          const { originStation, bus } = data;
          if (bus) {
            if (!stationBuses.get(originStation.id)) {
              stationBuses.set(originStation.id, []);
            }
            stationBuses.get(originStation.id).push({ originStation, bus });
          }
        });
      const keys = Array.from(stationBuses.keys());
      return keys.map((stationId) => {
        const data = stationBuses.get(stationId);
        const stationName = data[0].originStation.name;
        return (
          <div key={stationId}>
            {keys.length > 1 && <h3 className="Buses-times">{stationName}</h3>}
            {data.map(({ bus }) => (
              <BusesTimes
                key={stationBusesHash(stationId, bus.id)}
                stationId={stationId}
                busId={bus.id}
                busNumber={bus.label}
                filterTimeStart={this.state.startTime}
                filterTimeEnd={this.state.endTime}
              />
            ))}
          </div>
        );
      });
    };
    const printRoute = () => {
      return (
        this.state.busesData && (
          <>
            <div>
              <h2>תיאור המסלול:</h2>
              {this.state.busesData.map((data) => {
                const {
                  destinationStation,
                  originStation,
                  bus = {},
                  originTime,
                } = data;
                const { name: oName } = originStation;
                const { name: dName } = destinationStation;
                const { label } = bus;
                return (
                  <div key={stationBusesHash(destinationStation.id)}>
                    {label ? (
                      <>
                        סע באוטובוס <b>{label}</b> מתחנת <b>{oName}</b> לתחנת{" "}
                        <b>{dName}</b> ויוצא בשעה {timeToString(originTime)}
                      </>
                    ) : (
                      <>
                        לך מתחנת <b>{oName}</b> לתחנת <b>{dName}</b>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            <br />
          </>
        )
      );
    };
    const printCurBusesTimes = () => {
      return (
        this.state.busesData &&
        this.state.busesData.map((data) => {
          const { originStation, bus } = data;
          return (
            bus && (
              <CurBusesTimes
                key={stationBusesHash(originStation.id, bus.id)}
                stationId={originStation.id}
                busId={bus.id}
                busNumber={bus.label}
                stationName={originStation.name}
              />
            )
          );
        })
      );
    };
    const getTimeFromPicker = (time, defaultValue) => {
      if (time === null) {
        return defaultValue;
      }
      let strTime = time.format("HH:mm");
      let strArr = strTime.split(":");
      return (parseInt(strArr[0], 10) * 60 + parseInt(strArr[1], 10)) * 60;
    };
    const createError = () => {
      if (this.state.appError) {
        return <span className="Error">{this.state.appError.message}</span>;
      }
    };
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">זמני אוטובוס</h1>
        </header>
        {createError()}
        <div>
          <label className="Switch-button">חפש לפי מסלול</label>
          <Switch
            checked={this.state.isRoute}
            onChange={() => {
              const isRoute = !this.state.isRoute;
              event("screenPage", { isRoute });
              this.setState({ isRoute, busesData: null });
            }}
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
        {this.state.isRoute ? (
          <RoutePanel
            stations={this.state.stations}
            setData={(data) => this.setState({ busesData: data })}
            onError={(err) => this.setState({ appError: err })}
          />
        ) : (
          <SpecificPanelComponent
            stations={this.state.stations}
            onDataChanged={(data) => this.setState({ busesData: data })}
          />
        )}
        <label>סנן לפי זמן התחלה: </label>
        <TimePicker
          className="Time-picker-filter"
          showSecond={false}
          onChange={(time) => {
            event("time filter", {
              type: "start time",
              time: getTimeFromPicker(time, 86400),
            });
            this.setState({ startTime: getTimeFromPicker(time, 0) });
          }}
          disabledHours={() => {
            const arr = [];
            for (let v = App.timeToHour(this.state.endTime) + 1; v < 24; v++) {
              arr.push(v);
            }
            return arr;
          }}
          disabledMinutes={(h) => {
            const arr = [];
            if (h === App.timeToHour(this.state.endTime)) {
              for (
                let v = App.timeToMinute(this.state.endTime, h) + 1;
                v < 60;
                v++
              ) {
                arr.push(v);
              }
            }
            return arr;
          }}
        />
        <label> וזמן סיום: </label>
        <TimePicker
          className="Time-picker-filter"
          showSecond={false}
          onChange={(time) => {
            event("time filter", {
              type: "end time",
              time: getTimeFromPicker(time, 86400),
            });
            this.setState({ endTime: getTimeFromPicker(time, 86400) });
          }}
          disabledHours={() => {
            const arr = [];
            for (let v = 0; v < App.timeToHour(this.state.startTime); v++) {
              arr.push(v);
            }
            return arr;
          }}
          disabledMinutes={(h) => {
            const arr = [];
            if (h === App.timeToHour(this.state.startTime)) {
              for (
                let v = 0;
                v < App.timeToMinute(this.state.startTime, h);
                v++
              ) {
                arr.push(v);
              }
            }
            return arr;
          }}
        />
        {this.state.isRoute && printRoute()}
        {printCurBusesTimes()}
        {printBusesTimes()}
      </div>
    );
  }
}

export default App;
