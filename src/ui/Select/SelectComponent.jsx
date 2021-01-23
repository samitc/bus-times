import React from 'react';
import Select from "react-select";
const SIZE_OF_OPTION = 34;
const LAST_OPTION_MARGIN = 14;
export default function SelectComponent({ items, value, maxShownItems, isMulti, placeholder, emptyFilterValue, filterFunction, onOpen, onClose, onValueChange, onInputChange }) {
    const inputChange = onInputChange && ((input, action) => {
        if (action.action === "input-change") {
            onInputChange(input);
        }
    });
    maxShownItems = maxShownItems || 4;
    const maxHeight = maxShownItems * SIZE_OF_OPTION + LAST_OPTION_MARGIN;
    return <Select
        options={items || []}
        value={value}
        maxMenuHeight={maxHeight}
        placeholder={placeholder}
        noOptionsMessage={() => emptyFilterValue}
        onInputChange={inputChange}
        onChange={onValueChange}
        isMulti={isMulti}
        filterOption={filterFunction}
        onMenuOpen={onOpen}
        onMenuClose={onClose}
        hideSelectedOptions={true}
        isRtl={true}
    />
}