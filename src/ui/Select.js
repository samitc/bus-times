import React, {Component} from "react"
import ChoseBox from "./ChoseBox";
import Cookies from "js-cookie";
import {readSelectFromString} from "../utils/SelectUtils";
import {isMobile} from "../utils/env";

class Select extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            selectedItems: [],
            newItem: null
        }
    }

    updateItemsCompareMethod() {
        if (this.props.itemCompare !== undefined) {
            this.itemCompare = this.props.itemCompare;
        } else {
            this.itemCompare = (a, b) => a.value === b.value;
        }
    }

    loadCookie(items) {
        let selectedItems = [];
        let selectedItemsC = Cookies.get(this.props.cookieName);
        if (selectedItemsC != null) {
            selectedItems = readSelectFromString(selectedItemsC, items);
            if (selectedItems.length > 0) {
                this.props.selectedChange(selectedItems)
            }
        }
        this.setState({selectedItems})
    }

    loadData(items) {
        if (this.props.setItems != null) {
            this.props.setItems(items)
        }
        this.setState({items})
    }

    updateComponent() {
        this.updateItemsCompareMethod();
        if (this.props.values != null && this.props.values.length === 0) {
            this.setState({items: [], selectedItems: []});
            this.props.selectedChange([]);
        }
        const loadData = (items) => {
            this.loadData(items);
            this.loadCookie(items);
        };
        this.props.readData(loadData)
    }

    componentDidMount() {
        this.updateComponent()
    }

    componentDidUpdate(prevProps) {
        if (this.props.values !== prevProps.values) {
            this.updateComponent()
        }
    }

    render() {
        const itemSelect = (items) => {
            if (!Array.isArray(items)) {
                items = [items]
            }
            if (items.length === 0) {
                Cookies.remove(this.props.cookieName)
            } else {
                let itemsIds = items.map(item => {
                    return item.id
                });
                Cookies.set(this.props.cookieName, itemsIds.join("|"));
            }
            let newItemIndex = items.indexOf(this.state.newItem);
            let newItem = newItemIndex === -1 ? null : items[newItemIndex];
            this.props.selectedChange(items);
            this.setState({selectedItems: items, newItem});
        };
        const inputChange = (input) => {
            let nInput = parseInt(input, 10);
            if (!isNaN(nInput)) {
                this.setState({newItem: {label: input, value: nInput}});
            }
        };
        const createItems = () => {
            let items = this.state.items;
            if (this.props.newOptionAvilible && this.state.newItem !== null) {
                if (items.find(value => this.itemCompare(value, this.state.newItem)) === undefined) {
                    items = items.concat(this.state.newItem)
                }
            }
            return items;
        };
        return (
            <ChoseBox
                items={createItems()}
                value={this.state.selectedItems}
                onSelectedChanged={itemSelect}
                numOfOptions={isMobile() ? 4 : 7}
                onInputChange={inputChange}
                noValue={this.props.noValue}
                emptyFilterValue={this.props.emptyFilterValue}
                selectOpened={this.props.selectOpened}
                selectClosed={this.props.selectClosed}
                objectReplacement={this.props.objectReplacement}
                searchReplacement={this.props.searchReplacement}
                multi={this.props.isMulti == null ? true : this.props.isMulti}
            />
        )
    }
}

export default Select;