import { FormattedMessage } from 'react-intl'

const codeOfConductConfirmationLabel = (
  <FormattedMessage
    id='verification.codeofconduct.confirmation'
    defaultMessage='Accept Code of Conduct'
    description='Lable for Code of Conduct confirmation button'
  />
)

const trustAndSafetyConfirmationLabel = (
  <FormattedMessage
    id='verification.trustandsafety.confirmation'
    defaultMessage='Verify Identity'
    description='Lable for Trust and Safety confirmation button'
  />
)

export {
  codeOfConductConfirmationLabel,
  trustAndSafetyConfirmationLabel
}
