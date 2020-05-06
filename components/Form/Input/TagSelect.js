import { Select } from 'antd'
// import PropTypes from 'prop-types'
import React from 'react'
import { TagStyle } from '../../VTheme/VTheme'

const { Option } = Select

/**
 * @param {{ values: string[], onChange: (newValue: string[]) => {}, value: string[] }} props
 */
export const TagSelect = ({ values, onChange, value, placeholder }, ref) => {
  const addTag = tag => onChange(value.concat(tag))
  const removeTag = removedTag => onChange(value.filter(tag => tag !== removedTag))
  const unselectedTags = values.filter(val => !value.includes(val))

  return (
    <>
      <Select style={{ width: '100%' }} showSearch value={undefined} placeholder={placeholder} onChange={addTag}>
        {unselectedTags.map(val => <Option key={val}>{val}</Option>)}
      </Select>
      {value && value.map(tag =>
        <TagStyle
          key={tag}
          closable
          onClose={() => removeTag(tag)}
        >{tag}
        </TagStyle>)}
    </>
  )
}

// TagSelect.propTypes = {
//   // The select items
//   values: PropTypes.arrayOf(PropTypes.string).isRequired,
//   // When a tag is selected and the set of tags changes
//   onChange: PropTypes.func,
//   // The tags
//   value: PropTypes.arrayOf(PropTypes.string),
//   placeholder: PropTypes.string
// }

export default TagSelect
