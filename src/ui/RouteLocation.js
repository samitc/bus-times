import React, { Component } from "react"
import ChoseBox from "./ChoseBox";
import { isMobile } from "../utils/env";
import Buses from "../data/Buses";
export default class RouteLocation extends Component {
    constructor() {
        super()
        this.state = {
            selectedCity: null,
            places: [],
            selectedPlace: [],
        }
    }
    reloadPlaces() {
        Buses.getPlaces(this.state.selectedCity.id).then(places => this.setState({ selectedPlace: null, places: places }))
    }
    render() {
        const openKeyboard = () => this.props.keyboard.setHasKeyboard(true)
        const closeKeyboard = () => this.props.keyboard.setHasKeyboard(false)
        return (
            <div>
                <ChoseBox
                    items={this.props.cities}
                    value={this.state.selectedCity}
                    onSelectedChanged={city => this.setState({ selectedCity: city }, this.reloadPlaces)}
                    numOfOptions={isMobile() ? 4 : 7}
                    selectOpened={openKeyboard}
                    selectClosed={closeKeyboard}
                    noValue='בחר עיר'
                    emptyFilterValue='טוען ערים'
                    multi={false}
                />
                <ChoseBox
                    items={this.state.places}
                    value={this.state.selectedPlace}
                    onSelectedChanged={place => {
                        this.setState({ selectedPlace: place })
                        this.props.placeSelected(place)
                    }
                    }
                    numOfOptions={isMobile() ? 4 : 7}
                    selectOpened={openKeyboard}
                    selectClosed={closeKeyboard}
                    noValue='איזור'
                    emptyFilterValue={this.state.selectedCity === null ?
                        'בחר עיר'
                        :
                        'טוען איזורים'}
                    multi={false}
                />
            </div>
        )
    }
}