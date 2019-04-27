import React, { Component } from 'react'
import Layout from '../../components/Layout'
import Markdown from 'markdown-to-jsx'
import { Button } from 'antd'
import aboutEn from './about-en-md.js'
import aboutMi from './about-mi-md.js'
import withIntl from '../../lib/withIntl'

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
      <Layout>
        <div className='about'>
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
      </Layout>

    )
  }
};

export default withIntl(About)
