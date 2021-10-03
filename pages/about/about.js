import { Button } from 'antd'
import Markdown from 'markdown-to-jsx'
import React, { Component } from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import AboutCTA from '../../components/About/AboutCTA.js'
import { FullPage, Spacer } from '../../components/VTheme/VTheme'
import { injectIntl } from 'react-intl'
import aboutEn from './about-en-md.js'
import aboutMi from './about-mi-md.js'

const getText = locale => {
  switch (locale) {
    case 'mi': {
      return aboutMi()
    }
    case 'fr': {
      return aboutMi()
    }
  }
  return aboutEn()
}

const AboutSection = styled.div`
  width: 72rem;
  margin: 0 0;

  h1 {
    font-size: 4rem;
    letter-spacing: -3px;
    font-weight: bold;
    color: gray;
  }

  p {
    font-size: 2rem;
    letter-spacing: -1.3px;
    font-weight: 400;
    color: #333;
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

class About extends Component {
  render () {
    const about = getText(this.props.intl.locale)

    return (
      <FullPage>
        <Head>
          <title>Voluntarily - Home</title>
        </Head>
        <Spacer />
        <Spacer />
        <AboutSection>
          <Markdown
            children={about}
            options={{
              overrides: {
                Button: { component: Button }
              }
            }}
          />
        </AboutSection>
        <AboutCTA />

        <style jsx>{`
          div {
            margin: 3em;
            max-width: 50em;
          }
          @media (max-width: 600px) {
            div {
              margin: 0 3em;
            }
          }
        `}
        </style>
      </FullPage>
    )
  }
}

export const AboutTest = About // for test

export default injectIntl(About)
