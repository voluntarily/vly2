import { Button } from 'antd'
import Markdown from 'markdown-to-jsx'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { FullPage } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'
import { injectIntl } from 'react-intl'

import termsEn from './terms-en-md.js'

const getText = locale => {
  return termsEn()
}

const TermsSection = styled.div`
  max-width: 60rem;
  margin: 10rem auto;
`

class Terms extends Component {
  render () {
    const terms = getText(this.props.intl.locale)

    return (
      <FullPage>
        <Helmet>
          <title>Terms of Use - Voluntarily</title>
        </Helmet>
        <TermsSection>
          <Markdown
            children={terms}
            options={{
              overrides: {
                Button: { component: Button }
              }
            }}
          />
        </TermsSection>
      </FullPage>
    )
  }
}

export const TermsTest = Terms // for test

export default publicPage(injectIntl(Terms))
