import '../assets/voluntarily.less'

import React from 'react'
import App from 'next/app'
import { IntlProvider } from 'react-intl'
import { Layout } from 'antd'

import { getSession } from '../lib/auth/auth.js'
import { Role } from '../server/services/authorize/role.js'
import Footer from '../components/Footer/Footer.js'
import Header from '../components/Header/Header.js'
import { FillWindow } from '../components/VTheme/VTheme.js'
import { reduxWrapper } from '../lib/redux/store.js'
import { RouteGuard } from '../components/RouteGuard.js'

function MyApp ({
  Component,
  locale,
  messages,
  pageProps
}) {
  console.log('MyApp', locale)
  return (
    <>
      <IntlProvider locale={locale} messages={messages} initialNow={Date.now()}>
        <Layout>
          <Header {...pageProps} />
          <Layout.Content>
            <FillWindow>
              <RouteGuard>
                <Component {...pageProps} />
              </RouteGuard>
            </FillWindow>
          </Layout.Content>
          <Footer {...pageProps} />
        </Layout>
      </IntlProvider>
    </>
  )
}

/*  app Context has:
  AppTree: [Function: AppTree],
  Component: [Function: DefaultPage],
  router: ServerRouter
  ctx: includes req, res, store.
*/

MyApp.getInitialProps = reduxWrapper.getInitialAppProps(store =>
  async (appContext) => {
    const { req } = appContext.ctx
    const session = await getSession(req, store)
    const appProps = await App.getInitialProps(appContext)
    const { locale, messages } = req || window.__NEXT_DATA__.props
    appProps.pageProps = {
      ...appProps.pageProps,
      isAuthenticated: session.isAuthenticated,
      isAdmin: session.me && session.me.role && session.me.role.includes(Role.ADMIN),
      me: session.me,
      locale
    }
    // should session be in the props or the store or both?
    return {
      ...appProps,
      locale,
      messages
    }
  }
)

export default reduxWrapper.withRedux(MyApp)
