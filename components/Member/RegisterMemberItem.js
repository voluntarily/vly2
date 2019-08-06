/*
  Dumb component. Contains information about a volunteer's member in an organisation.
  Unlike MemberItem, this one is a Form allowing state changes.
*/

import { Button, Col, Form, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { MemberStatus } from '../../server/api/member/member.constants'

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class RegisterMemberItem extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isFormVisible: false
    }
  }

  componentDidMount () {
    this.props.form.validateFields()
  }

  handleMemberButton (e) {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const member = this.props.member
        member.validation = values.validation

        this.props.onChangeStatus(member)
      } else {
        // console.log(err)
      }
    })
  }

  render () {
    const {
      getFieldDecorator, getFieldsError
    } = this.props.form

    // Options to configure the controls on this page based on the state of the member.
    const options = getOptions(this.props.member)

    return (
      <div>
        <Form>
          {/* Validation text area */}
          {options.showValidation && <Row>
            <Col
              xs={{ span: 24 }}
              md={{ span: 12 }}>
              <Form.Item label='Enter your organisations validation code'>
                {getFieldDecorator('validation', {
                  rules: [
                    { required: true, message: 'Validation is required' }
                  ]
                })(
                  <TextArea
                    readOnly={!options.validationsEditable}
                    placeholder={options.validationsPlaceholderText} />
                )}
              </Form.Item>
            </Col>
          </Row> }

          {/* Form buttons */}
          <Row>
            {/* Follow Button */}
            {options.followButtonEnabled &&
              <span>
                <Button type='primary' shape='round' onClick={this.handleMemberButton.bind(this, options.followAction)}>
                  {options.followButtonText}
                </Button>
                &nbsp;
              </span> }

            {/* Join Button */}
            {options.joinButtonEnabled &&
            <span>
              <Button type='primary' shape='round' onClick={this.handleMemberButton.bind(this, options.joinAction)}>
                {options.joinButtonText}
              </Button>
                &nbsp;
            </span> }
          </Row>
        </Form>
      </div >
    )
  }
}

// Ensures the correct properties are being supplied to this component
RegisterMemberItem.propTypes = {
  member: PropTypes.shape({
    person: PropTypes.any.isRequired,
    organisation: PropTypes.any.isRequired,
    validation: PropTypes.string,
    status: PropTypes.string
  }).isRequired,
  form: PropTypes.object,
  onChangeStatus: PropTypes.func.isRequired
}

// Adds form logic to this component
export default Form.create({
  name: 'register_member_form',
  onFieldsChange (props, changedFields) {
    // console.log('onFieldsChange', changedFields)
    // props.onChange(changedFields);
  },
  mapPropsToFields (props) {
    return {
      validation: Form.createFormField({ ...props.member.validation, value: props.member.validation })
    }
  }
})(RegisterMemberItem)

// Returns some config options for this component, depending on the state of the member we're viewing.
function getOptions (member) {
  const options = {
    followButtonEnabled: true,
    followButtonText: <FormattedMessage id='member.follow.button' defaultMessage='Follow' description='Button for volunteer to follow an organisation' />,
    followAction: 'follow',
    joinButtonEnabled: true,
    joinButtonText: <FormattedMessage id='member.join.button' defaultMessage='Join' description='Button for volunteer to join an organisation' />,
    joinAction: 'join',
    showValidation: false
  }

  switch (member.status) {
    case MemberStatus.FOLLOWER:
      options.followButtonEnabled = true
      options.followButtonText = <FormattedMessage id='member.unfollow.button' defaultMessage='Unfollow' description='Button for volunteer to stop following an organisation' />
      break
    case MemberStatus.JOINER:
      options.showValidation = false
      options.joinButtonText = <FormattedMessage id='member.joiner.button' defaultMessage='Validate' description='Button to confirm validation of volunteer to join an organisation' />
      break
    case MemberStatus.MEMBER:
      options.followButtonEnabled = false
      options.joinButtonText = <FormattedMessage id='member.canceljoin.button' defaultMessage='Leave' description='Button for volunteer to cancel join an organisation' />
      break
  }

  return options
}
