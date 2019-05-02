import React from 'react'
import App, { Container } from 'next/app'
import { IntlProvider, addLocaleData } from 'react-intl'
import { Provider } from 'react-redux'
// import withReduxStore from '../lib/with-redux-store'
import withRedux from 'next-redux-wrapper'
import { makeStore } from '../lib/redux/reduxApi'

// Register React Intl's locale data for the user's locale in the browser. This
// locale data was added to the page by `pages/_document.js`. This only happens
// once, on initial page load in the browser.
if (typeof window !== 'undefined' && window.ReactIntlLocaleData) {
  Object.keys(window.ReactIntlLocaleData).forEach(lang => {
    addLocaleData(window.ReactIntlLocaleData[lang])
  })
}

class MyApp extends App {
  static async getInitialProps ({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    // Get the `locale` and `messages` from the request object on the server.
    // In the browser, use the same values that the server serialized.
    const { req } = ctx
    const { locale, messages } = req || window.__NEXT_DATA__.props
    const initialNow = Date.now()

    return { pageProps, locale, messages, initialNow }
  }

  render () {
    const { Component, pageProps, locale, messages, initialNow, store } = this.props

    return (
      <Container>
        <Provider store={store}>
          <IntlProvider
            locale={locale}
            messages={messages}
            initialNow={initialNow}
          >
            <Component {...pageProps} />
          </IntlProvider>
        </Provider>
      </Container>
    )
  }
}

export default withRedux(makeStore, { debug: false })(MyApp)
