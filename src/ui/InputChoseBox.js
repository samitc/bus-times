import React, { Component } from "react";
import ChoseBox from "./ChoseBox";
import { isMobile } from "../utils/env";
import { event } from "../services/events";
export default class InputChoseBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      selectedItem: null,
    };
  }
  render() {
    const { inputEventData } = this.props;
    const inputChanged = (input) => {
      let newState = {};
      let newItems = [];
      if (input.length <= 2) {
        if (this.state.items.length > 0) {
          newItems = [];
          newState.selectedItem = null;
        }
      } else {
        for (let item of this.props.items) {
          if (item.label.includes(input)) {
            newItems.push(item);
          }
        }
      }
      this.setState({ items: newItems, ...newState });
      if (inputEventData) {
        const {
          name: eventName,
          data: eventData,
          resultLengthKeyName,
        } = inputEventData;
        event(eventName, {
          input,
          ...eventData,
          ...(newItems && { [resultLengthKeyName]: newItems.length }),
        });
      }
    };
    const openKeyboard = () => this.props.keyboard.setHasKeyboard(true);
    const closeKeyboard = () => this.props.keyboard.setHasKeyboard(false);
    return (
      <ChoseBox
        items={this.state.items}
        onInputChange={inputChanged}
        value={this.state.selectedItem}
        onSelectedChanged={(item) => {
          this.setState({ selectedItem: item });
          this.props.onSelectedChanged(item);
        }}
        numOfOptions={isMobile() ? 4 : 7}
        selectOpened={openKeyboard}
        selectClosed={() => {
          closeKeyboard();
          if (this.state.selectedItem === null) {
            this.setState({ items: [] });
          }
        }}
        noValue={this.props.noValue}
        emptyFilterValue="הקלד כדי לחפש"
        multi={false}
      />
    );
  }
}
