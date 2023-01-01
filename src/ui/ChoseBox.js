import { Component } from "react";
import React from "react";
import SelectComponent from "./Select/SelectComponent";

class ChoseBox extends Component {
  static stringMatch(str, match) {
    return str.indexOf(match) !== -1;
  }

  selectFilter(object, search) {
    if (ChoseBox.stringMatch(object.label, search)) {
      return true;
    } else {
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
    const inputChange = (inp) => {
      if (this.props.onInputChange !== undefined) {
        this.props.onInputChange(inp);
      }
    };
    return (
      this.props.items !== null && (
        <SelectComponent
          items={this.props.items}
          placeholder={this.props.noValue}
          onValueChange={this.props.onSelectedChanged}
          emptyFilterValue={this.props.emptyFilterValue}
          onOpen={this.props.selectOpened}
          onClose={this.props.selectClosed}
          value={this.props.value}
          isMulti={this.props.multi}
          onInputChange={inputChange}
          filterFunction={this.selectFilter.bind(this)}
          maxShownItems={this.props.numOfOptions}
          maxItems={50}
        />
      )
    );
  }
}

export default ChoseBox;
