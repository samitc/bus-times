import React, { Component } from "react"
import ChoseBox from "./ChoseBox";
import { isMobile } from "../utils/env";
export default class InputChoseBox extends Component {
    constructor() {
        super()
        this.state = {
            items: [],
            selectedItem: null
        }
    }
    render() {
        const inputChanged = (input) => {
            if (input.length <= 2) {
                if (this.state.items.length > 0) {
                    this.setState({ items: [], selectedItem: null })
                }
            } else {
                let newItems = []
                for (let item of this.props.items) {
                    if (item.label.includes(input)) {
                        newItems.push(item)
                    }
                }
                this.setState({ items: newItems })
            }
        }
        const openKeyboard = () => this.props.keyboard.setHasKeyboard(true)
        const closeKeyboard = () => this.props.keyboard.setHasKeyboard(false)
        return (
            <ChoseBox
                items={this.state.items}
                onInputChange={inputChanged}
                value={this.state.selectedItem}
                onSelectedChanged={item => {
                    this.setState({ selectedItem: item })
                    this.props.onSelectedChanged(item)
                }}
                numOfOptions={isMobile() ? 4 : 7}
                selectOpened={openKeyboard}
                selectClosed={() => {
                    closeKeyboard()
                    if (this.state.selectedItem === null) {
                        this.setState({ items: [] })
                    }
                }}
                noValue={this.props.noValue}
                emptyFilterValue='הקלד כדי לחפש'
                multi={false}
            />
        )
    }
}