import { Button, Modal } from 'antd'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { useState } from 'react'
import { SignUpButton, SignInButton } from '../../components/VTheme/Buttons'

const SignUpInviteTitle = (
  <FormattedMessage
    id='SignUpModal.title'
    defaultMessage='Ready to get involved'
    description='title on sign up or sign in invitation '
  />
)

/**
 * This page asks the person to select whether they are an asker or offerer
 */
export const SignUpInviteModal = ({ children, href }) => {
  const [showModal, setShowModal] = useState(false)
  const session = useSelector(state => state.session)
  if (session.isAuthenticated) {
    return (
      <Link href={href}>
        <Button type='primary' shape='round' size='large' style={{ width: '10rem' }}>
          {children}
        </Button>
      </Link>)
  }
  const handleClick = () => {
    setShowModal(true)
  }
  const handleCancel = () => {
    setShowModal(false)
  }
  return (
    <>
      <Button type='primary' shape='round' size='large' style={{ width: '10rem' }} onClick={handleClick}>
        {children}
      </Button>
      <Modal
        title={SignUpInviteTitle}
        visible={showModal}
        closable
        footer={[
          <SignUpButton key='sign-up' then='/flow/postSignUp' />,
          <SignInButton key='sign-in' then={href} />
        ]}
        onCancel={handleCancel}
      >
        <FormattedMessage
          id='SignUpModal.body'
          defaultMessage='You need to sign in or create an account to take the next step'
          description='content on sign up or sign in invitation modal'
        />
      </Modal>
    </>)
}
export default SignUpInviteModal
