import '../assets/voluntarily.less'
import React from 'react'
import App from 'next/app'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import { makeStore } from '../lib/redux/reduxApi'
import { ThemeProvider } from 'styled-components'

const theme = {
  primary: 'green'
}

// Register React Intl's locale data for the user's locale in the browser. This
// locale data was added to the page by `pages/_document.js`. This only happens
// once, on initial page load in the browser.
// if (typeof window !== 'undefined' && window.ReactIntlLocaleData) {
//   Object.keys(window.ReactIntlLocaleData).forEach(lang => {
//     addLocaleData(window.ReactIntlLocaleData[lang])
//   })
// }

class MyApp extends App {
  static async getInitialProps ({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    // Get the `locale` and `messages` from the request object on the server.
    // In the browser, use the same values that the server serialized.
    const { req } = ctx
    const { locale, messages } = req || window.__NEXT_DATA__.props.initialProps
    const initialNow = Date.now()

    return { pageProps, locale, messages, initialNow }
  }

  render () {
    const { Component, pageProps, locale, messages, initialNow, store } = this.props

    return (
      <Provider store={store}>
        <IntlProvider
          locale={locale}
          messages={messages}
          initialNow={initialNow}
        >
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </IntlProvider>
      </Provider>
    )
  }
}

export default withRedux(makeStore, { debug: false })(MyApp)
