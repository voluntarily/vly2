import React, { Component } from 'react'
import Head from 'next/head'
import { FullPage } from '../../../components/VTheme/VTheme'
import Markdown from 'markdown-to-jsx'
import styled from 'styled-components'
import safety from './safety-md-en.js'
import Router from 'next/router'
import { Button } from 'antd'
import { FormattedMessage } from 'react-intl'

const safetyConfirmationLabel = (
  <FormattedMessage
    id='verification.trustandsafety.confirmation'
    defaultMessage='Verify Identity'
    description='Label for Trust and Safety confirmation button'
  />
)

const TermsSection = styled.div`
  max-width: 35rem;
  margin: 2rem auto 5rem auto;
  border: 1px solid lightgrey;
  border-radius: 0.2rem;
  padding: 2rem;
`

class VerificationSafetyPage extends Component {
  render () {
    return (
      <FullPage>
        <Head>
          <title>Voluntarily - Trust and Safety</title>
        </Head>
        <TermsSection>
          <Markdown>{safety()}</Markdown>
          <Button shape='round' type='primary' onClick={() => Router.push('/api/verify')}>{safetyConfirmationLabel}</Button>
        </TermsSection>
      </FullPage>
    )
  }
}
export const VerificationSafetyPageTest = VerificationSafetyPage
export default VerificationSafetyPage
