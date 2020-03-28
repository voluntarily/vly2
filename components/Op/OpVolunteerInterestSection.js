import { Button } from 'antd'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import RegisterInterestSection from '../Interest/RegisterInterestSection'

export const OpVolunteerInterestSection = ({ isAuthenticated, canRegisterInterest, opid, meid }) => {
  // if not signed in then the interested button signs in first
  if (!isAuthenticated) {
    return (
      <Link href={`/auth/sign-thru?redirect=/ops/${opid}`}>

        <Button type='primary' style={{ width: '50%' }} size='large' shape='round'>
          <FormattedMessage id='iminterested-anon' defaultMessage='Offer to help' description='Registration button on an op that leads to sign in page' />
        </Button>

      </Link>
    )
  }

  if (canRegisterInterest) {
    return (
      <RegisterInterestSection opid={opid} meid={meid} />
    )
  }
  return null
}

export default OpVolunteerInterestSection
