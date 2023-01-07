import React, { useState } from "react";
import StationsComponent from "../Stations/StationsComponent";
import BusesComponent from "../Buses/BusesComponent";
import { readBusesData } from "../../utils/Buses";
import { event } from "../../services/events";
export default function SpecificPanelComponent({ stations, onDataChanged }) {
  const [stationValue, setStationValue] = useState(null);
  const [buses, setBuses] = useState(null);
  const [busValue, setBusValue] = useState(null);
  const updateData = (stations, buses) => {
    onDataChanged(
      buses &&
        buses
          .filter((bus) => bus.stationId)
          .map((bus) => {
            const station = stations.find((st) => st.id === bus.stationId);
            return station && { originStation: station, bus };
          })
    );
  };
  const changeBuses = (buses) => {
    setBuses(buses);
    const newBusValues = buses
      ? busValue.filter((v) => buses.some((bus) => v.id === bus.id))
      : null;
    setBusValue(newBusValues);
    updateData(stations, newBusValues);
  };
  const onStationsChanged = (stations, options) => {
    const {
      addedOption: addedStation,
      addedIndex,
      removedOption: removedStation,
      input,
    } = options;
    event("station select", {
      kind: "select",
      screen: "specific",
      input,
      inputLength: input.length,
      stations: stations && stations.map((station) => station.id),
      ...(addedStation && {
        addedStation: addedStation.id,
        addedIndex,
      }),
      ...(removedStation && { removedStation: removedStation.id }),
    });
    setStationValue(stations);
    if (stations) {
      readBusesData(stations).then((buses) => setBuses(buses));
      buses &&
        changeBuses(
          buses.filter((bus) => stations.some((st) => st.id === bus.stationId))
        );
    } else {
      changeBuses(null);
    }
  };
  const onBusesChanged = (buses, options) => {
    const {
      addedOption: addedBus,
      addedIndex,
      removedOption: removedBus,
      input,
    } = options;
    event("bus select", {
      kind: "select",
      screen: "specific",
      input,
      inputLength: input.length,
      buses: buses && buses.map((bus) => bus.id),
      ...(addedBus && {
        addedBus: addedBus.id,
        addedIndex,
      }),
      ...(removedBus && { removedBus: removedBus.id }),
    });
    setBusValue(buses);
    updateData(stations, buses);
  };
  return (
    <div>
      <p className="App-intro">בחרו תחנה ומספר קו והזמנים יופיעו למטה</p>
      <StationsComponent
        stations={stations}
        value={stationValue}
        onValueChange={onStationsChanged}
        isMulti={true}
      />
      <BusesComponent
        buses={buses}
        value={busValue}
        onValueChange={onBusesChanged}
        isMulti={true}
      />
    </div>
  );
}
