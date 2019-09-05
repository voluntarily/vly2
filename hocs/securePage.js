import React from 'react'
import PropTypes from 'prop-types'
import { authorize } from '../lib/auth/auth0'
import publicPage from './publicPage'

const securePageHoc = Page => class SecurePage extends React.Component {
  static getInitialProps (ctx) {
    return Page.getInitialProps && Page.getInitialProps(ctx)
  }

  componentDidMount () {
    if (!this.props.isAuthenticated) { authorize({ redirectUrl: window.location.href }) }
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
  }
  render () {
    if (this.props.isAuthenticated) {
      return <Page {...this.props} />
    }
    return null
  }
}
export default Page => publicPage(securePageHoc(Page))
