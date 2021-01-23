import React, { useState, useEffect } from 'react';
import SelectComponent from '../Select/SelectComponent';
import { filterStation } from '../../utils/Stations';
import { isMobile } from '../../utils/env';
export default function StationsComponent({ stations, onInputChange, onValueChange, ...props }) {
    const [selectedStations, setSelectedStations] = useState(null);
    useEffect(() => {
        setSelectedStations(null);
    }, [stations])
    const inputChanged = input => {
        if (input.length <= 2) {
            setSelectedStations(null);
        } else {
            setSelectedStations(stations && stations.filter(station => filterStation(station, input)));
        }
        onInputChange && onInputChange(input);
    };
    const valueChange = stations => {
        setSelectedStations(null);
        onValueChange && onValueChange(stations);
    }
    return <SelectComponent
        items={selectedStations}
        onInputChange={inputChanged}
        onValueChange={valueChange}
        maxShownItems={isMobile() ? 4 : 7}
        placeholder='בחר תחנה'
        emptyFilterValue='הקלד כדי לחפש'
        filterFunctions={filterStation}
        {...props}
    />
}