import React from 'react'
import publicPage from './publicPage'
import Router from 'next/router'
import { Unverified } from '../components/Warnings/Unverified'

export const doSignThru = ctx => {
  if (ctx.res) {
    const redirectUrl = encodeURIComponent(ctx.req.url)
    const signThruUrl = `/auth/sign-thru?redirect=${redirectUrl}`
    ctx.res.writeHead(302, { Location: signThruUrl })
    ctx.res.end()
  } else {
    const redirectUrl = encodeURIComponent(ctx.asPath)
    const signThruUrl = `/auth/sign-thru?redirect=${redirectUrl}`
    Router.push(signThruUrl)
  }
}

const UnverifiedPage = publicPage(Unverified)

const securePageHoc = Page => {
  const SecurePage = props =>
    props.isAuthenticated
      ? <Page {...props} />
      : <UnverifiedPage {...props} />

  SecurePage.getInitialProps = ctx => {
    const session = ctx.store.getState().session
    if (!session || !session.user) {
      // no session or not auth - redirect to sign in
      doSignThru(ctx)
      return { isAuthenticated: false }
    }
    // we have a session - check user validation
    if (!session.isAuthenticated) {
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
  return SecurePage
}
export default Page => securePageHoc(publicPage(Page))
