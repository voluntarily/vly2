// /*
//   Dumb component. Contains information about a volunteer's interest in an opportunity.
//   Unlike InterestItem, this one is a Form allowing state changes.
// */

import { Button, Icon, notification } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import RegisterInterestMessageForm from './RegisterInterestMessageForm'
import { PageAlert } from '../VTheme/VTheme'
import { InterestStatus } from '../../server/api/interest/interest.constants'
import { useSelector } from 'react-redux'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
const { ASK, OFFER } = OpportunityType

/* Cycle is
1. status message + accept [reject] buttons
2. both buttons show message form - cancel returns, ok accepts and sends
3. popup notification once change is sent - we'll be in touch,
4. email sent
5. display new status
*/

const AffixTopBar = ({ children }) => {
  return (process.env.NODE_ENV === 'test')
    ? <>{children}</>
    : <div style={{ width: '100%', position: 'absolute', top: '-5rem', left: 0 }} offsetTop={56}>{children}</div>
}

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
  // get current op from the store - should be only one.
  const op = useSelector(state => state.opportunities.data[0])

  if (!op.requestor) {
    op.requestor = { nickname: 'Unknown' }
  }
  const options = getOptions(interest.status, op.type, op.requestor)

  const handleAcceptSubmit = (ok, message) => {
    setShowAcceptForm(false)
    if (ok) {
      onAccept(message)
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
    title: <FormattedMessage id='messageForm.title' defaultMessage='Message {nickname}' description='Form title message the organiser' values={{ nickname: op.requestor.nickname }} />,
    prompt: '' // <FormattedMessage id='messageForm.prompt' defaultMessage='This message will be emailed to the activity organiser' description='Form prompt message the organiser' />
  }

  const RegisterButtons = () => {
    return (
      <>
        {options.showAcceptButton && (
          <Button
            id='acceptBtn'
            block
            type='primary' shape='round' size='large' style={{ placeSelf: 'start', maxWidth: '20rem' }}
            onClick={handleAcceptClick}
          >
            {options.acceptButtonText}
          </Button>
        )}
        {/* Button to handle rejectal from op */}
        {options.showRejectButton && (
          <Button
            id='rejectBtn'
            shape='round'
            size='large'
            block
            style={{ placeSelf: 'start', maxWidth: '20rem' }}
            onClick={handleRejectClick}
          >
            {options.rejectButtonText}
          </Button>
        )}
      </>
    )
  }
  return (
    <>
      {options.showStatus
        ? (
          <AffixTopBar>
            <PageAlert>
              <Icon type='history' style={{ fontSize: '32px', color: 'white', placeSelf: 'center' }} />
              <h4 style={{ alignSelf: 'center' }}>{options.statusMessage}</h4>
              <RegisterButtons />
            </PageAlert>
          </AffixTopBar>
        )
        : <RegisterButtons />}

      <RegisterInterestMessageForm
        id='acceptRegisterInterestForm'
        title={options.acceptFormTitle}
        prompt={options.acceptFormPrompt}
        showTerms={!interest.termsAccepted}
        onSubmit={handleAcceptSubmit}
        visible={showAcceptForm}
      />
      <RegisterInterestMessageForm
        id='rejectRegisterInterestForm'
        title={options.rejectFormTitle}
        prompt={options.rejectFormPrompt}
        showTerms={!interest.termsAccepted}
        onSubmit={handleRejectSubmit}
        visible={showRejectForm}
      />
      <RegisterInterestMessageForm
        id='messageRegisterInterestForm'
        title={messageForm.title}
        prompt={messageForm.prompt}
        showTerms={!interest.termsAccepted}
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

const messages = {
  [ASK]: defineMessages({
    new_acceptButtonText: {
      id: 'new.ask.acceptButtonText',
      defaultMessage: 'Offer to help',
      description: 'Button allowing volunteer to express interest in an opportunity'
    },
    new_acceptFormTitle: {
      id: 'new.ask.acceptFormTitle',
      defaultMessage: 'Thanks for helping out',
      description: 'Heading displayed on form allowing volunteer to express interest in an opportunity'
    },
    new_acceptFormPrompt: {
      id: 'new.ask.acceptFormPrompt',
      defaultMessage: 'Leave a message about how you can help and {nickname} will get back in touch with you.',
      description: 'Sub-heading displayed on form allowing volunteer to express interest in an opportunity'
    },
    new_acceptNotifyHeading: { id: 'new.ask.acceptNotifyHeading', defaultMessage: 'Thank you for expressing your interest!', description: 'Heading on express-interest form when asker has already expressed interest' },
    new_acceptNotifyMessage: { id: 'new.ask.acceptNotifyMessage', defaultMessage: '{nickname} will be in touch shortly.', description: 'Sub-heading on express-interest form when asker has already expressed interest' },
    interested_statusMessage: { id: 'interested.ask.statusMessage', defaultMessage: "You've offered to help, {nickname} will get back to you soon!", description: 'message when asker has already expressed interest' },
    interested_rejectButtonText: { id: 'interested.ask.rejectButtonText', defaultMessage: 'Withdraw Offer', description: 'Button for asker to reject interest in an opportunity' },
    interested_rejectFormTitle: { id: 'interested.ask.rejectFormTitle', defaultMessage: "Can't make it?", description: 'title message form when interested person withdraws' },
    interested_rejectFormPrompt: { id: 'interested.ask.rejectFormPrompt', defaultMessage: 'Leave a message for {nickname}', description: 'prompt on message form when interested person withdraws' },
    interested_rejectNotifyHeading: { id: 'interested.ask.rejectNotifyHeading', defaultMessage: "You can't make it", description: 'title on popup after person withdraws interest' },
    interested_rejectNotifyMessage: { id: 'interested.ask.rejectNotifyMessage', defaultMessage: "That's sad but we understand - try another activity", description: 'message on popup after person withdraws interest' },
    invited_statusMessage: { id: 'invited.ask.statusMessage', defaultMessage: 'You have been invited to this activity 🥳', description: 'prompt when asker is invited' },
    invited_acceptFormTitle: { id: 'invited.ask.acceptFormTitle', defaultMessage: 'Accept Invitiation', description: 'Heading displayed on express-interest form when asker has been invited to participate' },
    invited_acceptFormPrompt: { id: 'invited.ask.acceptFormPrompt', defaultMessage: '(Optional) Send a message the Organiser if you have any questions ', description: 'Sub-heading displayed on express-interest form when asker has been invited to participate' },
    invited_acceptButtonText: { id: 'invited.ask.acceptButtonText', defaultMessage: 'Accept', description: 'Allows asker to accept invitation to participate in opportunity' },
    invited_acceptNotifyHeading: { id: 'invited.ask.acceptNotifyHeading', defaultMessage: 'Thank you so much!', description: 'Heading displayed when asker has committed to an op' },
    invited_acceptNotifyMessage: { id: 'invited.ask.acceptNotifyMessage', defaultMessage: 'You have agreed to participate in this activty! Check out your home page for some things you might need to complete.', description: 'Sub-heading displayed when asker has committed to an op' },
    invited_rejectButtonText: { id: 'invited.ask.rejectButtonText', defaultMessage: 'Decline', description: 'Allows asker to reject from an opportunity once they have been invited' },
    invited_rejectFormTitle: { id: 'invited.ask.rejectFormTitle', defaultMessage: 'Is there something we can do?', description: 'title message form when interested person withdraws' },
    invited_rejectFormPrompt: { id: 'invited.ask.rejectFormPrompt', defaultMessage: 'We will take you off the invite list but keep you as interested. Leave a message for the organiser', description: 'prompt on message form when interested person withdraws' },
    invited_rejectNotifyHeading: { id: 'invited.ask.rejectNotifyHeading', defaultMessage: "You can't make it", description: 'title on popup after person withdraws interest' },
    invited_rejectNotifyMessage: { id: 'invited.ask.rejectNotifyMessage', defaultMessage: "That's sad but we understand - go look for something else", description: 'message on popup after person withdraws interest' },
    committed_statusMessage: { id: 'committed.ask.statusMessage', defaultMessage: 'You are committed to this activity', description: 'prompt when asker is committed' },
    committed_rejectButtonText: { id: 'committed.ask.rejectButtonText', defaultMessage: "I can't make it :(", description: 'Allows asker to reject from an opportunity once they have been invited' },
    committed_rejectFormTitle: { id: 'committed.ask.rejectFormTitle', defaultMessage: 'Oh no!, Sorry to hear that.', description: 'title message form when interested person withdraws' },
    committed_rejectFormPrompt: { id: 'committed.ask.rejectFormPrompt', defaultMessage: "Send the organiser a message about why you can't be involved", description: 'prompt on message form when interested person withdraws' },
    committed_rejectNotifyHeading: { id: 'committed.ask.rejectNotifyHeading', defaultMessage: "You can't make it", description: 'title on popup after person withdraws interest' },
    committed_rejectNotifyMessage: { id: 'committed.ask.rejectNotifyMessage', defaultMessage: "That's sad but we understand - we will keep you listed as interested and let you know if anything changes.", description: 'message on popup after person withdraws interest' },
    declined_statusMessage: { id: 'declined.ask.statusMessage', defaultMessage: 'You have been declined for this activity. Try another', description: 'prompt when asker is declined' }
  }),
  [OFFER]: defineMessages({
    new_acceptButtonText: {
      id: 'new.offer.acceptButtonText',
      defaultMessage: 'Accept help',
      description: 'Button allowing volunteer to express interest in an opportunity'
    },
    new_acceptFormTitle: {
      id: 'new.offer.acceptFormTitle',
      defaultMessage: 'Help on its way',
      description: 'Heading displayed on form allowing volunteer to express interest in an opportunity'
    },
    new_acceptFormPrompt: {
      id: 'new.offer.acceptFormPrompt',
      defaultMessage: 'Leave a message and {nickname} will get in touch with you.',
      description: 'Sub-heading displayed on form allowing volunteer to express interest in an opportunity'
    },
    new_acceptNotifyHeading: { id: 'new.offer.acceptNotifyHeading', defaultMessage: 'Thank you for asking!', description: 'Heading on express-interest form when volunteer has already expressed interest' },
    new_acceptNotifyMessage: { id: 'new.offer.acceptNotifyMessage', defaultMessage: '{nickname} will be in touch shortly.', description: 'Sub-heading on express-interest form when volunteer has already expressed interest' },
    interested_statusMessage: { id: 'interested.offer.statusMessage', defaultMessage: "You've asked for help, {nickname} will get back to you soon!", description: 'message when volunteer has already expressed interest' },
    interested_rejectButtonText: { id: 'interested.offer.rejectButtonText', defaultMessage: 'Cancel Ask', description: 'Button for volunteer to reject interest in an opportunity' },
    interested_rejectFormTitle: { id: 'interested.offer.rejectFormTitle', defaultMessage: 'No longer need this?', description: 'title message form when interested person withdraws' },
    interested_rejectFormPrompt: { id: 'interested.offer.rejectFormPrompt', defaultMessage: 'Leave a message for {nickname}', description: 'prompt on message form when interested person withdraws' },
    interested_rejectNotifyHeading: { id: 'interested.offer.rejectNotifyHeading', defaultMessage: 'Ask cancelled', description: 'title on popup after person withdraws interest' },
    interested_rejectNotifyMessage: { id: 'interested.offer.rejectNotifyMessage', defaultMessage: "you're all done, if you need anything else search the activities", description: 'message on popup after person withdraws interest' },
    invited_statusMessage: { id: 'invited.offer.statusMessage', defaultMessage: 'You have been invited to this activity 🥳', description: 'prompt when volunteer is invited' },
    invited_acceptFormTitle: { id: 'invited.offer.acceptFormTitle', defaultMessage: 'Accept Invitation', description: 'Heading displayed on express-interest form when volunteer has been invited to participate' },
    invited_acceptFormPrompt: { id: 'invited.offer.acceptFormPrompt', defaultMessage: '(Optional) Send a message {nickname} if you have any questions ', description: 'Sub-heading displayed on express-interest form when volunteer has been invited to participate' },
    invited_acceptButtonText: { id: 'invited.offer.acceptButtonText', defaultMessage: 'Accept', description: 'Allows volunteer to accept invitation to participate in opportunity' },
    invited_acceptNotifyHeading: { id: 'invited.offer.acceptNotifyHeading', defaultMessage: 'Thank you so much!', description: 'Heading displayed when volunteer has committed to an op' },
    invited_acceptNotifyMessage: { id: 'invited.offer.acceptNotifyMessage', defaultMessage: 'You have agreed to participate in this activty! Check out your home page for some things you might need to complete.', description: 'Sub-heading displayed when volunteer has committed to an op' },
    invited_rejectButtonText: { id: 'invited.offer.rejectButtonText', defaultMessage: 'Decline', description: 'Allows volunteer to reject from an opportunity once they have been invited' },
    invited_rejectFormTitle: { id: 'invited.offer.rejectFormTitle', defaultMessage: 'Is there something we can do?', description: 'title message form when interested person withdraws' },
    invited_rejectFormPrompt: { id: 'invited.offer.rejectFormPrompt', defaultMessage: 'We will take you off the invite list but keep you as interested. Leave a message for the organiser', description: 'prompt on message form when interested person withdraws' },
    invited_rejectNotifyHeading: { id: 'invited.offer.rejectNotifyHeading', defaultMessage: "You can't make it", description: 'title on popup after person withdraws interest' },
    invited_rejectNotifyMessage: { id: 'invited.offer.rejectNotifyMessage', defaultMessage: "That's sad but we understand - go look for something else", description: 'message on popup after person withdraws interest' },
    committed_statusMessage: { id: 'committed.offer.statusMessage', defaultMessage: 'You are committed to this activity', description: 'prompt when volunteer is committed' },
    committed_rejectButtonText: { id: 'committed.offer.rejectButtonText', defaultMessage: "I can't make it :(", description: 'Allows volunteer to reject from an opportunity once they have been invited' },
    committed_rejectFormTitle: { id: 'committed.offer.rejectFormTitle', defaultMessage: 'Oh no!, Sorry to hear that.', description: 'title message form when interested person withdraws' },
    committed_rejectFormPrompt: { id: 'committed.offer.rejectFormPrompt', defaultMessage: "Send {nickname} a message about why you can't be involved", description: 'prompt on message form when interested person withdraws' },
    committed_rejectNotifyHeading: { id: 'committed.offer.rejectNotifyHeading', defaultMessage: "You can't make it", description: 'title on popup after person withdraws interest' },
    committed_rejectNotifyMessage: { id: 'committed.offer.rejectNotifyMessage', defaultMessage: "That's sad but we understand - we will keep you listed as interested and let you know if anything changes.", description: 'message on popup after person withdraws interest' },
    declined_statusMessage: { id: 'declined.offer.statusMessage', defaultMessage: 'You have been declined for this activity. Try another', description: 'prompt when volunteer is declined' }

  })
}
// Returns some config options for this component, depending on the state of the interest we're viewing.
const getOptions = (status, type, requestor) => {
  const { formatMessage } = useIntl()
  switch (status) {
    case null:
      return {
        showStatus: false,
        showAcceptButton: true,
        acceptButtonText: formatMessage(messages[type].new_acceptButtonText),
        acceptFormTitle: formatMessage(messages[type].new_acceptFormTitle),
        acceptFormPrompt: formatMessage(messages[type].new_acceptFormPrompt, { nickname: requestor.nickname }),
        acceptNotifyHeading: formatMessage(messages[type].new_acceptNotifyHeading, { nickname: requestor.nickname }),
        acceptNotifyMessage: formatMessage(messages[type].new_acceptNotifyMessage, { nickname: requestor.nickname }),
        showRejectButton: false,
        showMessageButton: false
      }

    case InterestStatus.INTERESTED:
      return {
        showStatus: true,
        statusMessage: formatMessage(messages[type].interested_statusMessage, { nickname: requestor.nickname }),
        showAcceptButton: false,
        showRejectButton: true,
        rejectButtonText: formatMessage(messages[type].interested_rejectButtonText, { nickname: requestor.nickname }),
        rejectFormTitle: formatMessage(messages[type].interested_rejectFormTitle, { nickname: requestor.nickname }),
        rejectFormPrompt: formatMessage(messages[type].interested_rejectFormPrompt, { nickname: requestor.nickname }),
        rejectNotifyHeading: formatMessage(messages[type].interested_rejectNotifyHeading, { nickname: requestor.nickname }),
        rejectNotifyMessage: formatMessage(messages[type].interested_rejectNotifyMessage, { nickname: requestor.nickname }),
        showMessageButton: true
      }

    case InterestStatus.INVITED:
      return {
        showStatus: true,
        statusMessage: <FormattedMessage id='invited.statusMessage' defaultMessage='You have been invited to this activity 🥳' description='prompt when volunteer is invited' />,

        showAcceptButton: true,
        acceptFormTitle: <FormattedMessage id='invited.acceptFormTitle' defaultMessage='Accept Invitiation' description='Heading displayed on express-interest form when volunteer has been invited to participate' />,
        acceptFormPrompt: <FormattedMessage id='invited.acceptFormPrompt' defaultMessage='(Optional) Send a message the Organiser if you have any questions ' description='Sub-heading displayed on express-interest form when volunteer has been invited to participate' />,
        acceptButtonText: <FormattedMessage id='invited.acceptButtonText' defaultMessage='Accept' description='Allows volunteer to accept invitation to participate in opportunity' />,
        acceptNotifyHeading: <FormattedMessage id='invited.acceptNotifyHeading' defaultMessage='Thank you so much!' description='Heading displayed when volunteer has committed to an op' />,
        acceptNotifyMessage: <FormattedMessage id='invited.acceptNotifyMessage' defaultMessage='You have agreed to participate in this activty! Check out your home page for some things you might need to complete.' description='Sub-heading displayed when volunteer has committed to an op' />,

        showRejectButton: true,
        rejectButtonText: <FormattedMessage id='invited.rejectButtonText' defaultMessage='Decline' description='Allows volunteer to reject from an opportunity once they have been invited' />,
        rejectFormTitle: <FormattedMessage id='invited.rejectFormTitle' defaultMessage='Is there something we can do?' description='title message form when interested person withdraws' />,
        rejectFormPrompt: <FormattedMessage id='invited.rejectFormPrompt' defaultMessage='We will take you off the invite list but keep you as interested. Leave a message for the organiser' description='prompt on message form when interested person withdraws' />,
        rejectNotifyHeading: <FormattedMessage id='invited.rejectNotifyHeading' defaultMessage="You can't make it" description='title on popup after person withdraws interest' />,
        rejectNotifyMessage: <FormattedMessage id='invited.rejectNotifyMessage' defaultMessage="That's sad but we understand - go look for something else" description='message on popup after person withdraws interest' />,
        showMessageButton: false
      }
    case InterestStatus.COMMITTED:
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
    case InterestStatus.DECLINED:
      return {
        showStatus: true,
        statusMessage: <FormattedMessage id='declined.statusMessage' defaultMessage='You have been declined for this activity. Try another' description='prompt when volunteer is declined' />,
        showAcceptButton: false,
        showRejectButton: false,
        showMessageButton: false
      }
  }
}

export default RegisterInterestItem
