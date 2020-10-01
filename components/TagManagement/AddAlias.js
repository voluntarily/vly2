import React, { useState } from 'react'
import styled from 'styled-components'
import { Icon, Form, Input, Button } from 'antd'

// we use this tag for categories
export const StyledIcon = styled(Icon)`
  width: auto;
  max-width: 100%;

  padding: 0.2rem 0.5rem;
  margin: 0.1rem;
  vertical-align: middle;
  font-size: 1.2rem;
  font-weight: 500;
  background-color: #e8e8e8;
`

const StyledButton = styled(Button)`
  margin-right: 0.5rem;
`

const AddAlias = (props) => {
  const [adding, setAdding] = useState(false)
  const { getFieldDecorator } = props.form

  const handleSubmit = (e) => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        setAdding(false)
        console.log('Received values of form: ', values)
      }
    })
  }

  if (!adding) {
    return <StyledIcon type='plus' onClick={(adding) => setAdding(true)} />
  } else {
    return (
      <Form name='basic' onSubmit={handleSubmit}>
        <Form.Item name='tag'>
          {getFieldDecorator('tag', {
            rules: [{ required: true, message: 'Please input the tag!' }]
          })(<Input name='tag' />)}
        </Form.Item>
        <Form.Item>
          <StyledButton type='primary' htmlType='submit'>
            Submit
          </StyledButton>
          <StyledButton type='secondary' onClick={(adding) => setAdding(false)}>
            Cancel
          </StyledButton>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create()(AddAlias)
