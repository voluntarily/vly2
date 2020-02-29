// /*
//   Dumb component. Contains information about a volunteer's interest in an opportunity.
//   Unlike InterestItem, this one is a Form allowing state changes.
// */

import { Button, Popconfirm, Row } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import RegisterInterestMessageForm from './RegisterInterestMessageForm'

// TODO - move some messages to popup confirmation box
// add a status line for each state
//   You've expressed Interest. You've been invited, You're Committed. etc.
// Add a message organiser button
// put the termsAccepted in the interest record.
// replace the popup with a chance to leave a message - say why you can't make it.

/* Cycle is
1. status message + accept [reject] buttons
2. both buttons show message form - cancel returns, ok accepts and sends
3. popup notification once change is sent - we'll be in touch,
4. email sent
5. display new status
*/

export const RegisterInterestItem = ({
  interest,
  onAccept,
  onReject
}) => {
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (ok, msg) => {
    setShowForm(false)
    if (ok) {
      onAccept(msg, true)
    }
  }

  const handleAcceptClick = (e) => {
    e.preventDefault()
    setShowForm(true)
  }

  const handleRejectClick = (e) => {
    e.preventDefault()
    onReject(interest)
  }

  // Options to configure the controls on this page based on the state of the interest.
  const options = getOptions(interest)

  return (
    <>
      {/* Headers */}
      {options.showHeader && (
        <Row>
          <h4>{options.headingText}</h4>
          <p>{options.subHeadingText}</p>
        </Row>
      )}

      {/* buttons */}
      <Row>
        {/* Button to handle positive state change */}
        {options.showAcceptButton && (
          <Button
            type='primary' shape='round'
            onClick={handleAcceptClick}
          >
            {options.acceptButtonText}
          </Button>
        )}
        {/* Button to handle rejectal from op */}
        {options.showRejectButton && (
          <Popconfirm
            id='RejectInterestPopConfirm'
            title='Confirm rejection of invitation'
            onConfirm={handleRejectClick}
            okText='Yes'
            cancelText='No'
          >
            <Button shape='round'>
              {options.rejectInterestButtonText}
            </Button>
          </Popconfirm>
        )}
      </Row>

      <RegisterInterestMessageForm
        title={options.headingText}
        prevAccepted={interest.termsAccepted}
        onSubmit={handleSubmit}
        placeholder={options.messagePlaceholder}
        visible={showForm}
      />
    </>
  )
}

// Ensures the correct properties are being supplied to this component
RegisterInterestItem.propTypes = {
  interest: PropTypes.shape({
    person: PropTypes.any.isRequired,
    comment: PropTypes.string,
    status: PropTypes.string
  }).isRequired,
  onAccept: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
}

// Returns some config options for this component, depending on the state of the interest we're viewing.
function getOptions (interest) {
  const options = {
    showHeader: true,
    headingText: '',
    subHeadingText: '',
    showAcceptButton: true,
    acceptButtonText: '',
    showRejectButton: true,
    rejectInterestButtonText: <FormattedMessage id='rejectInterestButton' defaultMessage='Withdraw Interest' description='Button for volunteer to reject interest in an opportunity' />,
    messagePlaceholder: ''
  }

  switch (interest.status) {
    case null:
      options.showHeader = false
      options.headingText = <FormattedMessage id='getInvolvedHeading' defaultMessage='How do you want to get involved?' description='Heading displayed on form allowing volunteer to express interest in an opportunity' />
      options.subHeadingText = <FormattedMessage id='getInvolvedSubHeading' defaultMessage='Let us know how you want to get involved or what you have to offer and an organizer will get in touch with you.' description='Sub-heading displayed on form allowing volunteer to express interest in an opportunity' />
      options.acceptButtonText = <FormattedMessage id='getInvolvedButton' defaultMessage='Get Involved' description='Button allowing volunteer to express interest in an opportunity' />
      options.showFormButtonText = <FormattedMessage id='registerInterestShowForm' defaultMessage="I'm Interested" description='Button to allow volunteer to start expressing interest in an opportunity' />
      options.messagePlaceholder = 'How do you want to help out? Got any questions?' // Can't use FormattedMessage here, is there something else I can use?
      options.showRejectButton = false
      break

    case 'interested':
      options.headingText = <FormattedMessage id='isInterestedHeading' defaultMessage='Thank you for expressing your interest!' description='Heading on express-interest form when volunteer has already expressed interest' />
      options.subHeadingText = <FormattedMessage id='isInterestedSubHeading' defaultMessage='The organizer will be in touch shortly :)' description='Sub-heading on express-interest form when volunteer has already expressed interest' />
      options.showAcceptButton = false
      break

    case 'invited':
      options.headingText = <FormattedMessage id='isInvitedHeading' defaultMessage="You've been invited to participate!" description='Heading displayed on express-interest form when volunteer has been invited to participate' />
      options.subHeadingText = <FormattedMessage id='isInvitedSubHeading' defaultMessage='Please let the organizer know whether you can attend.' description='Sub-heading displayed on express-interest form when volunteer has been invited to participate' />
      options.acceptButtonText = <FormattedMessage id='isInvitedAcceptButton' defaultMessage='I can make it :)' description='Allows volunteer to accept invitation to participate in opportunity' />
      options.rejectInterestButtonText = <FormattedMessage id='isInvitedRejectButton' defaultMessage="I can't make it :(" description='Allows volunteer to reject from an opportunity once they have been invited' />
      break

    case 'committed':
      options.headingText = <FormattedMessage id='isCommittedHeading' defaultMessage='Thank you so much!' description='Heading displayed when volunteer has committed to an op' />
      options.subHeadingText = <FormattedMessage id='isCommittedSubHeading' defaultMessage='You have agreed to participate in this event!' description='Sub-heading displayed when volunteer has committed to an op' />
      options.showAcceptButton = false
      break

    case 'declined':
      options.headingText = <FormattedMessage id='isDeclinedHeading' defaultMessage='Our apologies' description='Heading displayed when volunteer has been declined by opportunity organizer' />
      options.subHeadingText = <FormattedMessage id='isDeclinedSubHeading' defaultMessage='Thank you so much for registering your interest. However, all available spots for this event have been filled.' description='Sub-heading displayed when volunteer has been declined by opportunity organizer' />
      options.showAcceptButton = false
      options.showRejectButton = false
      break

    case 'completed':
      options.headingText = <FormattedMessage id='isCompletedHeading' defaultMessage='Thank you so much!' description='Heading displayed when volunteer has participated in an op' />
      options.subHeadingText = <FormattedMessage id='isCompletedSubHeading' defaultMessage='We hope you enjoyed your event, and we look forward to working with you in the future!' description='Sub-heading displayed when volunteer has participated in an op' />
      options.showAcceptButton = false
      options.showRejectButton = false
      break

    case 'cancelled':
      options.headingText = <FormattedMessage id='isCancelledHeading' defaultMessage='Our apologies' description='Heading displayed to volunteer when opportunity is cancelled by organizer' />
      options.subHeadingText = <FormattedMessage id='isCancelledSubHeading' defaultMessage='Thank you so much for registering your interest. However, unfortunately this event has been cancelled by the organizer.' description='Sub-heading displayed to volunteer when opportunity is cancelled by organizer' />
      options.showAcceptButton = false
      options.showRejectButton = false
      break
  }

  return options
}

export default RegisterInterestItem
