import { Button } from 'antd'
import { FormattedMessage } from 'react-intl'
import { authorize } from '../../lib/auth/auth0'

export const BackButton = ({ onClick }) =>
  <Button
    id='backBtn'
    onClick={onClick}
    shape='round'
  >
    <FormattedMessage
      id='Button.Back'
      defaultMessage='Back'
    />
  </Button>

export const DoneButton = ({ onClick }) =>
  <Button
    id='doneBtn'
    name='done'
    shape='round'
    type='primary'
    onClick={onClick}
    // style={{ marginLeft: 8 }}
  >
    <FormattedMessage
      id='DoneBtn.label'
      defaultMessage='Done'
    />
  </Button>

export const SaveDraftButton = ({ onClick }) =>
  <Button
    id='saveDraftBtn'
    name='save'
    shape='round'
    onClick={onClick}
  >
    <FormattedMessage
      id='Button.editSaveDraft'
      defaultMessage='Save as draft'
    />
  </Button>

export const AcceptAndContinueButton = ({ onClick }) =>
  <Button
    id='acceptAndContinueBtn'
    name='accept'
    shape='round'
    type='primary'
    onClick={onClick}
  >
    <FormattedMessage
      id='Button.AcceptAndContinue'
      defaultMessage='Accept and Continue'
    />
  </Button>

/** Click sign up - flow through privacy accept,
 * then route to 'then' which being a secure page will trigger
 * authentication */
export const SignUpButton = ({ then }) => {
  const handleAccept = () => {
    authorize({ redirectUrl: then, screen_hint: 'signup' })
  }
  return (
    <Button
      type='primary'
      shape='round'
      size='large'
      onClick={handleAccept}
      style={{ marginTop: '1rem', marginRight: '0.5rem' }}
    >
      <FormattedMessage
        id='Button.SignUp'
        defaultMessage='Sign Up'
      />
    </Button>)
}

/** Learn More button
 * - links to CMS pages
 * opens in separate tab */
export const LearnMoreButton = () =>
  <Button
    type='secondary'
    shape='round'
    size='large'
    href='https://blog.voluntarily.nz'
  >
    <FormattedMessage
      id='Button.LearnMore'
      defaultMessage='Learn More'
    />
  </Button>
