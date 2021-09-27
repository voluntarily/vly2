import '../assets/voluntarily.less'

import React from 'react'
import App from 'next/app'
import { Provider } from 'react-redux'
// import { useStore } from '../lib/redux/reduxApi'
import { getSession } from '../lib/auth/auth'
import { Role } from '../server/services/authorize/role'
import { IntlProvider } from 'react-intl'
import { Layout } from 'antd'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import { FillWindow } from '../components/VTheme/VTheme'
import { wrapper } from '../lib/redux/store'

function MyApp ({
  Component,
  locale,
  messages,
  pageProps
}) {
  console.log('myapp pageProps', Component.displayName, pageProps)
  const initialNow = Date.now()
  return (
    <>
      <IntlProvider locale={locale} messages={messages} initialNow={initialNow}>
        <Layout>
          <Header />
          <Layout.Content>
            <FillWindow>
              <Component {...pageProps} />
            </FillWindow>
          </Layout.Content>
          {/* <Footer {...pageProps} /> */}
        </Layout>
      </IntlProvider>
    </>
  )
}

MyApp.getInitialProps = wrapper.getInitialAppProps(store =>
  async (appContext) => {
    const { req } = appContext.ctx
    const session = await getSession(req, store)
    store.dispatch({ type: 'TICK', payload: 'set in _app GIP' })
    const appProps = await App.getInitialProps(appContext)
    const { locale, messages } = req || window.__NEXT_DATA__.props.initialProps
    // should session be in the props or the store or both?
    return {
      ...appProps,
      me: session.me || false,
      isAuthenticated: session.isAuthenticated,
      isAdmin: session.me && session.me.role && session.me.role.includes(Role.ADMIN),
      user: session.user,
      locale,
      messages
    }
  }
)

export default wrapper.withRedux(MyApp)

/*  app Context has:
  AppTree: [Function: AppTree],
  Component: [Function: DefaultPage],
  router: ServerRouter
  ctx: includes req, res, store.
*/
// MyApp.getInitialProps = async (appContext) => {
//   const { ctx } = appContext
//   // get the session early from the token and put in the redux store.
//   // must do this before calling wrapped pages.
//   const session = await getSession(ctx.req, ctx.store)

//   // Get the `locale` and `messages` from the request object on the server.
//   // In the browser, use the same values that the server serialized.
//   const { locale, messages } = ctx.req || window.__NEXT_DATA__.props.initialProps

//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext)

//   return {
//     me: session.me || false,
//     isAuthenticated: session.isAuthenticated,
//     isAdmin: session.me && session.me.role && session.me.role.includes(Role.ADMIN),
//     user: session.user,
//     locale,
//     messages,
//     initialNow: Date.now(),
//     ...appProps // page props can override the earlier props
//   }
// }
