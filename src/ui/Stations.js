import React, {Component} from "react";
import Buses from "../data/Buses";
import {chooseStation, getObjectId} from "../utils/GA";
import Select from "./Select";

class Stations extends Component {
    render() {
        const selectedChange = (selectedOption) => {
            chooseStation(selectedOption);
            this.props.selectedChanged(selectedOption);
        };
        const readData = (callback) => {
            let fetch;
            if (this.props.isBusesFilter && this.props.buses.length > 0) {
                fetch = Buses.getBusesStations(this.props.buses.map((bus) => getObjectId(bus)))
            } else {
                fetch = Buses.getStations()
            }
            fetch.then(stations => callback(stations)).catch(reason => console.log(reason))
        };
        return (
            <Select
                readData={readData}
                selectedChange={selectedChange}
                values={this.props.isBusesFilter === true ? this.props.buses : null}
                cookieName='stations'
                noValue='בחר תחנה'
                emptyFilterValue='אין תחנות'
                selectOpened={this.props.selectOpened}
                selectClosed={this.props.selectClosed}
                objectReplacement={[{from: 'ת.', to: 'תחנה'}]}
                searchReplacement={[{from: 'ת ', to: 'ת. '}]}
                newOptionAvilible={true}
            />
        )
    }
}

export default Stations;