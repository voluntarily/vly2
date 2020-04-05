import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { FullPage } from '../../../components/VTheme/VTheme'
import securePage from '../../../hocs/securePage'
import Markdown from 'markdown-to-jsx'
import styled from 'styled-components'
import safety from './safety-md-en.js'
import Router from 'next/router'
import { safetyConfirmationLabel } from '../verification.messages'
import { Button } from 'antd'

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
        <Helmet>
          <title>Voluntarily - Trust and Safety</title>
        </Helmet>
        <TermsSection>
          <Markdown children={safety()} />
          <Button shape='round' type='primary' onClick={() => Router.push('/api/verify')}>{safetyConfirmationLabel}</Button>
        </TermsSection>
      </FullPage>
    )
  }
}
export const VerificationSafetyPageTest = VerificationSafetyPage
export default securePage(VerificationSafetyPage)
