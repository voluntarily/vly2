import { AutoComplete } from "antd";
import React from "react";
import { useState } from "react";
const { Option } = AutoComplete;

export const TagSearch = (props) => {
  const [inputvalue, setInputValue] = useState("");
  const [matchingTags, setMatchingTags] = useState([]);

  const children = matchingTags.map((tag) => <Option key={tag}>{tag}</Option>);
  if (inputvalue.trim() && !matchingTags.includes(inputvalue.trim())) {
    // let the user select what they have typed
    children.unshift(<Option key={inputvalue}>{inputvalue}</Option>);
  }
  const handleSelect = (value) => {
    const trimmedVal = value.trim().toLowerCase();
    if (trimmedVal && !props.value.includes(trimmedVal)) {
      props.onChange([...props.value, trimmedVal]);
    }
  };

  
  const handleSearch = (value) => {
    const val = value.trim()
    if (val && val.endsWith(',')) {
      const trimmedVal = val.slice(0, -1)
      handleSelect(trimmedVal)
    } else {
      const matchingTags = (val && props.existingTags)
        ? props.existingTags
          .filter(tag => tag.toLowerCase().indexOf(val.toLowerCase()) !== -1 && !props.value.includes(tag.toLowerCase()))
        : []
      setInputValue(value)
      setMatchingTags(matchingTags)
    }
  };
  return (
    <span>
      {" "}
      <AutoComplete
        defaultActiveFirstOption // user must select from the dropdown
        onSearch={handleSearch}
        onSelect={handleSelect}
        value={inputvalue}
      >
          {children}
      </AutoComplete>
    </span>
  );
};

export default TagSearch;
