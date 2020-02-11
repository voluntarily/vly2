import { Layout } from 'antd'
import React from 'react'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import { FillWindow } from '../components/VTheme/VTheme'
import { getSession } from '../lib/auth/auth'
import { Role } from '../server/services/authorize/role'
import { IntlProvider } from 'react-intl'
import withRedux from 'next-redux-wrapper'
import { makeStore } from '../lib/redux/reduxApi'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
const theme = {
  primary: 'green'
}

export const PublicPage = Page =>
  class DefaultPage extends React.Component {
    static async getInitialProps (ctx) {
      const session = await getSession(ctx.req, ctx.store)
      const pageProps =
        Page.getInitialProps && (await Page.getInitialProps(ctx))
      // Get the `locale` and `messages` from the request object on the server.
      // In the browser, use the same values that the server serialized.
      const { req } = ctx
      const { locale, messages } = req || window.__NEXT_DATA__.props.initialProps
      const initialNow = Date.now()

      return {
        ...pageProps,
        me: session.me || false,
        isAuthenticated: session.isAuthenticated,
        isAdmin: session.me && session.me.role && session.me.role.includes(Role.ADMIN),
        isPlain: false,
        locale,
        messages,
        initialNow
      }
    }

    render () {
      const { isPlain, locale, messages, initialNow, store } = this.props

      return (
        <Provider store={store}>
          <ThemeProvider theme={theme}>

            <IntlProvider
              locale={locale}
              messages={messages}
              initialNow={initialNow}
            >
              <Layout>
                {!isPlain && <Header {...this.props} />}
                <Layout.Content>
                  <FillWindow>
                    <Page {...this.props} />
                  </FillWindow>
                </Layout.Content>
                {!isPlain && <Footer {...this.props} />}
              </Layout>
            </IntlProvider>
          </ThemeProvider>
        </Provider>

      )
    }
  }

export default withRedux(makeStore, { debug: true })(PublicPage)
