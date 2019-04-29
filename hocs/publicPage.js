import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import styled from 'styled-components'

import { getUserFromServerCookie, getUserFromLocalCookie } from '../lib/auth/auth'
import { Layout } from 'antd'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'

export const A4 = styled.div`
  margin: 3em;
  padding-bottom: 4em;
  max-width: 50em;

  @media (max-width: 600px) {
    .div {
      margin: 0 3em;
    }
  }
`
export const FullPage = styled.div`
  margin: 3em;
  padding-bottom: 4em;

  @media (max-width: 600px) {
    .div {
      margin: 0 3em;
    }
  }
`

export default Page => class DefaultPage extends React.Component {
  static getInitialProps (ctx) {
    const loggedUser = process.browser ? getUserFromLocalCookie() : getUserFromServerCookie(ctx.req)
    const pageProps = Page.getInitialProps && Page.getInitialProps(ctx)
    return {
      ...pageProps,
      loggedUser,
      currentUrl: ctx.pathname,
      isAuthenticated: !!loggedUser
    }
  }

  constructor (props) {
    super(props)

    this.logout = this.logout.bind(this)
  }

  logout (eve) {
    if (eve.key === 'logout') {
      Router.push(`/?logout=${eve.newValue}`)
    }
  }

  componentDidMount () {
    window.addEventListener('storage', this.logout, false)
  }

  componentWillUnmount () {
    window.removeEventListener('storage', this.logout, false)
  }

  render () {
    return (
      <Layout>
        {console.log('is Auth:', this.props.isAuthenticated)}
        <Head>
          <title>Voluntari.ly</title>
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta charSet='utf-8' />
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        </Head>
        <Header {...this.props} />
        <Layout.Content >
          <Page {...this.props} />
        </Layout.Content >
        <Footer {...this.props} />
      </Layout>
    )
  }
}
