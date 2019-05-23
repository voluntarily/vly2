/*
  Dumb component. Contains information about a volunteer's interest in an opportunity. Unlike InterestItem, this one is a Form allowing state changes.
*/

import React, { Component } from 'react'
import { Button, Col, Popconfirm, Form, Row } from 'antd'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import TextArea from 'antd/lib/input/TextArea';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class RegisterInterestItem extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isFormVisible: false
    }
  }

  componentDidMount() {
    this.props.form.validateFields()
  }

  handleChangeStateButtonClicked(e) {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('success!')
        // console.log(values)
        const interest = this.props.interest
        interest.comment = values.comment
        interest.status = this.getNextStatus()

        this.props.onChangeStatus(interest)
      }
      else {
        // console.log(err)
      }
    })
  }

  handleWithdrawButtonClicked(e) {
    e.preventDefault()
    this.props.onWithdraw(this.props.interest)
  }

  getNextStatus() {
    switch (this.props.interest.status) {
      case null:
        return 'interested'

      case 'invited':
        return 'committed'
    }
  }

  // Returns some config options for this component, depending on the state of the interest we're viewing.
  getOptions() {

    const options = {
      headerAlwaysVisible: true,
      headingText: '',
      subHeadingText: '',
      nextStateButtonEnabled: true,
      nextStateButtonText: '',
      withdrawInterestButtonEnabled: true,
      withdrawInterestButtonText: 'Withdraw Interest',
      formAlwaysVisible: true,
      showFormButtonText: '',
      hideFormButtonText: 'Cancel',
      commentsEditable: false,
      commentsPlaceholderText: ''
    }

    switch (this.props.interest.status) {

      case null:
        options.headerAlwaysVisible = false
        options.headingText = 'How do you want to get involved?'
        options.subHeadingText = 'Type in how you want to get involved, and an organizer will get in touch with you :)'
        options.nextStateButtonText = 'Get Involved!'
        options.showFormButtonText = 'I\'m Interested'
        options.commentsPlaceholderText = 'How do you want to help out? Got any questions?'
        options.commentsEditable = true
        options.withdrawInterestButtonEnabled = false
        options.formAlwaysVisible = false
        break

      case 'interested':
        options.headingText = 'Thank you for expressing your interest!'
        options.subHeadingText = 'The organizer will be in touch shortly :)'
        options.nextStateButtonEnabled = false
        break

      case 'invited':
        options.headingText = 'You\'ve been invited to participate!'
        options.subHeadingText = 'Please let the organizer know whether you can attend.'
        options.nextStateButtonText = 'I can make it :)'
        options.withdrawInterestButtonText = 'I can\'t make it :('
        break

      case 'committed':
        options.headingText = 'Thank you so much!'
        options.subHeadingText = 'You have agreed to participate in this event!'
        options.nextStateButtonEnabled = false
        break

      case 'declined':
        options.headingText = 'Our apologies'
        options.subHeadingText = 'Thank you so much for registering your interest. However, all available spots for this event have been filled.'
        options.nextStateButtonEnabled = false
        options.withdrawInterestButtonEnabled = false
        break

      case 'completed':
        options.headingText = 'Thank you so much!'
        options.subHeadingText = 'We hope you enjoyed your event, and we look forward to working with you in the future!'
        options.nextStateButtonEnabled = false
        options.withdrawInterestButtonEnabled = false
        break

      case 'cancelled':
        options.headingText = 'Our apologies'
        options.subHeadingText = 'Thank you so much for registering your interest. However, unfortunately this event has been cancelled by the organizer.'
        options.nextStateButtonEnabled = false
        options.withdrawInterestButtonEnabled = false
        break

    }

    return options
  }

  render() {

    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched
    } = this.props.form

    // Options to configure the controls on this page based on the state of the interest.
    const options = this.getOptions()

    return (
      <div>
        <Form>
          {/* Headers */}
          {options.formAlwaysVisible || options.headerAlwaysVisible || this.state.isFormVisible ?
            <Row>
              <h1>{options.headingText}</h1>
              <p>{options.subHeadingText}</p>
            </Row> : null}

          {/* Comment text area */}
          {options.formAlwaysVisible || this.state.isFormVisible ?
            <Row>
              <Col
                xs={{ span: 24 }}
                md={{ span: 12 }}>
                <Form.Item label='Your message'>
                  {getFieldDecorator('comment', {
                    rules: [
                      { required: true, message: 'Comment is required' }
                    ]
                  })(
                    <TextArea
                      readOnly={!options.commentsEditable}
                      placeholder={options.commentsPlaceholderText}></TextArea>
                  )}
                </Form.Item>
              </Col>
            </Row> : null}

          {/* Form buttons */}
          <Row>
            {/* Button to handle positive state change */}
            {options.nextStateButtonEnabled && (options.formAlwaysVisible || this.state.isFormVisible) ?
              <span>
                <Button type='primary' disabled={hasErrors(getFieldsError())} shape='round' onClick={this.handleChangeStateButtonClicked.bind(this)}>
                  {options.nextStateButtonText}
                </Button>
                &nbsp;
            </span> : null}

            {/* Button to handle withdrawal from op */}
            {options.withdrawInterestButtonEnabled && (options.formAlwaysVisible || this.state.isFormVisible) ?
              <span>
                <Popconfirm title='Confirm withdrawal of interest' onConfirm={this.handleWithdrawButtonClicked.bind(this)} okText='Yes' cancelText='No'>
                  <Button type='danger' shape='round' >
                    {options.withdrawInterestButtonText}
                  </Button>
                </Popconfirm>
                {/*<Button type='danger' shape='round' onClick={this.handleWithdrawButtonClicked.bind(this)}>
                  {options.withdrawInterestButtonText}
            </Button>*/}
                &nbsp;
            </span> : null}

            {/* Button to show form */}
            {!options.formAlwaysVisible && !this.state.isFormVisible ?
              <span>
                <Button type='primary' shape='round' onClick={() => this.setState({ isFormVisible: true })}>
                  <FormattedMessage id='claimOp' defaultMessage="I'm Interested" description='Button to show interest in an opportunity on OpDetails page' />
                </Button>
                &nbsp;
            </span> : null}

            {/* Button to hide form */}
            {!options.formAlwaysVisible && this.state.isFormVisible ?
              <span>
                <Button type='secondary' shape='round' onClick={() => this.setState({ isFormVisible: false })}>
                  Cancel
                </Button>
                &nbsp;
            </span> : null}
          </Row>
        </Form>
      </div >
    )

  }

}

RegisterInterestItem.propTypes = {
  interest: PropTypes.shape({
    person: PropTypes.string.isRequired,
    opportunity: PropTypes.string.isRequired,
    comment: PropTypes.string,
    status: PropTypes.string
  }).isRequired,
  form: PropTypes.object,
  onChangeStatus: PropTypes.func.isRequired,
  onWithdraw: PropTypes.func.isRequired
}

export default Form.create({
  name: 'register_interest_form',
  onFieldsChange(props, changedFields) {
    // console.log('onFieldsChange', changedFields)
    // props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      comment: Form.createFormField({ ...props.interest.comment, value: props.interest.comment })
    }
  }
  // onValuesChange (_, values) {
  //   console.log('onValuesChange', values)
  // }
})(RegisterInterestItem)
