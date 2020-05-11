import { FormattedMessage } from 'react-intl'
import RegisterInterestSection from '../Interest/RegisterInterestSection'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
import { SignUpInviteModal } from '../SignUp/SignUpInviteModal'

export const OfferToHelpAnonBtn = ({ opid }) =>
  <SignUpInviteModal href={`/auth/sign-thru?redirect=/ops/${opid}`}>
    <FormattedMessage id='offertohelp-anon' defaultMessage='Offer to help' description='Registration button on an op that leads to sign in page' />
  </SignUpInviteModal>

export const AskForHelpAnonBtn = ({ opid }) =>
  <SignUpInviteModal href={`/auth/sign-thru?redirect=/ops/${opid}`}>
    <FormattedMessage id='askforhelp-anon' defaultMessage='Ask for help' description='Registration button on an op that leads to sign in page' />
  </SignUpInviteModal>

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
