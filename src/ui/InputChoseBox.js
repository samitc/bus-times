import React, { Component } from "react";
import ChoseBox from "./ChoseBox";
import { isMobile } from "../utils/env";
import { event } from "../services/events";
export default class InputChoseBox extends Component {
  onFilteredItemsChanged = (filteredItems, { input }) => {
    const { inputEventData } = this.props;
    if (inputEventData) {
      const {
        name: eventName,
        data: eventData,
        resultLengthKeyName,
      } = inputEventData;
      event(eventName, {
        input,
        ...eventData,
        ...(filteredItems && { [resultLengthKeyName]: filteredItems.length }),
      });
    }
  };
  render() {
    const openKeyboard = () => this.props.keyboard.setHasKeyboard(true);
    const closeKeyboard = () => this.props.keyboard.setHasKeyboard(false);
    return (
      <ChoseBox
        items={this.props.items}
        onSelectedChanged={(item) => {
          this.props.onSelectedChanged(item);
        }}
        numOfOptions={isMobile() ? 4 : 7}
        selectOpened={openKeyboard}
        selectClosed={() => {
          closeKeyboard();
        }}
        noValue={this.props.noValue}
        emptyFilterValue="הקלד כדי לחפש"
        onFilteredItemsChanged={this.onFilteredItemsChanged}
        multi={false}
      />
    );
  }
}
