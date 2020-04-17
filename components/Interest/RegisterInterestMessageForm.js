
import { Button, Icon, Modal } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { FormattedMessage } from 'react-intl'
import { useState } from 'react'
/* when person clicks I'm Interested a popup form shows a text field
 and check box for accept terms, click the terms string to open terms in another window
 OK on the text box completes the interested record with the given message
 Cancel just returns to the previous state.
 This happens each time the state is changed.

 Form calls back onSubmit false if cancelled and form fields in ok.
 */

const showStaySafe = true
const maxMessageLength = 400

const staySafeUrl = 'https://voluntarily.atlassian.net/servicedesk/customer/portal/2/article/236486718'
export const RegisterInterestMessageForm = ({
  visible,
  onSubmit,
  title, prompt, showTerms
}) => {
  const [message, setMessage] = useState('')
  const handleOk = (e) => {
    onSubmit(true, message)
  }
  const handleCancel = (e) => {
    onSubmit(false)
  }

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
      footer={[

        <Button
          key='submit' id='sendBtn' type='primary' shape='round'
          onClick={handleOk}
        >
          <FormattedMessage id='RegisterInterestMessageForm.send' defaultMessage='Send' description='Send button on popup form' />
        </Button>,
        <Button id='cancelBtn' key='esc' shape='round' onClick={handleCancel}>
          <FormattedMessage id='RegisterInterestMessageForm.cancel' defaultMessage='Cancel' description='Cancel button on popup form' />
        </Button>
      ]}
    >
      <p>{prompt}</p>
      <TextArea
        rows='3'
        maxLength={maxMessageLength}
        value={message}
        onChange={e => {
          setMessage(e.target.value)
        }}
        style={{ marginBottom: '1rem' }}
      />
      {showTerms && (
        <p>
          <FormattedMessage
            id='RegisterInterestMessageForm.accepttcs'
            defaultMessage='By clicking Send you agree to the '
          />
          <a
            href='/terms'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FormattedMessage
              id='RegisterInterestMessageForm.termsandconditions'
              defaultMessage='Terms and Conditions'
            />
          </a>
        </p>)}
      {showStaySafe && (
        <p style={{ float: 'right' }}>
          <Icon type='warning' theme='twoTone' twoToneColor='#6549AA' />&nbsp;
          <a href={staySafeUrl} target='_blank' rel='noopener noreferrer'>
            <FormattedMessage
              id='RegisterInterestMessageForm.staysafeonline'
              defaultMessage='Stay safe online'
            />
          </a>
        </p>
      )}
    </Modal>

  )
}

export default RegisterInterestMessageForm
