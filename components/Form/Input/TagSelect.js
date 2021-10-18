import { useState, useEffect } from 'react'
import { Select } from 'antd'
import { TagStyle } from '../../VTheme/VTheme'

const { Option } = Select

/**
 * @param {{ options: string[], onChange: (newValue: string[]) => {}, value: string[] }} props
 */
export const TagSelect = ({ options, onChange, value = {}, placeholder }) => {
  const [unselectedTags, setUnselectedTags] = useState([])
  useEffect(() => {
    setUnselectedTags(options?.filter(val => value !== val))
  }, [value, options])

  if (!options) { return ('No tag options supplied') }
  const addTag = tag => onChange(value.concat(tag))
  const removeTag = removedTag => onChange(value.filter(tag => tag !== removedTag))

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

export default TagSelect
