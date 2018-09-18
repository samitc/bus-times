import {Component} from "react"
import React from "react";
import Select from "react-select";

class ChoseBox extends Component {
    render() {
        return (
            this.props.items !== null &&
            <Select
                options={this.props.items}
                hideSelectedOptions={true}
                placeholder={this.props.noValue}
                onChange={this.props.onSelectedChanged}
                noOptionsMessage={() => this.props.emptyFilterValue}
                isRtl={true}
            />
        )
    }
}

export default ChoseBox;