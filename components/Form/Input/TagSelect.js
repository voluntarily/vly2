import { Select } from 'antd'
// import PropTypes from 'prop-types'
import React from 'react'
import { TagStyle } from '../../VTheme/VTheme'

const { Option } = Select

/**
 * @param {{ options: string[], onChange: (newValue: string[]) => {}, value: string[] }} props
 */
export const TagSelect = ({ options, onChange, value = {}, placeholder }) => {
  if (!options) { console.log('TagSelect:', options, value); return ('No tag options supplied') }
  const addTag = tag => onChange(value.concat(tag))
  const removeTag = removedTag => onChange(value.filter(tag => tag !== removedTag))
  const unselectedTags = options.filter(val => !value.includes(val))
  return (
    <>
      <Select style={{ width: '100%' }} showSearch value={undefined} placeholder={placeholder} onChange={addTag}>
        {unselectedTags.map(opt => <Option key={opt}>{opt}</Option>)}
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
//   options: PropTypes.arrayOf(PropTypes.string).isRequired,
//   // When a tag is selected and the set of tags changes
//   onChange: PropTypes.func,
//   // The tags
//   value: PropTypes.arrayOf(PropTypes.string),
//   placeholder: PropTypes.string
// }

export default TagSelect
