import React, {Component} from "react";
import ChoseBox from "./ChoseBox";
import Buses from "../data/Buses";
import {isMobile} from "../utils/env";
import Cookies from 'js-cookie'

class Stations extends Component {
    constructor() {
        super();
        this.state = {
            stations: [],
            selectedValue: null
        }
    }

    loadData(stations) {
        let selectedValue = parseInt(Cookies.get('stationId'), 10);
        selectedValue = stations.find((val) => {
            return selectedValue === val.value
        });
        if (selectedValue != null) {
            this.props.selectedChanged(selectedValue.value)
        }
        this.setState({stations, selectedValue})
    }

    componentDidMount() {
        Buses.getStations().then(stations => this.loadData(stations)).catch(reason => console.log(reason))
    }

    render() {
        const selectedChange = (selectedOption) => {
            this.setState({selectedValue: selectedOption});
            Cookies.set('stationId', selectedOption.value);
            this.props.selectedChanged(selectedOption.value);
        };
        return (
            <ChoseBox
                items={this.state.stations}
                value={this.state.selectedValue}
                onSelectedChanged={selectedChange}
                numOfOptions={isMobile() ? 4 : 7}
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