import React from 'react'
import { FullPage } from '../../hocs/publicPage'
import { FormattedMessage } from 'react-intl'

export default class OpUnavailablePage extends React.Component {
  render () {
    return (<FullPage>
      <h2>
        <FormattedMessage
          id='op.notavailable'
          defaultMessage='Sorry, this opportunity is not available'
          description='message on person not found page'
        />
      </h2>
    </FullPage>)
  }
}
