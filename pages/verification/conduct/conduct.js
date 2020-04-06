import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { FullPage } from '../../../components/VTheme/VTheme'
import securePage from '../../../hocs/securePage'
import Markdown from 'markdown-to-jsx'
import styled from 'styled-components'
import conduct from './conduct-md-en.js'
import Link from 'next/link'
import { Button } from 'antd'
import { FormattedMessage } from 'react-intl'

const conductConfirmationLabel = (
  <FormattedMessage
    id='verification.conduct.confirmation'
    defaultMessage='Accept and continue'
    description='Label for Code of Conduct confirmation button'
  />
)

const TermsSection = styled.div`
  max-width: 35rem;
  margin: 2rem auto 5rem auto;
  border: 1px solid lightgrey;
  border-radius: 0.2rem;
  padding: 2rem;
`
class VerificationConductPage extends Component {
  render () {
    return (
      <FullPage>
        <Helmet>
          <title>Voluntarily - Code of Conduct</title>
        </Helmet>
        <TermsSection>
          <Markdown children={conduct()} />
          <Link href='./safety'>
            <Button shape='round' type='primary'>{conductConfirmationLabel}</Button>
          </Link>
        </TermsSection>
      </FullPage>
    )
  }
}
export const VerificationConductPageTest = VerificationConductPage
export default securePage(VerificationConductPage)
