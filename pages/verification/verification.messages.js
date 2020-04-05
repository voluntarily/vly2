import { FormattedMessage } from 'react-intl'

const conductConfirmationLabel = (
  <FormattedMessage
    id='verification.conduct.confirmation'
    defaultMessage='Accept and continue'
    description='Label for Code of Conduct confirmation button'
  />
)

const safetyConfirmationLabel = (
  <FormattedMessage
    id='verification.trustandsafety.confirmation'
    defaultMessage='Verify Identity'
    description='Label for Trust and Safety confirmation button'
  />
)

export {
  conductConfirmationLabel,
  safetyConfirmationLabel
}
