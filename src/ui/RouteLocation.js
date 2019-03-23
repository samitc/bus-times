import React, { Component } from "react"
import ChoseBox from "./ChoseBox";
import { isMobile } from "../utils/env";
import Buses from "../data/Buses";
import InputChoseBox from "./InputChoseBox";
export default class RouteLocation extends Component {
    constructor() {
        super()
        this.state = {
            places: [],
            selectedPlace: [],
        }
    }
    reloadPlaces(selectedCity) {
        Buses.getPlaces(selectedCity.id).then(places => this.setState({ selectedPlace: null, places: places }))
    }
    render() {
        const openKeyboard = () => this.props.keyboard.setHasKeyboard(true)
        const closeKeyboard = () => this.props.keyboard.setHasKeyboard(false)
        return (
            <div>
                <InputChoseBox
                    items={this.props.cities}
                    onSelectedChanged={city => this.reloadPlaces(city)}
                    keyboard={this.props.keyboard}
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