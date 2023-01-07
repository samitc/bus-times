import React, { useMemo, useState } from "react";
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
      onFilteredItemsChanged(filteredItems, { input, maxItems });
    return filteredItems;
  }, [items, filterFunction, input]);
  const shownItems = useMemo(() => {
    return filteredItems && maxItems
      ? filteredItems.slice(0, maxItems)
      : filteredItems;
  }, [filteredItems, maxItems]);
  return (
    <Select
      options={shownItems || []}
      value={value}
      maxMenuHeight={maxHeight}
      placeholder={placeholder}
      noOptionsMessage={() => emptyFilterValue}
      onInputChange={inputChange}
      onChange={onValueChange}
      isMulti={isMulti}
      onMenuOpen={onOpen}
      onMenuClose={onClose}
      hideSelectedOptions={true}
      isRtl={true}
    />
  );
}
