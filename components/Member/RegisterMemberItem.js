/*
  Dumb component. Contains information about a volunteer's member in an organisation.
  Unlike MemberItem, this one is a Form allowing state changes.
*/

import { Form } from '@ant-design/compatible'

import '@ant-design/compatible/assets/index.css'

import { Button, Col, Row } from 'antd'
import Input from 'antd/lib/input/Input'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { MemberStatus } from '../../server/api/member/member.constants'

class RegisterMemberItem extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isFormVisible: false
    }
  }

  handleMemberButton (action) {
    const member = this.props.member
    member.validation = this.props.form.getFieldValue('validation')
    this.props.onChangeStatus(member, action)
  }

  // Returns some config options for this component, depending on the state of the member we're viewing.
  getOptions = member => {
    const options = {
      showValidation: false,
      btns: [
        {
          type: 'primary',
          msg: formatMessage({id: 'member.follow.message', defaultMessage: 'Follow this organisation to get information on opportunities and offerings', description: 'Message for volunteer to follow an organisation'}),
          text: formatMessage({id: 'member.follow.button', defaultMessage: 'Follow', description: 'Button for volunteer to follow an organisation'}),
          action: 'follow'
        },
        {
          type: 'secondary',
          msg: formatMessage({id: 'member.join.message', defaultMessage: 'If you are part of this organisation let us know', description: 'Message for volunteer to join an organisation'}),
          text: formatMessage({id: 'member.join.button', defaultMessage: 'Staff Signup', description: 'Button for volunteer to join an organisation'}),
          action: 'join'
        }
      ]
    }

    switch (member.status) {
      case MemberStatus.FOLLOWER:
        options.btns[0] = {
          type: 'primary',
          msg: formatMessage({id: 'member.unfollow.message', defaultMessage: 'You follow this organisation.', description: 'Message for volunteer to unfollow an organisation'}),
          text: formatMessage({id: 'member.unfollow.button', defaultMessage: 'Unfollow', description: 'Button for volunteer to stop following an organisation'}),
          action: 'unfollow'
        }
        break
      case MemberStatus.JOINER:
        options.showValidation = true
        options.btns = [
          {
            type: 'primary',
            msg: null,
            text: formatMessage({id: 'member.validate.button', defaultMessage: 'Validate', description: 'Button to confirm validation of volunteer to join an organisation'}),
            action: 'validate'
          },
          {
            type: 'secondary',
            msg: null,
            text: formatMessage({id: 'member.unjoin.button', defaultMessage: 'Cancel', description: 'Button to cancel validation of volunteer to join an organisation'}),
            action: 'unjoin'
          }
        ]
        break
      case MemberStatus.VALIDATOR:
        options.btns = [{
          type: 'secondary',
          msg: formatMessage({id: 'member.validating.message', defaultMessage: 'Your confirmation as a member of this organisation is in progess', description: 'Message for volunteer being validated for an organisation'}),
          text: formatMessage({id: 'member.cancelvalidate.button', defaultMessage: 'Cancel Join', description: 'Button to cancel validation of volunteer to join an organisation'}),
          action: 'unjoin'
        }]
        break
      case MemberStatus.MEMBER:
        options.btns = [{
          type: 'primary',
          msg: formatMessage({id: 'member.member.message', defaultMessage: 'You are a member of this organisation', description: 'Message for volunteer being validated for an organisation'}),
          text: formatMessage({id: 'member.leave.button', defaultMessage: 'Leave Organisation', description: 'Button for volunteer to cancel join an organisation'}),
          action: 'leave'
        }]
        break
      case MemberStatus.ORGADMIN:
        options.btns = []
        break
    }

    return options
  }

  render () {
    const { getFieldDecorator } = this.props.form
    // Options to configure the controls on this page based on the state of the member.
    const options = this.getOptions(this.props.member)

    return (
      <Form>
        {/* Validation text area */}
        {options.showValidation &&
          <Row>
            <Col
              xs={{ span: 24 }}
              md={{ span: 12 }}
            >
              <Form.Item label='Enter your organisations validation code'>
                {getFieldDecorator('validation')(<Input />)}
              </Form.Item>
            </Col>
          </Row>}

        {/* Form buttons */}
        <Row>
          {options.btns.map((btn, index) => {
            return (
              <Button key={index} type={btn.type} shape='round' onClick={this.handleMemberButton.bind(this, btn.action)}>
                {btn.text}
              </Button>
            )
          })}
        </Row>
      </Form>

    )
  }
}
// Ensures the correct properties are being supplied to this component
RegisterMemberItem.propTypes = {
  member: PropTypes.shape({
    person: PropTypes.any.isRequired,
    validation: PropTypes.string,
    status: PropTypes.string
  }).isRequired,
  form: PropTypes.object,
  onChangeStatus: PropTypes.func.isRequired
}

// Adds form logic to this component
export default Form.create({
  name: 'register_member_form',
  mapPropsToFields (props) {
    return {
      validation: Form.createFormField({ ...props.member.validation, value: props.member.validation })
    }
  }
})(RegisterMemberItem)
