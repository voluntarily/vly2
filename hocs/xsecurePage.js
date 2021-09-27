import React from 'react'

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

const securePageHoc = Page => {
  const SecurePage = props =>
    props.isAuthenticated
      ? <Page {...props} />
      : <Unverified {...props} />

  SecurePage.getInitialProps = async ctx => {
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
    console.log('secure page hoc', Page.getInitialProps )
    // return ({ isAuthenticated: true })
    return (Page.getInitialProps ? Page.getInitialProps(ctx) : { isAuthenticated: true })
  }
  return SecurePage
}
export default Page => securePageHoc(Page)
