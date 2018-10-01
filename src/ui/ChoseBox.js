import {Component} from "react"
import React from "react";
import Select from "react-select";

class ChoseBox extends Component {
    render() {
        let numOfOptions = 4;
        let SIZE_OF_OPTION = 34;
        let LAST_OPTION_MARGIN = 14;
        if (this.props.numOfOptions != null) {
            numOfOptions = this.props.numOfOptions;
        }
        return (
            this.props.items !== null &&
            <Select
                maxMenuHeight={numOfOptions * SIZE_OF_OPTION + LAST_OPTION_MARGIN}
                options={this.props.items}
                placeholder={this.props.noValue}
                onChange={this.props.onSelectedChanged}
                noOptionsMessage={() => this.props.emptyFilterValue}
                onMenuOpen={this.props.selectOpened}
                onMenuClose={this.props.selectClosed}
                hideSelectedOptions={true}
                isRtl={true}
            />
        )
    }
}

export default ChoseBox;