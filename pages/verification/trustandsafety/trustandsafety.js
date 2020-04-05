import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { FullPage } from '../../../components/VTheme/VTheme'
import securePage from '../../../hocs/securePage'
import Markdown from 'markdown-to-jsx'
import trustandsafety from './trustandsafety-md-en.js'
import Router from 'next/router'
import { trustAndSafetyConfirmationLabel } from '../verification.messages'
import { Button } from 'antd'

class VerificationTrustAndSafetyPage extends Component {
  render () {
    return (
      <FullPage>
        <Helmet>
          <title>Voluntarily - Trust and Safety</title>
        </Helmet>
        <Markdown children={trustandsafety()} />
        <Button type='primary' onClick={() => Router.push('/api/verify')}>{trustAndSafetyConfirmationLabel}</Button>
      </FullPage>
    )
  }
}
export const TVerificationTrustAndSafetyPageTest = VerificationTrustAndSafetyPage
export default securePage(VerificationTrustAndSafetyPage)
