import React, { useState, useEffect } from "react";
import SelectComponent from "../Select/SelectComponent";
import { filterStation } from "../../utils/Stations";
import { isMobile } from "../../utils/env";
import { event } from "../../services/events";
export default function StationsComponent({
  stations,
  onInputChange,
  onValueChange,
  ...props
}) {
  const [selectedStations, setSelectedStations] = useState(null);
  useEffect(() => {
    setSelectedStations(null);
  }, [stations]);
  const inputChanged = (input) => {
    const filteredStations =
      input.length <= 2 || !stations
        ? null
        : stations.filter((station) => filterStation(station, input));
    event("station select", {
      kind: "filter",
      input,
      screen: "specific",
      ...(stations && { numOfStations: stations.length }),
      ...(filteredStations && {
        numOfFilteredStations: filteredStations.length,
      }),
    });
    setSelectedStations(filteredStations);
    onInputChange && onInputChange(input);
  };
  const valueChange = (stations) => {
    setSelectedStations(null);
    onValueChange && onValueChange(stations);
  };
  return (
    <SelectComponent
      items={selectedStations}
      onInputChange={inputChanged}
      onValueChange={valueChange}
      maxShownItems={isMobile() ? 4 : 7}
      placeholder="בחר תחנה"
      emptyFilterValue="הקלד כדי לחפש"
      filterFunctions={filterStation}
      {...props}
    />
  );
}
