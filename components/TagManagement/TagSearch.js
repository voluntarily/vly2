import { AutoComplete } from 'antd'
import { useState } from 'react'

export const TagSearch = (props) => {
  const [inputvalue, setInputValue] = useState('')

  const handleSearch = (value) => {
    setInputValue(value)
    props.handleSearch(value)
  }

  return (
    <span>
      {' '}
      <AutoComplete
        defaultActiveFirstOption // user must select from the dropdown
        onSearch={handleSearch}
        value={inputvalue}
      />
    </span>
  )
}

export default TagSearch
