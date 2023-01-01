import React, { useState, useEffect } from "react";
import SelectComponent from "../Select/SelectComponent";
import { filterStation } from "../../utils/Stations";
import { isMobile } from "../../utils/env";
const MAX_STATION_LENGTH = 50;
export default function StationsComponent({ stations, ...props }) {
  return (
    <SelectComponent
      items={stations}
      maxShownItems={isMobile() ? 4 : 7}
      placeholder="בחר תחנה"
      emptyFilterValue="הקלד כדי לחפש"
      filterFunction={filterStation}
      maxItems={MAX_STATION_LENGTH}
      {...props}
    />
  );
}
