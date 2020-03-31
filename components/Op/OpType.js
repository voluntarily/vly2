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

export const OpTypeImperativeMsg = defineMessages({
  [ASK]: {
    id: 'OpportunityType.imp.ASK',
    defaultMessage: 'Ask for help with',
    description: 'Asking for help command'
  },
  [OFFER]: {
    id: 'OpportunityType.imp.OFFER',
    defaultMessage: 'Offer to help with',
    description: 'Offering help command'
  }
})
export const OpTypeImperative = ({ type }) => {
  if (!type || ![ASK, OFFER].includes(type)) return null
  return (<FormattedMessage {...OpTypeImperativeMsg[type]} />)
}

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

const OpTypeLocationMsg = defineMessages({
  [ASK]: {
    id: 'OpportunityType.location.ASK',
    defaultMessage: 'Where do you need help?',
    description: 'Asking location prompt'
  },
  [OFFER]: {
    id: 'OpportunityType.location.OFFER',
    defaultMessage: 'Where do you want to help?',
    description: 'Offering location prompt'
  }
})
export const OpTypeLocationPrompt = ({ type }) => {
  if (!type || ![ASK, OFFER].includes(type)) return null
  return (<FormattedMessage {...OpTypeLocationMsg[type]} />)
}

const OpTypeDateTitleMsg = defineMessages({
  [ASK]: {
    id: 'OpportunityType.date.title.ASK',
    defaultMessage: 'When do you need help?',
    description: 'Asking date title'
  },
  [OFFER]: {
    id: 'OpportunityType.date.title.OFFER',
    defaultMessage: 'When do you want to help?',
    description: 'Offering date title'
  }
})
export const OpTypeDateTitle = ({ type }) => {
  if (!type || ![ASK, OFFER].includes(type)) return null
  return (<FormattedMessage {...OpTypeDateTitleMsg[type]} />)
}
const OpTypeDatePromptMsg = defineMessages({
  [ASK]: {
    id: 'OpportunityType.date.prompt.ASK',
    defaultMessage: 'Let people know how much time you need, or if is a specific date you need help on. (optional)',
    description: 'Asking date prompt'
  },
  [OFFER]: {
    id: 'OpportunityType.date.prompt.OFFER',
    defaultMessage: 'Let people know how much time you have to give and any specific dates you are available',
    description: 'Offering date prompt'
  }
})

export const OpTypeDatePrompt = ({ type }) => {
  if (!type || ![ASK, OFFER].includes(type)) return null
  return (<FormattedMessage {...OpTypeDatePromptMsg[type]} />)
}

const OpTypeDescriptionMsg = defineMessages({
  [ASK]: {
    id: 'OpportunityType.description.ASK',
    defaultMessage: 'Need anything specific?',
    description: 'Asking description prompt'
  },
  [OFFER]: {
    id: 'OpportunityType.description.OFFER',
    defaultMessage: 'Offering anything specific?',
    description: 'Offering description prompt'
  }
})
export const OpTypeDescriptionPrompt = ({ type }) => {
  if (!type || ![ASK, OFFER].includes(type)) return null
  return (<FormattedMessage {...OpTypeDescriptionMsg[type]} />)
}
