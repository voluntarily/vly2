import { Button } from 'antd'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import RegisterInterestSection from '../Interest/RegisterInterestSection'

export const OpVolunteerInterestSection = ({ isAuthenticated, canRegisterInterest, opID, meID }) => {
  // if not signed in then the interested button signs in first
  if (!isAuthenticated) {
    return (
      <Link href={`/auth/sign-thru?redirect=/ops/${opID}`}>
        <Button type='primary' size='large' shape='round'>
          <FormattedMessage id='iminterested-anon' defaultMessage="I'm Interested" description="I'm interested button that leads to sign in page" />
        </Button>
      </Link>
    )
  }

  if (canRegisterInterest) {
    return (
      <RegisterInterestSection opID={opID} meID={meID} />
    )
  }
  return null
}

export default OpVolunteerInterestSection
