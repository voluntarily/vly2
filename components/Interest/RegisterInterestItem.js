/*
  Dumb component. Contains information about a volunteer's interest in an opportunity.
  Unlike InterestItem, this one is a Form allowing state changes.
*/

import { Button, Col, Form, Popconfirm, Row } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class RegisterInterestItem extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isFormVisible: false
    }
  }

  componentDidMount () {
    this.props.form.validateFields()
  }

  handleChangeStateButtonClicked (e) {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const interest = this.props.interest
        interest.comment = values.comment

        this.props.onChangeStatus(interest)
      } else {
        // console.log(err)
      }
    })
  }

  handleWithdrawButtonClicked (e) {
    e.preventDefault()
    this.props.onWithdraw(this.props.interest)
  }

  render () {
    const {
      getFieldDecorator, getFieldsError
    } = this.props.form

    // Options to configure the controls on this page based on the state of the interest.
    const options = getOptions(this.props.interest)

    return (
      <div>
        <Form>
          {/* Headers */}
          {options.formAlwaysVisible || options.headerAlwaysVisible || this.state.isFormVisible
            ? <Row>
              <h1>{options.headingText}</h1>
              <p>{options.subHeadingText}</p>
            </Row> : null}

          {/* Comment text area */}
          {options.formAlwaysVisible || this.state.isFormVisible
            ? <Row>
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
                      placeholder={options.commentsPlaceholderText} />
                  )}
                </Form.Item>
              </Col>
            </Row> : null}

          {/* Form buttons */}
          <Row>
            {/* Button to handle positive state change */}
            {options.nextStateButtonEnabled && (options.formAlwaysVisible || this.state.isFormVisible)
              ? <span>
                <Button type='primary' disabled={hasErrors(getFieldsError())} shape='round' onClick={this.handleChangeStateButtonClicked.bind(this)}>
                  {options.nextStateButtonText}
                </Button>
                &nbsp;
              </span> : null}

            {/* Button to handle withdrawal from op */}
            {options.withdrawInterestButtonEnabled && (options.formAlwaysVisible || this.state.isFormVisible)
              ? <span>
                <Popconfirm id='WithdrawInterestPopConfirm' title='Confirm withdrawal of interest' onConfirm={this.handleWithdrawButtonClicked.bind(this)} okText='Yes' cancelText='No'>
                  <Button type='danger' shape='round' >
                    {options.withdrawInterestButtonText}
                  </Button>
                </Popconfirm>
                &nbsp;
              </span> : null}

            {/* Button to show form */}
            {!options.formAlwaysVisible && !this.state.isFormVisible
              ? <span>
                <Button type='primary' shape='round' onClick={() => this.setState({ isFormVisible: true })}>
                  {options.showFormButtonText}
                </Button>
                &nbsp;
              </span> : null}

            {/* Button to hide form */}
            {!options.formAlwaysVisible && this.state.isFormVisible
              ? <span>
                <Button type='secondary' shape='round' onClick={() => this.setState({ isFormVisible: false })}>
                  {options.hideFormButtonText}
                </Button>
                &nbsp;
              </span> : null}
          </Row>
        </Form>
      </div >
    )
  }
}

// Ensures the correct properties are being supplied to this component
RegisterInterestItem.propTypes = {
  interest: PropTypes.shape({
    person: PropTypes.any.isRequired,
    opportunity: PropTypes.object.isRequired,
    comment: PropTypes.string,
    status: PropTypes.string
  }).isRequired,
  form: PropTypes.object,
  onChangeStatus: PropTypes.func.isRequired,
  onWithdraw: PropTypes.func.isRequired
}

// Adds form logic to this component
export default Form.create({
  name: 'register_interest_form',
  onFieldsChange (props, changedFields) {
    // console.log('onFieldsChange', changedFields)
    // props.onChange(changedFields);
  },
  mapPropsToFields (props) {
    return {
      comment: Form.createFormField({ ...props.interest.comment, value: props.interest.comment })
    }
  }
})(RegisterInterestItem)

// Returns some config options for this component, depending on the state of the interest we're viewing.
function getOptions (interest) {
  const options = {
    headerAlwaysVisible: true,
    headingText: '',
    subHeadingText: '',
    nextStateButtonEnabled: true,
    nextStateButtonText: '',
    withdrawInterestButtonEnabled: true,
    withdrawInterestButtonText: <FormattedMessage id='withdrawInterestButton' defaultMessage='Withdraw Interest' description='Button for volunteer to withdraw interest in an opportunity' />,
    formAlwaysVisible: true,
    showFormButtonText: '',
    hideFormButtonText: <FormattedMessage id='registerInterestHideForm' defaultMessage='Cancel' description='Button to hide express-interest form' />,
    commentsEditable: false,
    commentsPlaceholderText: ''
  }

  switch (interest.status) {
    case null:
      options.headerAlwaysVisible = false
      options.headingText = <FormattedMessage id='getInvolvedHeading' defaultMessage='How do you want to get involved?' description='Heading displayed on form allowing volunteer to express interest in an opportunity' />
      options.subHeadingText = <FormattedMessage id='getInvolvedSubHeading' defaultMessage='Type in how you want to get involved, and an organizer will get in touch with you :)' description='Sub-heading displayed on form allowing volunteer to express interest in an opportunity' />
      options.nextStateButtonText = <FormattedMessage id='getInvolvedButton' defaultMessage='Get Involved!' description='Button allowing volunteer to express interest in an opportunity' />
      options.showFormButtonText = <FormattedMessage id='registerInterestShowForm' defaultMessage="I'm Interested" description='Button to allow volunteer to start expressing interest in an opportunity' />
      options.commentsPlaceholderText = 'How do you want to help out? Got any questions?' // Can't use FormattedMessage here, is there something else I can use?
      options.commentsEditable = true
      options.withdrawInterestButtonEnabled = false
      options.formAlwaysVisible = false
      break

    case 'interested':
      options.headingText = <FormattedMessage id='isInterestedHeading' defaultMessage='Thank you for expressing your interest!' description='Heading on express-interest form when volunteer has already expressed interest' />
      options.subHeadingText = <FormattedMessage id='isInterestedSubHeading' defaultMessage='The organizer will be in touch shortly :)' description='Sub-heading on express-interest form when volunteer has already expressed interest' />
      options.nextStateButtonEnabled = false
      break

    case 'invited':
      options.headingText = <FormattedMessage id='isInvitedHeading' defaultMessage="You've been invited to participate!" description='Heading displayed on express-interest form when volunteer has been invited to participate' />
      options.subHeadingText = <FormattedMessage id='isInvitedSubHeading' defaultMessage='Please let the organizer know whether you can attend.' description='Sub-heading displayed on express-interest form when volunteer has been invited to participate' />
      options.nextStateButtonText = <FormattedMessage id='isInvitedAcceptButton' defaultMessage='I can make it :)' description='Allows volunteer to accept invitation to participate in opportunity' />
      options.withdrawInterestButtonText = <FormattedMessage id='isInvitedRejectButton' defaultMessage="I can't make it :(" description='Allows volunteer to withdraw from an opportunity once they have been invited' />
      break

    case 'committed':
      options.headingText = <FormattedMessage id='isCommittedHeading' defaultMessage='Thank you so much!' description='Heading displayed when volunteer has committed to an op' />
      options.subHeadingText = <FormattedMessage id='isCommittedSubHeading' defaultMessage='You have agreed to participate in this event!' description='Sub-heading displayed when volunteer has committed to an op' />
      options.nextStateButtonEnabled = false
      break

    case 'declined':
      options.headingText = <FormattedMessage id='isDeclinedHeading' defaultMessage='Our apologies' description='Heading displayed when volunteer has been declined by opportunity organizer' />
      options.subHeadingText = <FormattedMessage id='isDeclinedSubHeading' defaultMessage='Thank you so much for registering your interest. However, all available spots for this event have been filled.' description='Sub-heading displayed when volunteer has been declined by opportunity organizer' />
      options.nextStateButtonEnabled = false
      options.withdrawInterestButtonEnabled = false
      break

    case 'completed':
      options.headingText = <FormattedMessage id='isCompletedHeading' defaultMessage='Thank you so much!' description='Heading displayed when volunteer has participated in an op' />
      options.subHeadingText = <FormattedMessage id='isCompletedSubHeading' defaultMessage='We hope you enjoyed your event, and we look forward to working with you in the future!' description='Sub-heading displayed when volunteer has participated in an op' />
      options.nextStateButtonEnabled = false
      options.withdrawInterestButtonEnabled = false
      break

    case 'cancelled':
      options.headingText = <FormattedMessage id='isCancelledHeading' defaultMessage='Our apologies' description='Heading displayed to volunteer when opportunity is cancelled by organizer' />
      options.subHeadingText = <FormattedMessage id='isCancelledSubHeading' defaultMessage='Thank you so much for registering your interest. However, unfortunately this event has been cancelled by the organizer.' description='Sub-heading displayed to volunteer when opportunity is cancelled by organizer' />
      options.nextStateButtonEnabled = false
      options.withdrawInterestButtonEnabled = false
      break
  }

  return options
}
