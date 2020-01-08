import React from 'react'
import publicPage from './publicPage'
import Router from 'next/router'
// TODO: Does this result in GetInitialProps being called multiple times?
const securePageHoc = Page => class SecurePage extends React.Component {
  static async getInitialProps (ctx) {
    if (Page.getInitialProps) {
      const initialProps = await Page.getInitialProps(ctx)
      if (!initialProps.isAuthenticated) {
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
      return initialProps
    }
  }

  render () {
    if (this.props.isAuthenticated) {
      return <Page {...this.props} />
    }
    return <h1>Sign in</h1>
  }
}
export default Page => securePageHoc(publicPage(Page))
