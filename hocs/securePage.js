import React from 'react'
import PropTypes from 'prop-types'

import NotAuthorized from '../components/NotAuthorized'
import publicPage from './publicPage'

const securePageHoc = Page => class SecurePage extends React.Component {
  static getInitialProps (ctx) {
    return Page.getInitialProps && Page.getInitialProps(ctx)
  }
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
  }
  render () {
    if (!this.props.isAuthenticated) {
      return <NotAuthorized />
    }
    return <Page {...this.props} />
  }
}

export default Page => publicPage(securePageHoc(Page))
