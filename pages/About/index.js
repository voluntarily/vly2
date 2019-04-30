import React, { Component } from 'react'
import Head from 'next/head'
import Markdown from 'markdown-to-jsx'
import { Button } from 'antd'
import aboutEn from './about-en-md.js'
import aboutMi from './about-mi-md.js'
import withIntl from '../../lib/withIntl'
import publicPage from '../../hocs/publicPage'
const getText = (locale) => {
  switch (locale) {
    case 'mi': { return aboutMi() }
    case 'fr': { return aboutMi() }
  }
  return aboutEn()
}

class About extends Component {
  render () {
    const about = getText(this.props.intl.locale)
    return (

      <div className='about'>
        <Head><title>Voluntari.ly - About</title></Head>
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
      </div>
    )
  }
};

export default publicPage(withIntl(About))
