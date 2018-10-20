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
            selectedItems: []
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
        if (this.props.values != null && this.props.values.length === 0) {
            this.setState({items: [], selectedItems: []})
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
            if (prevProps.values != null) {
                Cookies.remove(this.props.cookieName);
            }
            this.updateComponent()
        }
    }

    render() {
        const itemSelect = (items) => {
            if (items.length === 0) {
                Cookies.remove(this.props.cookieName)
            } else {
                let itemsIds = items.map(item => {
                    return item.id
                });
                Cookies.set(this.props.cookieName, itemsIds.join("|"));
            }
            this.props.selectedChange(items);
            this.setState({selectedItems: items});
        };
        return (
            <ChoseBox
                items={this.state.items}
                value={this.state.selectedItems}
                onSelectedChanged={itemSelect}
                numOfOptions={isMobile() ? 4 : 7}
                noValue={this.props.noValue}
                emptyFilterValue={this.props.emptyFilterValue}
                selectOpened={this.props.selectOpened}
                selectClosed={this.props.selectClosed}
                objectReplacement={this.props.objectReplacement}
                searchReplacement={this.props.searchReplacement}
                multi={true}
            />
        )
    }
}

export default Select;