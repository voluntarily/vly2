// /*
//   Dumb component. Contains information about a volunteer's interest in an opportunity.
//   Unlike InterestItem, this one is a Form allowing state changes.
// */

import { Affix, Button, Icon, notification } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import RegisterInterestMessageForm from './RegisterInterestMessageForm'
import { PageAlert } from '../VTheme/VTheme'
import { InterestStatus } from '../../server/api/interest/interest.constants'
import { InterestMessageItem, InterestMessageList } from './InterestMessage'
import styled from 'styled-components'

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
    : <Affix style={{ width: '100%', position: 'absolute', top: 0, left: 0 }} offsetTop={56}>{children}</Affix>
}

const MessagePanel = styled.section`
box-shadow: 2px 2px 12px 0 rgba(190, 190, 190, 0.5);
margin-top: 1rem;
border-radius: 8px;
-webkit-transition: all 0.3s;
transition: all 0.3s;
:hover {
  border-radius: 8px;
  transform: scale(1.02);
  h3 {
    color: #6549AA;
  }
}
`
/* <MessagePanel>
<InterestMessageList messages={interest.messages} />
</MessagePanel>
      style: 'backgroundColor: #A0B0C0'
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
  const options = getOptions(interest.status)

  const showMessages = () => {
    notification.info({
      message: `${interest.messages.length} Messages`,
      description: <InterestMessageList messages={interest.messages} />,
      placement: 'bottomRight',
      duration: 4.5, // never close
      style: {
        maxHeight: '30rem',
        overflow: 'auto'
        // width: '20rem',
        // marginLeft: 335 - 600
      }

    })
  }
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

  const RegisterButtons = () => {
    return (
      <>
        {options.showAcceptButton && (
          <Button
            id='acceptBtn'
            block
            type='primary' shape='round' size='large' style={{ placeSelf: 'center' }}
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
            style={{ placeSelf: 'center' }}
            onClick={handleRejectClick}
          >
            {options.rejectButtonText}
          </Button>
        )}
        {options.showMessageButton && (
          <Button
            id='messageBtn'
            size='large'
            block
            style={{ placeSelf: 'center' }}
            shape='round' onClick={handleMessageClick}
          >
            <FormattedMessage
              id='RegisterInterestItem.MessageOp'
              defaultMessage='Message the Organiser'
              description='Button allowing volunteer send a message to the organiser'
            />
          </Button>
        )}
      </>
    )
  }

  const latestMsg = interest.messages.slice(-1)[0]

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
      <MessagePanel onClick={() => showMessages()}>

        <InterestMessageItem message={latestMsg} />
      </MessagePanel>

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

// Returns some config options for this component, depending on the state of the interest we're viewing.
const getOptions = (status) => {
  switch (status) {
    case null:
      return {
        showStatus: false,
        showAcceptButton: true,
        acceptButtonText: <FormattedMessage id='nointerest.acceptButtonText' defaultMessage='Offer to help' description='Button allowing volunteer to express interest in an opportunity' />,
        acceptFormTitle: <FormattedMessage id='nointerest.acceptFormTitle' defaultMessage='How do you want to get involved?' description='Heading displayed on form allowing volunteer to express interest in an opportunity' />,
        acceptFormPrompt: <FormattedMessage id='nointerest.acceptFormPrompt' defaultMessage='Let us know how you want to get involved or what you have to offer and an organizer will get in touch with you.' description='Sub-heading displayed on form allowing volunteer to express interest in an opportunity' />,
        acceptNotifyHeading: <FormattedMessage id='nointerest.acceptNotifyHeading' defaultMessage='Thank you for expressing your interest!' description='Heading on express-interest form when volunteer has already expressed interest' />,
        acceptNotifyMessage: <FormattedMessage id='nointerest.acceptNotifyMessage' defaultMessage='The organizer will be in touch shortly.' description='Sub-heading on express-interest form when volunteer has already expressed interest' />,
        showRejectButton: false,
        showMessageButton: false
      }

    case InterestStatus.INTERESTED:
      return {
        showStatus: true,
        statusMessage: <FormattedMessage id='interested.statusMessage' defaultMessage='The organiser will get back to you soon!' description='message when volunteer has already expressed interest' />,
        showAcceptButton: false,
        showRejectButton: true,
        rejectButtonText: <FormattedMessage id='interested.rejectButtonText' defaultMessage='Withdraw Interest' description='Button for volunteer to reject interest in an opportunity' />,
        rejectFormTitle: <FormattedMessage id='interested.rejectFormTitle' defaultMessage='Is there something we can do?' description='title message form when interested person withdraws' />,
        rejectFormPrompt: <FormattedMessage id='interested.rejectFormPrompt' defaultMessage='Leave a message for the organiser' description='prompt on message form when interested person withdraws' />,
        rejectNotifyHeading: <FormattedMessage id='interested.rejectNotifyHeading' defaultMessage="You're not interested" description='title on popup after person withdraws interest' />,
        rejectNotifyMessage: <FormattedMessage id='interested.rejectNotifyMessage' defaultMessage="That's sad but we understand - go look for something else" description='message on popup after person withdraws interest' />,
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
