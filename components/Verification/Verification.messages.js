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

const successTitle = (
  <FormattedMessage
    id='verification.success.title'
    defaultMessage='Verification Successful'
    description='This message is the title of the feedback the user sees when verification was successful'
  />
)

const successBody = (
  <FormattedMessage
    id='verification.success.body'
    defaultMessage='Awesome mate! Your verification was successful. Have a look at the badges in your profile.'
    description='This is the detail message the user sees when verification process was successful'
  />
)

export {
  errorTitle,
  errorBody,
  successTitle,
  successBody
}
