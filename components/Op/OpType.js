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

export const OpTypeVerbs = defineMessages({
  [ASK]: {
    id: 'OpportunityType.verb.ASK',
    defaultMessage: '{count, plural, one {person} other {people}} asking for help',
    description: 'Asking for help'
  },
  [OFFER]: {
    id: 'OpportunityType.verb.OFFER',
    defaultMessage: '{count, plural, one {person} other {people}} offering to help',
    description: 'Offering help'
  }
})

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
  return (<>{OpTypeEmoji[type]}{count}&nbsp;<FormattedMessage {...OpTypeVerbs[type]} values={{ count }} /></>)
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
    defaultMessage: 'Let people know how much time you need, and if there are only a few dates you can be available.',
    description: 'Asking date prompt'
  },
  [OFFER]: {
    id: 'OpportunityType.date.prompt.OFFER',
    defaultMessage: 'Let people know how much time you have to give and if there are only a few dates you can give time.',
    description: 'Offering date prompt'
  }
})

export const OpTypeDatePrompt = ({ type }) => {
  if (!type || ![ASK, OFFER].includes(type)) return null
  return (<FormattedMessage {...OpTypeDatePromptMsg[type]} />)
}

const OpTypeDescriptionTitleMsg = defineMessages({
  [ASK]: {
    id: 'OpportunityType.description.title.ASK',
    defaultMessage: 'Anything Else?',
    description: 'Asking description title'
  },
  [OFFER]: {
    id: 'OpportunityType.description.title.OFFER',
    defaultMessage: 'Anything Else?',
    description: 'Offering description title'
  }
})
export const OpTypeDescriptionTitle = ({ type }) => {
  if (!type || ![ASK, OFFER].includes(type)) return null
  return (<FormattedMessage {...OpTypeDescriptionTitleMsg[type]} />)
}

const OpTypeDescriptionPromptMsg = defineMessages({
  [ASK]: {
    id: 'OpportunityType.description.prompt.ASK',
    defaultMessage: 'Is there anything else the helpers need to know to help you? Please don’t put your personal or contact details on here, we’ll take care of that later',
    description: 'Asking description prompt'
  },
  [OFFER]: {
    id: 'OpportunityType.description.prompt.OFFER',
    defaultMessage: 'Is there anything else you need to tell the people asking for help? Please don’t put personal or contact details here, we’ll take care of that later.',
    description: 'Offering description prompt'
  }
})
export const OpTypeDescriptionPrompt = ({ type }) => {
  if (!type || ![ASK, OFFER].includes(type)) return null
  return (<FormattedMessage {...OpTypeDescriptionPromptMsg[type]} />)
}

const OpTypeNoResultsMsg = defineMessages({
  [ASK]: {
    id: 'OpportunityType.prompt.notfound.ASK',
    defaultMessage: 'There are currently no locations available to apply for.',
    description: 'Message to display when an activity does not have any archived opportunities'
  },
  [OFFER]: {
    id: 'OpportunityType.prompt.notfound.OFFER',
    defaultMessage: 'Waiting for someone to offer to help.',
    description: 'Message to display when an activity does not have any archived opportunities'
  }
})

export const OpTypeNoResults = ({ type }) => {
  if (!type || ![ASK, OFFER].includes(type)) return null
  return (<FormattedMessage {...OpTypeNoResultsMsg[type]} />)
}
