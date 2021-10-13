import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Input, Button } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const RemoveItemButton = styled.button`
  background: none;
  border: none;
  width: 32px;
  margin-left: 6px;
  cursor: pointer;
`
const ItemInputWithDelete = styled(Input)`
  width: calc(100% - 38px);
`

export class DynamicFieldSet extends React.Component {
  /**
   * Gets the set of field values from the associated form.
   * @returns {string[]} The list of values.
   */
  getValues () {
    return this.props.form.getFieldValue(this.props.field) || []
  }

  /**
   * Sets the set of field values on the associated form.
   * @param {string[]} values The set of values.
   */
  setValues (values) {
    this.props.form.setFieldsValue({ [this.props.field]: values })
  }

  /**
   * Removes an item.
   * @param {number} index The index of the item to remove.
   */
  remove (index) {
    const value = this.getValues()

    this.setValues(value.filter((key, i) => i !== index))
  }

  /**
   * Adds an additional item.
   */
  add () {
    this.setValues(this.getValues().concat(''))
  }

  onChange (index, value) {
    const values = this.getValues()
    values[index] = value

    this.setValues(values)
  }

  render () {
    this.props.form.getFieldDecorator(this.props.field, { initialValue: [] })

    const values = this.getValues()
    // Choose between just an <input /> element and one with the delete <button />
    const FormItem = values.length > 1
      ? ItemInputWithDelete
      : Input

    const formItems = values.map((value, index) => (
      <Form.Item key={index}>
        <FormItem
          value={values[index]}
          placeholder={this.props.placeholder}
          onChange={event => this.onChange(index, event.target.value)}
        />

        {values.length > 1
          ? (
            <RemoveItemButton
              type='button'
              className='dynamic-delete-button'
              title={this.props.removeTooltip || undefined}
              onClick={() => this.remove(index)}
            >
              <MinusCircleOutlined />
            </RemoveItemButton>)
          : null}
      </Form.Item>
    ))

    return (
      <>
        {formItems}
        <Form.Item>
          <Button
            className='ant-btn-primary ant-btn-round ant-btn-lg'
            block
            onClick={() => this.add()}
          >
            <PlusOutlined /> {this.props.addItemText || 'Add item'}
          </Button>
        </Form.Item>
      </>
    )
  }
}

DynamicFieldSet.propTypes = {
  field: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  addItemText: PropTypes.string,
  removeTooltip: PropTypes.string
}
