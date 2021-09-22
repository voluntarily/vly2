import 'antd/dist/antd.css'
import '../styles/vars.css'
import '../styles/global.css'

import React from 'react'
import App from 'next/app'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import { makeStore } from '../lib/redux/reduxApi'
import { ThemeProvider } from 'styled-components'
import { getSession } from '../lib/auth/auth'
import { Role } from '../server/services/authorize/role'
import { IntlProvider } from 'react-intl'

// Define what props.theme will look like
const theme = {
  main: '#6549AA'
}

function MyApp ({
  Component,
  store,
  locale,
  messages,
  initialNow,
  isPlain,
  me,
  isAuthenticated,
  isAdmin,
  user,
  pageProps
}) {
  const docProps = {
    isPlain,
    me,
    isAuthenticated,
    isAdmin,
    user
  }
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <IntlProvider locale={locale} messages={messages} initialNow={initialNow}>
          <Component {...pageProps} {...docProps} />
        </IntlProvider>
      </ThemeProvider>
    </Provider>
  )
}

/*  app Context has:
  AppTree: [Function: AppTree],
  Component: [Function: DefaultPage],
  router: ServerRouter
  ctx: includes req, res, store.
*/
MyApp.getInitialProps = async (appContext) => {
  const { ctx } = appContext
  // get the session early from the token and put in the redux store.
  // must do this before calling wrapped pages.
  const session = await getSession(ctx.req, ctx.store)

  // Get the `locale` and `messages` from the request object on the server.
  // In the browser, use the same values that the server serialized.
  const { locale, messages } = ctx.req || window.__NEXT_DATA__.props.initialProps

  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext)

  return {
    isPlain: false,
    me: session.me || false,
    isAuthenticated: session.isAuthenticated,
    isAdmin: session.me && session.me.role && session.me.role.includes(Role.ADMIN),
    user: session.user,
    locale,
    messages,
    initialNow: Date.now(),
    ...appProps // page props can override the earlier props
  }
}
export default withRedux(makeStore, { debug: false })(MyApp)
