import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { FullPage } from '../../../components/VTheme/VTheme'
import securePage from '../../../hocs/securePage'
import Markdown from 'markdown-to-jsx'
import codeOfConduct from './codeofconduct-md-en.js'
import Link from 'next/link'
import { Button } from 'antd'
import { codeOfConductConfirmationLabel } from '../verification.messages'

class VerificationCodeOfConductPage extends Component {
  render () {
    return (
      <FullPage>
        <Helmet>
          <title>Voluntarily - Code of Conduct</title>
        </Helmet>
        <Markdown children={codeOfConduct()} />
        <Link href='./trustandsafety'>
          <Button type='primary'>{codeOfConductConfirmationLabel}</Button>
        </Link>
      </FullPage>
    )
  }
}
export const VerificationCodeOfConductPageTest = VerificationCodeOfConductPage
export default securePage(VerificationCodeOfConductPage)
