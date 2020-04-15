import { Button } from 'antd'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import RegisterInterestSection from '../Interest/RegisterInterestSection'
import OpportunityType from '../Op/OpType'

export const OfferToHelpAnonBtn = ({ opid }) =>
  <Link href={`/auth/sign-thru?redirect=/ops/${opid}`}>
    <Button type='primary' style={{ width: '50%' }} size='large' shape='round'>
      <FormattedMessage id='offertohelp-anon' defaultMessage='Offer to help' description='Registration button on an op that leads to sign in page' />
    </Button>
  </Link>
export const AskForHelpAnonBtn = ({ opid }) =>
  <Link href={`/auth/sign-thru?redirect=/ops/${opid}`}>
    <Button type='primary' style={{ width: '50%' }} size='large' shape='round'>
      <FormattedMessage id='askforhelp-anon' defaultMessage='Ask for help' description='Registration button on an op that leads to sign in page' />
    </Button>
  </Link>
export const OpVolunteerInterestSection = ({ isAuthenticated, canRegisterInterest, opid, meid, type }) => {
  // if not signed in then the interested button signs in first
  if (!isAuthenticated) {
    if (type === OpportunityType.ASK) {
      return (<OfferToHelpAnonBtn opid={opid} />)
    }
    if (type === OpportunityType.OFFER) {
      return (<AskForHelpAnonBtn opid={opid} />)
    }
  }
  if (canRegisterInterest) {
    return (
      <RegisterInterestSection opid={opid} meid={meid} />
    )
  }
  return null
}
export default OpVolunteerInterestSection
