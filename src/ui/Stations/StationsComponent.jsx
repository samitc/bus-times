import React, { useCallback } from "react";
import SelectComponent from "../Select/SelectComponent";
import { filterStation } from "../../utils/Stations";
import { isMobile } from "../../utils/env";
import { event } from "../../services/events";
const MAX_STATION_LENGTH = 50;
export default function StationsComponent({ stations, ...props }) {
  const onFilteredItemsChanged = useCallback(
    (filteredStations, { input }) => {
      event("station select", {
        kind: "filter",
        input,
        screen: "specific",
        ...(stations && { numOfStations: stations.length }),
        ...(filteredStations && {
          numOfFilteredStations: filteredStations.length,
        }),
      });
    },
    [stations]
  );
  return (
    <SelectComponent
      items={stations}
      maxShownItems={isMobile() ? 4 : 7}
      placeholder="בחר תחנה"
      emptyFilterValue="הקלד כדי לחפש"
      filterFunction={filterStation}
      maxItems={MAX_STATION_LENGTH}
      onFilteredItemsChanged={onFilteredItemsChanged}
      {...props}
    />
  );
}
