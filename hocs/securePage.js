import React from 'react'
import publicPage from './publicPage'
import Router from 'next/router'
import { FullPage } from '../components/VTheme/VTheme'
import Link from 'next/link'
import { getSession } from '../lib/auth/auth'
import { Button } from 'antd'
// TODO: Does this result in GetInitialProps being called multiple times?
const securePageHoc = Page => class SecurePage extends React.Component {
  static async getInitialProps (ctx) {
    const session = await getSession(ctx.req, ctx.store)
    if (!session || !session.user) {
      // no session or not auth - redirect to sign in
      if (ctx.isServer) {
        const redirectUrl = encodeURIComponent(ctx.req.url)
        const signThruUrl = `/auth/sign-thru?redirect=${redirectUrl}`
        ctx.res.writeHead(302, { Location: signThruUrl })
        ctx.res.end()
      } else {
        const redirectUrl = encodeURIComponent(ctx.asPath)
        const signThruUrl = `/auth/sign-thru?redirect=${redirectUrl}`
        Router.push(signThruUrl)
      }
      return {}
    }
    // we have a session - check user validation
    if (!session.user.email_verified) {
      return {
        isAuthenticated: false
      }
    }
    // securePage always wraps publicPage so we know GIP exists.
    return Page.getInitialProps(ctx)
  }

  render () {
    if (this.props.isAuthenticated) {
      return <Page {...this.props} />
    }
    return (
      <FullPage>
        <h1>Voluntarily Authentication Issue</h1>
        <p>You are signed in, but your account is not currently enabled. </p>
        <p>Please check you have responded to any email address verification requests and then try again</p>
        <p>If problems continue please contact technical support.</p>

        <Link href='/auth/sign-off'><Button>OK</Button></Link>
      </FullPage>
    )
  }
}
export default Page => securePageHoc(publicPage(Page))
