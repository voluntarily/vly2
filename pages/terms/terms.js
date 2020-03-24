import { Button } from 'antd'
import Markdown from 'markdown-to-jsx'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { FullPage } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'
import { injectIntl } from 'react-intl'

import termEn from './term-en-md.js'
import termMi from './term-mi-md.js'

const getText = locale => {
  switch (locale) {
    case 'mi': {
      return termMi()
    }
    case 'fr': {
      return termMi()
    }
  }
  return termEn()
}

const TermsSection = styled.div`
  width: 72rem;
  margin: 0 0;

  h1 {
    font-size: 3rem;
    letter-spacing: -3px;
    font-weight: bold;
    color: gray;
  }
  h3 {
    font-size: 2rem;
    letter-spacing: -3px;
  }
  p {
    font-size: 1rem;
    letter-spacing: -1.3px;
    font-weight: 400;
    color: #333;
    padding-bottom: 0.5rem;
  }

  @media screen and (min-width: 768px) and (max-width: 1025px) {
    width: calc(100vw - 4rem);
    margin: 2rem 0 2rem 0;
    letter-spacing: -01px;
    h1 {
      font-size: 2.5rem;
    }
  }

  @media screen and (max-width: 768px) {
    width: calc(100vw - 2rem);
    margin: 1rem 0 1rem 0;

    h1 {
      font-size: 2rem;
      letter-spacing: -1.5px;
    }

    p {
      font-size: 1.5rem;
    }
  }
`

class Terms extends Component {
  render () {
    const terms = getText(this.props.intl.locale)

    return (
      <FullPage>
        <Helmet>
          <title>Terms and Conditions - Voluntarily</title>
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
