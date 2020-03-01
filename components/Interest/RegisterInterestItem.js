// /*
//   Dumb component. Contains information about a volunteer's interest in an opportunity.
//   Unlike InterestItem, this one is a Form allowing state changes.
// */

import { Button, notification, Row } from 'antd'
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
  onReject,
  onMessage
}) => {
  const [showAcceptForm, setShowAcceptForm] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [showMessageForm, setShowMessageForm] = useState(false)
  // Options to configure the controls on this page based on the state of the interest.
  const options = getOptions(interest)

  const handleAcceptSubmit = (ok, message, termsAccepted) => {
    setShowAcceptForm(false)
    if (ok) {
      onAccept(message, termsAccepted)
      if (options.acceptNotifyHeading) {
        notification.success({
          message: options.acceptNotifyHeading,
          description: options.acceptNotifyMessage
        })
      }
    }
  }

  const handleAcceptClick = (e) => {
    e.preventDefault()
    setShowAcceptForm(true)
  }

  const handleRejectSubmit = (ok, message) => {
    setShowRejectForm(false)
    if (ok) {
      onReject(message)
      if (options.rejectNotifyHeading) {
        notification.success({
          message: options.rejectNotifyHeading,
          description: options.rejectNotifyMessage
        })
      }
    }
  }
  const handleRejectClick = (e) => {
    e.preventDefault()
    setShowRejectForm(true)
  }
  const handleMessageClick = (e) => {
    e.preventDefault()
    setShowMessageForm(true)
  }

  const handleMessageSubmit = (ok, message) => {
    setShowMessageForm(false)
    if (ok) {
      onMessage(message)
      notification.success({
        message: <FormattedMessage id='messageNotify.title' defaultMessage='Done' description='Completed sending email notification' />,
        description: <FormattedMessage id='messageNotify.description' defaultMessage="We've emailed your message" description='Completed sending email notification' />
      })
    }
  }
  const messageForm = {
    title: <FormattedMessage id='messageForm.title' defaultMessage='Message organiser' description='Form title message the organiser' />,
    prompt: <FormattedMessage id='messageForm.prompt' defaultMessage='This message will be emailed to the activity organiser' description='Form prompt message the organiser' />
  }
  return (
    <>
      {/* Headers */}
      {options.showStatus && (
        <Row>
          <p>{options.statusMessage}</p>
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
          <Button shape='round' onClick={handleRejectClick}>
            {options.rejectButtonText}
          </Button>
        )}
        {options.showMessageButton && (
          <Button shape='round' onClick={handleMessageClick}>
            <FormattedMessage
              id='RegisterInterestItem.MessageOp'
              defaultMessage='Message the Organiser'
              description='Button allowing volunteer send a message to the organiser'
            />
          </Button>
        )}
      </Row>

      <RegisterInterestMessageForm
        title={options.acceptFormTitle}
        prompt={options.acceptFormPrompt}
        prevAccepted={interest.termsAccepted}
        onSubmit={handleAcceptSubmit}
        visible={showAcceptForm}
      />
      <RegisterInterestMessageForm
        title={options.rejectFormTitle}
        prompt={options.rejectFormPrompt}
        prevAccepted
        onSubmit={handleRejectSubmit}
        visible={showRejectForm}
      />
      <RegisterInterestMessageForm
        title={messageForm.title}
        prompt={messageForm.prompt}
        prevAccepted
        onSubmit={handleMessageSubmit}
        visible={showMessageForm}
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
const getOptions = (interest) => {
  switch (interest.status) {
    case null:
      return {
        showStatus: false,
        showAcceptButton: true,
        acceptButtonText: <FormattedMessage id='nointerest.acceptButtonText' defaultMessage='Get Involved' description='Button allowing volunteer to express interest in an opportunity' />,
        acceptFormTitle: <FormattedMessage id='nointerest.acceptFormTitle' defaultMessage='How do you want to get involved?' description='Heading displayed on form allowing volunteer to express interest in an opportunity' />,
        acceptFormPrompt: <FormattedMessage id='nointerest.acceptFormPrompt' defaultMessage='Let us know how you want to get involved or what you have to offer and an organizer will get in touch with you.' description='Sub-heading displayed on form allowing volunteer to express interest in an opportunity' />,
        acceptNotifyHeading: <FormattedMessage id='nointerest.acceptNotifyHeading' defaultMessage='Thank you for expressing your interest!' description='Heading on express-interest form when volunteer has already expressed interest' />,
        acceptNotifyMessage: <FormattedMessage id='nointerest.acceptNotifyMessage' defaultMessage='The organizer will be in touch shortly.' description='Sub-heading on express-interest form when volunteer has already expressed interest' />,
        showRejectButton: false,
        showMessageButton: false
      }

    case 'interested':
      return {
        showStatus: true,
        statusMessage: <FormattedMessage id='interested.statusMessage' defaultMessage='Awaiting an invitation' description='message when volunteer has already expressed interest' />,
        showAcceptButton: false,
        showRejectButton: true,
        rejectButtonText: <FormattedMessage id='interested.rejectButtonText' defaultMessage='Withdraw Interest' description='Button for volunteer to reject interest in an opportunity' />,
        rejectFormTitle: <FormattedMessage id='interested.rejectFormTitle' defaultMessage='Is there something we can do?' description='title message form when interested person withdraws' />,
        rejectFormPrompt: <FormattedMessage id='interested.rejectFormPrompt' defaultMessage='Leave a message for the organiser' description='prompt on message form when interested person withdraws' />,
        rejectNotifyHeading: <FormattedMessage id='interested.rejectNotifyHeading' defaultMessage="You're not interested" description='title on popup after person withdraws interest' />,
        rejectNotifyMessage: <FormattedMessage id='interested.rejectNotifyMessage' defaultMessage="That's sad but we understand - go look for something else" description='message on popup after person withdraws interest' />,
        showMessageButton: true
      }

    case 'invited':
      return {
        showStatus: true,
        statusMessage: <FormattedMessage id='invited.statusMessage' defaultMessage='You have been invited to participate, awaiting your confirmation.' description='prompt when volunteer is invited' />,

        showAcceptButton: true,
        acceptFormTitle: <FormattedMessage id='invited.acceptFormTitle' defaultMessage="That's great. Thanks." description='Heading displayed on express-interest form when volunteer has been invited to participate' />,
        acceptFormPrompt: <FormattedMessage id='invited.acceptFormPrompt' defaultMessage='Send a message to the organiser.' description='Sub-heading displayed on express-interest form when volunteer has been invited to participate' />,
        acceptButtonText: <FormattedMessage id='invited.acceptButtonText' defaultMessage='I can do it :)' description='Allows volunteer to accept invitation to participate in opportunity' />,
        acceptNotifyHeading: <FormattedMessage id='invited.acceptNotifyHeading' defaultMessage='Thank you so much!' description='Heading displayed when volunteer has committed to an op' />,
        acceptNotifyMessage: <FormattedMessage id='invited.acceptNotifyMessage' defaultMessage='You have agreed to participate in this activty! Check out your home page for some things you might need to complete.' description='Sub-heading displayed when volunteer has committed to an op' />,

        showRejectButton: true,
        rejectButtonText: <FormattedMessage id='invited.rejectButtonText' defaultMessage="I can't make it :(" description='Allows volunteer to reject from an opportunity once they have been invited' />,
        rejectFormTitle: <FormattedMessage id='invited.rejectFormTitle' defaultMessage='Is there something we can do?' description='title message form when interested person withdraws' />,
        rejectFormPrompt: <FormattedMessage id='invited.rejectFormPrompt' defaultMessage='We will take you off the invite list but keep you as interested. Leave a message for the organiser' description='prompt on message form when interested person withdraws' />,
        rejectNotifyHeading: <FormattedMessage id='invited.rejectNotifyHeading' defaultMessage="You can't make it" description='title on popup after person withdraws interest' />,
        rejectNotifyMessage: <FormattedMessage id='invited.rejectNotifyMessage' defaultMessage="That's sad but we understand - go look for something else" description='message on popup after person withdraws interest' />,
        showMessageButton: true
      }
    case 'committed':
      return {
        showStatus: true,
        statusMessage: <FormattedMessage id='committed.statusMessage' defaultMessage='You are committed to this activity' description='prompt when volunteer is committed' />,
        showAcceptButton: false,
        showRejectButton: true,
        rejectButtonText: <FormattedMessage id='committed.rejectButtonText' defaultMessage="I can't make it :(" description='Allows volunteer to reject from an opportunity once they have been invited' />,
        rejectFormTitle: <FormattedMessage id='committed.rejectFormTitle' defaultMessage='Oh no!, Sorry to hear that.' description='title message form when interested person withdraws' />,
        rejectFormPrompt: <FormattedMessage id='committed.rejectFormPrompt' defaultMessage="Send the organiser a message about why you can't be involved" description='prompt on message form when interested person withdraws' />,
        rejectNotifyHeading: <FormattedMessage id='committed.rejectNotifyHeading' defaultMessage="You can't make it" description='title on popup after person withdraws interest' />,
        rejectNotifyMessage: <FormattedMessage id='committed.rejectNotifyMessage' defaultMessage="That's sad but we understand - we will keep you listed as interested and let you know if anything changes." description='message on popup after person withdraws interest' />,
        showMessageButton: true
      }
    case 'declined':
      return {
        showStatus: true,
        statusMessage: <FormattedMessage id='declined.statusMessage' defaultMessage='You have been declined for this activity. Try another' description='prompt when volunteer is declined' />,
        showAcceptButton: false,
        showRejectButton: false,
        showMessageButton: false
      }
    default:
      return {
        showStatus: false,
        showAcceptButton: false,
        showRejectButton: false,
        showMessageButton: false
      }
  }
}

export default RegisterInterestItem
