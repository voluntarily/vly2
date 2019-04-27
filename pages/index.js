import React, { Component } from 'react'
import { FormattedMessage, FormattedNumber, defineMessages } from 'react-intl'
import Link from 'next/link'
import Layout from '../components/Layout'
import withIntl from '../lib/withIntl'


class Index extends Component {
  static getInitialProps () {
    // Do something
  }

  render () {
    const { intl } = this.props

    return ( 
      <Layout>
        <Link href="/about">
          <a>About Page</a>
        </Link>
        
        <p>
          <FormattedMessage id='greeting' defaultMessage='Voluntari.ly is coming soon' />
        </p>
        <p>
          <FormattedNumber value={1000} />
        </p>
      </Layout>
    )
  }
}
export default withIntl(Index)