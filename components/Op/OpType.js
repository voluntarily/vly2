import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
import { FormattedMessage, useIntl, defineMessages } from 'react-intl'
import { Stamp } from '../../components/VTheme/Stamp'
const { ASK, OFFER } = OpportunityType
export const OpTypeMessages = defineMessages({
  [ASK]: {
    id: 'OpportunityType.ASK',
    defaultMessage: 'is asking for help',
    description: 'Ask label prefix'
  },
  [OFFER]: {
    id: 'OpportunityType.OFFER',
    defaultMessage: 'can help you',
    description: 'Offer label prefix'
  }
})

export const OpTypeAct = defineMessages({
  [ASK]: {
    id: 'OpportunityType.ActASK',
    defaultMessage: 'Requests',
    description: 'Ask label prefix'
  },
  [OFFER]: {
    id: 'OpportunityType.ActOFFER',
    defaultMessage: 'Offers',
    description: 'Offer label prefix'
  }
})

export const OpTypeTitle = ({ type }) => {
  if (!type || ![ASK, OFFER].includes(type)) return null
  return (<FormattedMessage {...OpTypeAct[type]} />)
}

/** Converts an opportunity type to a translated display string */
export const OpType = ({ type }) => {
  if (!type || ![ASK, OFFER].includes(type)) return null
  return (<FormattedMessage {...OpTypeMessages[type]} />)
}

export const OpTypeVerbs = defineMessages({
  [ASK]: {
    id: 'OpportunityType.verb.ASK',
    defaultMessage: 'asking for help',
    description: 'Asking for help'
  },
  [OFFER]: {
    id: 'OpportunityType.verb.OFFER',
    defaultMessage: 'offering to help',
    description: 'Offering help'
  }
})

export const OpTypeEmoji = {
  [ASK]: '🙋',
  [OFFER]: '💁🏻'
}

/**
 * 10 offering to help
 * 10 asking for help
 * @param {*} param0
 */
export const OpTypeCount = ({ counts, type }) => {
  if (!counts) return null
  if (!type || ![ASK, OFFER].includes(type)) return null
  const count = counts[type]
  if (!count) return null // print not zero results
  return (<>{OpTypeEmoji[type]}{count}&nbsp;<FormattedMessage {...OpTypeVerbs[type]} /></>)
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

export const OpCommitment = ({ duration }) => {
  if (!duration) return null
  return (
    <>
      ⏱{duration}&nbsp;
      <FormattedMessage
        id='OpType.duration'
        defaultMessage='commitment'
        description='e.g 10 hours commitment'
      />
    </>)
}
