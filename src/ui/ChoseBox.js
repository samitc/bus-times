import {Component} from "react"
import React from "react";
import Select from "react-select";

class ChoseBox extends Component {
    render() {
        let NUM_OF_OPTIONS = 4;
        let SIZE_OF_OPTION = 34;
        let LAST_OPTION_MARGIN = 14;
        return (
            this.props.items !== null &&
            <Select
                maxMenuHeight={NUM_OF_OPTIONS * SIZE_OF_OPTION + LAST_OPTION_MARGIN}
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