import { AutoComplete, Form } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'

export const TagSearch = (props) => {
  const [inputvalue, setInputValue] = useState('')
  const tags = useSelector(state => state.tags)
  const { getFieldDecorator } = props.form

  const validateTagName = (rule, value, callback) => {
    const trimmedTag = value.trim().toLowerCase()
    let callbackText = ''
    if (tags.data.findIndex(item => trimmedTag.toLowerCase() === item.toLowerCase()) === -1) {
      // setAllowed(true)
      return {
        validateStatus: 'success',
        errorMsg: ''
      }
      // Do not allow submit if the input is the same as the orginal tag
    }
    if (inputvalue === trimmedTag) {
      // setAllowed(false)
      callbackText = 'This is the original name of the tag'
      callback(callbackText)
      return {
        validateStatus: 'error',
        errorMsg: 'This is the original name of the tag'
      }
    }
    callbackText = 'A tag with this name already exists'
    callback(callbackText)
    // setAllowed(false)
    return {
      validateStatus: 'error',
      errorMsg: 'A tag with this name already exists'
    }
  }
  const handleSearch = (value) => {
    setInputValue(value)
    props.handleSearch(value)
  }

  return (
    <span>
      {' '}
      <Form>
        <Form.Item name='tag'>

          {getFieldDecorator('tag', {
            initialValue: inputvalue,
            rules: [{ required: true, message: 'Please input the tag!' }, { validator: validateTagName }]
          })(
            <AutoComplete
              defaultActiveFirstOption // user must select from the dropdown
              onSearch={handleSearch}
              value={inputvalue}
            />)}
        </Form.Item>
      </Form>
    </span>
  )
}

export default Form.create()(TagSearch)
