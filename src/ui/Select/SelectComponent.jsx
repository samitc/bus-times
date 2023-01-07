import React, { useMemo, useState, useCallback } from "react";
import Select from "react-select";
const SIZE_OF_OPTION = 34;
const LAST_OPTION_MARGIN = 14;
export default function SelectComponent({
  items,
  value,
  maxShownItems,
  isMulti,
  placeholder,
  emptyFilterValue,
  filterFunction,
  onOpen,
  onClose,
  onValueChange,
  onInputChange,
  onFilteredItemsChanged,
  maxItems,
}) {
  const [input, setInput] = useState("");
  const inputChange = (input, action) => {
    if (action.action === "input-change") {
      setInput(input);
      onInputChange && onInputChange(input);
    }
  };
  maxShownItems = maxShownItems || 4;
  const maxHeight = maxShownItems * SIZE_OF_OPTION + LAST_OPTION_MARGIN;
  const filteredItems = useMemo(() => {
    const filteredItems =
      items && filterFunction
        ? items.filter((item) => filterFunction(item, input))
        : items;
    onFilteredItemsChanged &&
      input &&
      onFilteredItemsChanged(filteredItems, { input, maxItems });
    return filteredItems;
  }, [items, filterFunction, input]);
  const shownItems = useMemo(() => {
    return filteredItems && maxItems
      ? filteredItems.slice(0, maxItems)
      : filteredItems;
  }, [filteredItems, maxItems]);
  const onChange = useCallback((selectedOptions, changeType) => {
    if (onValueChange) {
      const { action, option, removedValue } = changeType;
      if (action === "select-option") {
        onValueChange(selectedOptions, {
          addedOption: option,
          addedIndex: items.findIndex((item) => item === option),
          input,
        });
      } else if (action === "remove-value") {
        onValueChange(selectedOptions, { removedOption: removedValue, input });
      } else {
        onValueChange(selectedOptions, { input });
      }
    }
  });
  return (
    <Select
      options={shownItems || []}
      value={value}
      maxMenuHeight={maxHeight}
      placeholder={placeholder}
      noOptionsMessage={() => emptyFilterValue}
      onInputChange={inputChange}
      onChange={onChange}
      isMulti={isMulti}
      onMenuOpen={onOpen}
      onMenuClose={onClose}
      hideSelectedOptions={true}
      isRtl={true}
    />
  );
}
