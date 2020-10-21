import React, { useState } from 'react'
import styled from 'styled-components'
import { Icon, Form, Input, Button } from 'antd'
import { useDispatch } from 'react-redux'
import reduxApi from '../../lib/redux/reduxApi.js'
import { TagStyle } from '../VTheme/VTheme'

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
  const [allowed, setAllowed] = useState(false)
  const [adding, setAdding] = useState(false)
  const { getFieldDecorator } = props.form
  const [aliasList, setAliasList] = useState(props.aliases)
  const [newAliasesList, setNewAliasesList] = useState([])

  const dispatch = useDispatch()

  const validateAlias = (rule, value, callback) => {
    const trimmedTag = value.trim().toLowerCase()
    let callbackText = ''
    if (
      aliasList.findIndex(
        (item) => trimmedTag.toLowerCase() === item.toLowerCase()
      ) === -1
    ) {
      setAllowed(true)
      return {
        validateStatus: 'success',
        errorMsg: ''
      }
    }
    callbackText = 'This alias is already on the list'
    callback(callbackText)
    setAllowed(false)
    return {
      validateStatus: 'error',
      errorMsg: 'An alias with this name already exists'
    }
  }

  const addAlias = async (aliasToAdd) => {
    await dispatch(
      reduxApi.actions.aliases.post(
        { id: props.tag },
        { body: JSON.stringify({ aliasToAdd: aliasToAdd }) }
      )
    )
    await dispatch(reduxApi.actions.aliases.get())
    setAliasList(...aliasList, aliasToAdd)
    setNewAliasesList((newAliasesList) => [...newAliasesList, aliasToAdd])
    setAdding(false)
  }

  const deleteAlias = async (aliasToDelete) => {
    await dispatch(
      reduxApi.actions.aliases.delete(
        { id: props.tag },
        { body: JSON.stringify({ aliasToDelete: aliasToDelete }) }
      )
    )
    await dispatch(reduxApi.actions.aliases.get())
  }

  if (!adding && aliasList) {
    return (
      <span>
        {props.aliases.map((alias) => {
          return (
            <TagStyle key={alias} closable onClose={() => deleteAlias(alias)}>
              {alias}
            </TagStyle>
          )
        })}
        {newAliasesList.map((alias) => {
          return (
            <TagStyle key={alias} closable onClose={() => deleteAlias(alias)}>
              {alias}
            </TagStyle>
          )
        })}
        <StyledIcon type='plus' onClick={() => setAdding(true)} />
      </span>
    )
  } else {
    return (
      <span>
        {props.aliases.map((alias) => {
          return (
            <TagStyle key={alias} closable onClose={() => deleteAlias(alias)}>
              {alias}
            </TagStyle>
          )
        })}
        {newAliasesList.map((alias) => {
          return (
            <TagStyle key={alias} closable onClose={() => deleteAlias(alias)}>
              {alias}
            </TagStyle>
          )
        })}
        <Form name='basic'>
          <Form.Item name='tag'>
            {getFieldDecorator('tag', {
              rules: [
                { required: true, message: 'Please input the tag!' },
                { validator: validateAlias }
              ]
            })(<Input name='tag' />)}
          </Form.Item>
          <Form.Item>
            <StyledButton
              type='primary'
              htmlType='submit'
              disabled={!allowed}
              onClick={() => addAlias(props.form.getFieldValue('tag'))}
            >
              Submit
            </StyledButton>
            <StyledButton type='secondary' onClick={() => setAdding(false)}>
              Cancel
            </StyledButton>
          </Form.Item>
        </Form>
      </span>
    )
  }
}

export default Form.create()(AddAlias)
