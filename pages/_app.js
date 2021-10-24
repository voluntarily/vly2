import '../assets/voluntarily.less'

import React from 'react'
import App from 'next/app'
import { getSession } from '../lib/auth/auth'
import { Role } from '../server/services/authorize/role'
import { IntlProvider } from 'react-intl'
import { Layout } from 'antd'
import Footer from '../components/Footer/Footer'
// import Header from '../components/Header/Header'
import reduxWrapper from '../lib/redux/store'
import { RouteGuard } from '../components/RouteGuard'

import dynamic from 'next/dynamic'

// stop SSR and load the navigation on the client side so that the menu size is calculated by the client window.
const Header = dynamic(
  () => import('../components/Header/Header'),
  { ssr: false }
)

function MyApp ({
  Component,
  locale,
  messages,
  pageProps
}) {
  return (
    <>
      <IntlProvider locale={locale} messages={messages} initialNow={Date.now()}>
        <Layout>
          <Header {...pageProps} />
          <Layout.Content>
            <RouteGuard>
              <Component {...pageProps} />
            </RouteGuard>
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
      locale,
      me: session.me
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
