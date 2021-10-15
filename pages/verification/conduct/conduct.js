import React, { Component } from 'react'
import Head from 'next/head'
import { FullPage } from '../../../components/VTheme/VTheme'
import styled from 'styled-components'
import Conduct from '../../../assets/notices/conduct-short-en.md'
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
        <Head>
          <title>Voluntarily - Code of Conduct</title>
        </Head>
        <TermsSection>
          <Conduct />
          <Link href='./safety' passHref>
            <Button shape='round' type='primary'>{conductConfirmationLabel}</Button>
          </Link>
        </TermsSection>
      </FullPage>
    )
  }
}
export const VerificationConductPageTest = VerificationConductPage
export default VerificationConductPage
