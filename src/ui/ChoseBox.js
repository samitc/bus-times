import {Component} from "react"
import React from "react";
import Select from "react-select";

class ChoseBox extends Component {
    static stringMatch(str, match) {
        return str.indexOf(match) !== -1;
    }

    selectFilter(object, search) {
        if (ChoseBox.stringMatch(object.label, search)) {
            return true;
        }
        else {
            if (this.props.objectReplacement != null) {
                for (let replacement of this.props.objectReplacement) {
                    let from = replacement.from;
                    let to = replacement.to;
                    if (ChoseBox.stringMatch(object.label.replace(from, to), search)) {
                        return true;
                    }
                }
            }
            if (this.props.searchReplacement != null) {
                for (let replacement of this.props.searchReplacement) {
                    let from = replacement.from;
                    let to = replacement.to;
                    if (ChoseBox.stringMatch(object.label, search.replace(from, to))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

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
                value={this.props.value}
                hideSelectedOptions={true}
                isRtl={true}
                filterOption={this.selectFilter.bind(this)}
            />
        )
    }
}

export default ChoseBox;