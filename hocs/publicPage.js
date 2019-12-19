import { Layout } from 'antd'
import React from 'react'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import { FillWindow } from '../components/VTheme/VTheme'
import { getSession } from '../lib/auth/auth'
import { Role } from '../server/services/authorize/role'

export default Page =>
  class DefaultPage extends React.Component {
    static async getInitialProps (ctx) {
      const session = await getSession(ctx.req, ctx.store)
      const pageProps =
        Page.getInitialProps && (await Page.getInitialProps(ctx))
      return {
        ...pageProps,
        me: session.me || false,
        isAuthenticated: !!session.isAuthenticated,
        isAdmin: session.me && session.me.role && session.me.role.includes(Role.ADMIN),
        isPlain: false
      }
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
