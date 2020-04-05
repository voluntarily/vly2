import { FormattedMessage } from 'react-intl'
import React from 'react'

const errorTitle = (
  <FormattedMessage
    id='verification.error.title'
    defaultMessage='Sorry something went wrong'
    description='This message is the title of the feedback the user sees when there was an error during the verification process'
  />
)

const errorBody = (
  <FormattedMessage
    id='verification.error.body'
    defaultMessage='Ohh... we really apologise but something went wrong during the verification. Would you mind trying it again after some time?'
    description='This is the detail message the user sees when there was an error during the verification process'
  />
)

const codeOfConductTitle = (
  <FormattedMessage
    id='verification.codeofconduct.title'
    defaultMessage='Code of Conduct'
    description='Title for Code of Conduct modal'
  />
)

export {
  errorTitle,
  errorBody,
  codeOfConductTitle
}
