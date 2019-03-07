import React, { Component } from "react"
import Buses from "../data/Buses";
import RouteLocation from "./RouteLocation";
export default class RoutePanel extends Component {
    constructor() {
        super()
        this.state = {
            cities: [],
            originPlace: null,
            destinationPlace: null
        }
    }
    componentDidMount() {
        Buses.getCities().then(cities => this.setState({ cities: cities }))
    }
    render() {
        return (
            <div>
                <div>
                    <span>
                        נקודת התחלה
                    </span>
                    <RouteLocation
                        cities={this.state.cities}
                        keyboard={this.props.keyboard}
                        placeSelected={place => this.setState({ originPlace: place })}
                    />
                </div>
                <span>
                    נקודת סיום
                </span>
                <RouteLocation
                    cities={this.state.cities}
                    keyboard={this.props.keyboard}
                    placeSelected={place => this.setState({ destinationPlace: place })}
                />
            </div>
        )
    }
}