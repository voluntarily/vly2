import React, { Component } from 'react'
import Head from 'next/head'
import Markdown from 'markdown-to-jsx'
import { Button } from 'antd'
import aboutEn from './about-en-md.js'
import aboutMi from './about-mi-md.js'
import withIntl from '../../lib/withIntl'
import publicPage, { FullPage } from '../../hocs/publicPage'
import { Spacer } from '../../Components/VTheme/VTheme'
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

class About extends Component {
  render () {
    const about = getText(this.props.intl.locale)

    return (
      <FullPage>
        <Head>
          <title>Voluntari.ly - About</title>
        </Head>
        <Spacer />
        <Markdown
          children={about}
          options={{
            overrides: {
              Button: { component: Button }
            }
          }}
        />
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
        `}</style>
      </FullPage>
    )
  }
}

export const AboutTest = About // for test

export default publicPage(withIntl(About))
