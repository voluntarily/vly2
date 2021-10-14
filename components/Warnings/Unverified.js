import Link from 'next/link'
import { Button } from 'antd'
import { FormattedMessage } from 'react-intl'
import { FullPage } from '../VTheme/VTheme'


export const Unverified = ({ user }) =>
  <FullPage>
    <FormattedMessage
      id='unverified.message'
      description='explanation for someone that their email is not verified'
      defaultMessage={`
      <h1>Email not verified</h1>
      <p>You have signed in as {name} but your email account is not currently verified. </p>
      <p>Please check your email inbox and spam box for a verification request to complete the registration process. </p>
      <p>If problems continue please contact technical support.</p>`}
      values={{
        h1: (...chunks) => <h1>{chunks}</h1>,
        p: (...chunks) => <p>{chunks}</p>,
        name: user.email
      }}
    />

    <Link href='/auth/sign-off'>
      <Button size='large' shape='round' type='primary' style={{ marginTop: '2rem' }}>
        <FormattedMessage
          id='unverified.button'
          description='try again button'
          defaultMessage='Sign out and try again'
        />
      </Button>
    </Link>

  </FullPage>

export default Unverified
