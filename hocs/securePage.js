import React from 'react'
import publicPage from './publicPage'
import Router from 'next/router'
import { FullPage } from '../components/VTheme/VTheme'
import { getSession } from '../lib/auth/auth'
import { Unverified } from '../components/Warnings/Unverified'
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
      // do not allow page props to be fetched if email not verified.
      return {
        isAuthenticated: false,
        isAdmin: false,
        user: session.user
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
        <Unverified {...this.props} />
      </FullPage>
    )
  }
}
export default Page => securePageHoc(publicPage(Page))
