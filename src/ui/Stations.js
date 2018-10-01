import React, {Component} from "react";
import ChoseBox from "./ChoseBox";
import Buses from "../data/Buses";
import {isMobile} from "../utils/env";

class Stations extends Component {
    constructor() {
        super();
        this.state = {
            stations: [],
            selectedValue: null
        }
    }

    componentDidMount() {
        Buses.getStations().then(stations => this.setState({stations}))
    }

    render() {
        const selectedChange = (selectedOption) => {
            this.setState({selectedValue: selectedOption.value});
            this.props.selectedChanged(selectedOption.value);
        };
        return (
            <ChoseBox
                items={this.state.stations}
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