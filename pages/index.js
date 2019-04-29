import React, { Component } from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import Link from 'next/link'
import withIntl from '../lib/withIntl'
import publicPage from '../hocs/publicPage'

class Index extends Component {
  static getInitialProps () {
    // Do something
  }

  render () {
    return (
      <div>
        <Link href='/about'>
          <a>About Page</a>
        </Link>

        <p>
          <FormattedMessage id='greeting' defaultMessage='Voluntari.ly is coming soon' />
        </p>
        <p>
          <FormattedNumber value={1000} />
        </p>
      </div>
    )
  }
}
export default publicPage(withIntl(Index))
