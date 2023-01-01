import React, { Component } from "react";
import ChoseBox from "./ChoseBox";
import { isMobile } from "../utils/env";
export default class InputChoseBox extends Component {
  render() {
    const openKeyboard = () => this.props.keyboard.setHasKeyboard(true);
    const closeKeyboard = () => this.props.keyboard.setHasKeyboard(false);
    return (
      <ChoseBox
        items={this.props.items}
        // value={this.state.selectedItem}
        onSelectedChanged={(item) => {
          //   this.setState({ selectedItem: item });
          this.props.onSelectedChanged(item);
        }}
        numOfOptions={isMobile() ? 4 : 7}
        selectOpened={openKeyboard}
        selectClosed={() => {
          closeKeyboard();
        }}
        noValue={this.props.noValue}
        emptyFilterValue="הקלד כדי לחפש"
        multi={false}
      />
    );
  }
}
