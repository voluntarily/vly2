import { Icon, Typography, Input, Form, Button } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import reduxApi from '../../lib/redux/reduxApi.js'

const TagWrapper = styled.div`
  display: inline-block;
`
const StyledIcon = styled(Icon)`
  font-size: 1rem;
  margin-right: 0.5rem;
  &:hover {
    color: #6549aa;
    font-size: 1.2rem;
  }
`

const StyledButton = styled(Button)`
  margin-right: 0.5rem;
`

const EditableTagCell = (props) => {
  const [editing, setEditing] = useState(false)
  const [edited, setEdited] = useState(false)
  const [allowed, setAllowed] = useState(false)
  const { getFieldDecorator } = props.form
  const [tag] = useState(props.tag)
  const tags = useSelector(state => state.tags)
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('HANDLE SUBMIT')
  }

  const validateTagName = (rule, value, callback) => {
    const trimmedTag = value.trim().toLowerCase()
    let callbackText = ''
    if (tags.data.findIndex(item => trimmedTag.toLowerCase() === item.toLowerCase()) === -1) {
      setAllowed(true)
      return {
        validateStatus: 'success',
        errorMsg: ''
      }
      // Do not allow submit if the input is the same as the orginal tag
    }
    if (tag === trimmedTag) {
      setAllowed(false)
      callbackText = 'This is the original name of the tag'
      callback(callbackText)
      return {
        validateStatus: 'error',
        errorMsg: 'This is the original name of the tag'
      }
    }
    callbackText = 'A tag with this name already exists'
    callback(callbackText)
    setAllowed(false)
    return {
      validateStatus: 'error',
      errorMsg: 'A tag with this name already exists'
    }
  }

  const editTagName = async (edit) => {
    setEditing(false)
    await dispatch(reduxApi.actions.tagManagement.put({ id: props.tag }, { body: JSON.stringify({ edittedTag: edit }) }))
    await dispatch(reduxApi.actions.aliases.get())
    setEdited(true)
  }
  if (!editing) {
    return (
      <TagWrapper>
        {!edited &&
          <Typography>
            {props.tag}
            <StyledIcon
              type='edit'
              onClick={() => setEditing((editing) => true)}
            />
          </Typography>}
        {edited &&
          <Typography>
            {tag}
            <StyledIcon
              type='edit'
              onClick={() => setEditing((editing) => true)}
            />
          </Typography>}
      </TagWrapper>
    )
  } else {
    return (
      <TagWrapper>
        <Form
          name='basic'
          initialValues={{
            tag: tag
          }}
          onSubmit={handleSubmit}
        >
          <Form.Item name='tag'>
            {getFieldDecorator('tag', {
              initialValue: tag,
              rules: [{ required: true, message: 'Please input the tag!' }, { validator: validateTagName }]
            })(<Input name='tag' />)}
          </Form.Item>
          <Form.Item>
            <StyledButton type='primary' htmlType='submit' onClick={e => editTagName(props.form.getFieldValue('tag'))} disabled={!allowed}>Submit</StyledButton>
            <StyledButton
              type='secondary'
              onClick={(editing) => setEditing(false)}
            >Cancel
            </StyledButton>
          </Form.Item>
        </Form>
      </TagWrapper>
    )
  }
}

export default Form.create()(EditableTagCell)
