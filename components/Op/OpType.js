import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
import { FormattedMessage, useIntl, defineMessages } from 'react-intl'
import { Stamp } from '../../components/VTheme/Stamp'
const { ASK, OFFER } = OpportunityType
export const OpTypeMessages = defineMessages({
  [ASK]: {
    id: 'OpportunityType.ASK',
    defaultMessage: 'Ask',
    description: 'Asking for help'
  },
  [OFFER]: {
    id: 'OpportunityType.OFFER',
    defaultMessage: 'Offer',
    description: 'Offering help'
  }
})

/** Converts an opportunity type to a translated display string */
export const OpType = ({ type }) => {
  if (!type || ![ASK, OFFER].includes(type)) return null
  return (<FormattedMessage {...OpTypeMessages[type]} />)
}

/** Converts an opportunity type to a Stamp - except for Active */
export const OpTypeStamp = ({ type }) => {
  if (!type || ![ASK, OFFER].includes(type)) return null
  const intl = useIntl()
  return (
    <Stamp>
      {intl.formatMessage(OpTypeMessages[type])}
    </Stamp>)
}
