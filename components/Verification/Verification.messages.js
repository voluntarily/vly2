import { FormattedMessage } from 'react-intl'
import React from 'react'

const errorTitle = (
  <FormattedMessage
    id='verification.error.title'
    defaultMessage='Whoops, something went wrong'
    description='Title of Verification error'
  />
)

const errorBody = (
  <FormattedMessage
    id='verification.error.body'
    defaultMessage='We weren’t able to complete our checks at this time. We’ll let the support team know and they’ll be in touch, we try to help everyone!'
    description='Detail of Verification error'
  />
)

const successTitle = (
  <FormattedMessage
    id='verification.success.title'
    defaultMessage="Nice, you're all set!"
    description='Successful ID verification title'
  />
)

const successBody = (
  <FormattedMessage
    id='verification.success.body'
    defaultMessage='Your details checked out, you now have the verified badge, and can ask for help, and offer to help.'
    description='This is the detail message the user sees when verification process was successful'
  />
)

export {
  errorTitle,
  errorBody,
  successTitle,
  successBody
}
