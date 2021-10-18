import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Button, Divider, Input, message, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

class SchoolInviteForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const submitSuccess = await this.props.onSubmit(values)

        if (submitSuccess) {
          message.success('Invite sent.')
          this.props.form.resetFields()
        } else {
          message.error('Something went wrong. Please try again.')
        }
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form

    return (
      <div id='school-invite-form'>
        <h1>
          <FormattedMessage
            id='schoolInvite.mainHeading'
            defaultMessage='Invite school'
            description='Heading for the invite school admin UI'
          />
        </h1>

        <Divider />

        <Form onSubmit={this.handleSubmit}>
          <Form.Item label='Name'>
            {getFieldDecorator('inviteeName', {
              rules: [{ required: true, message: 'A name is required' }]
            })(<Input type='text' placeholder='Name of person to invite' />)}
          </Form.Item>
          <Form.Item label='Email'>
            {getFieldDecorator('inviteeEmail', {
              rules: [{ required: true, message: 'An email is required' }]
            })(<Input type='email' placeholder='Email of person to invite' />)}
          </Form.Item>
          <Form.Item label='School'>
            {getFieldDecorator('schoolId', {
              rules: [{ required: true, message: 'A school is required' }]
            })(
              <Select
                showSearch
                placeholder='Select a school'
                filterOption={(input, option) => {
                  const normalisedOption = normaliseString(option.props.children)
                  const normalisedInput = normaliseString(input)

                  return normalisedOption.includes(normalisedInput)
                }}
              >
                {this.props.schoolOptions.map((school) => <Select.Option key={school.schoolId}>{school.name}</Select.Option>)}
              </Select>
            )}
          </Form.Item>
          <Form.Item label='Additional message'>
            {getFieldDecorator('invitationMessage')(
              <Input.TextArea placeholder='Additional message to include in invite email' />
            )}
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' disabled={this.formSubmitting}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

/**
 * Normalises a string to make comparison more robust.
 * For example converts a string like "Ōtorohanga" to "otorohanga"
 *
 * @param rawString Unnormalised string
 * @returns {string} Normalised string
 */
const normaliseString = (rawString) => {
  return rawString
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

SchoolInviteForm.propTypes = {
  form: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  schoolOptions: PropTypes.array.isRequired
}

export default Form.create()(SchoolInviteForm)
