import { OpportunityStatus } from '../../server/api/opportunity/opportunity.constants'
import { FormattedMessage, useIntl, defineMessages } from 'react-intl'
import { Stamp } from '../../components/VTheme/Stamp'

export const OpportunityStatusMessages = defineMessages({
  [OpportunityStatus.DRAFT]: {
    id: 'OpportunityStatus.draft',
    defaultMessage: 'Draft',
    description: 'When an opportunity is being drafted'
  },
  [OpportunityStatus.ACTIVE]: {
    id: 'OpportunityStatus.active',
    defaultMessage: 'Active',
    description: 'When an opportunity has been published'
  },
  [OpportunityStatus.COMPLETED]: {
    id: 'OpportunityStatus.completed',
    defaultMessage: 'Completed',
    description: 'When an opportunity has been completed'
  },
  [OpportunityStatus.CANCELLED]: {
    id: 'OpportunityStatus.cancelled',
    defaultMessage: 'Cancelled',
    description: 'When an opportunity has been cancelled'
  }
})

/** Converts an opportunity status to a translated display string */
export const OpStatus = ({ status }) =>
  <FormattedMessage {...OpportunityStatusMessages[status]} />

/** Converts an opportunity status to a Stamp - except for Active */
export const OpStatusStamp = ({ status }) => {
  const intl = useIntl()
  return status !== OpportunityStatus.ACTIVE
    ? (
      <Stamp>
        {intl.formatMessage(OpportunityStatusMessages[status])}
      </Stamp>)
    : null
}
