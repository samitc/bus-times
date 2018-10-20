import React, {Component} from "react";
import Buses from "../data/Buses";
import {chooseStation} from "../utils/GA";
import Select from "./Select";

class Stations extends Component {
    render() {
        const selectedChange = (selectedOption) => {
            chooseStation(selectedOption);
            this.props.selectedChanged(selectedOption);
        };
        const readData = (callback) => {
            Buses.getStations().then(stations => callback(stations)).catch(reason => console.log(reason))
        };
        return (
            <Select
                readData={readData}
                selectedChange={selectedChange}
                cookieName='stations'
                noValue='בחר תחנה'
                emptyFilterValue='אין תחנות'
                selectOpened={this.props.selectOpened}
                selectClosed={this.props.selectClosed}
                objectReplacement={[{from: 'ת.', to: 'תחנה'}]}
                searchReplacement={[{from: 'ת ', to: 'ת. '}]}
            />
        )
    }
}

export default Stations;