import { Layout } from 'antd'
import Cookie from 'js-cookie'
import Router from 'next/router'
import React from 'react'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import { FillWindow } from '../components/VTheme/VTheme'
import { getUserFromLocalCookie, getUserFromServerCookie, parseUserToSession } from '../lib/auth/auth'
import { setSession } from '../lib/redux/actions'
import { Role } from '../server/services/authorize/role'

export default Page =>
  class DefaultPage extends React.Component {
    static async getInitialProps (ctx) {
      const cookies = ctx.req ? ctx.req.cookies : Cookie.get()
      let session = {}
      const loggedUser = process.browser
        ? getUserFromLocalCookie()
        : getUserFromServerCookie(ctx.req)
      if (loggedUser) {
        try {
          session = await parseUserToSession(loggedUser, cookies)
          ctx.store.dispatch(setSession(session))
        } catch (err) {
          console.error('PublicPage error parsing user session: ', err)
        }
      }

      const pageProps =
        Page.getInitialProps && (await Page.getInitialProps(ctx))
      return {
        ...pageProps,
        me: session.me || false,
        isAuthenticated: !!session.isAuthenticated,
        isAdmin: session.me && session.me.role.includes(Role.ADMIN),
        isPlain: false
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
          {!this.props.isPlain && <Header {...this.props} />}
          <Layout.Content>
            <FillWindow>
              <Page {...this.props} />
            </FillWindow>
          </Layout.Content>
          {!this.props.isPlain && <Footer {...this.props} />}
        </Layout>
      )
    }
  }
