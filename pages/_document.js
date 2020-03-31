// import './static/empty.less'
import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

// The document (which is SSR-only) needs to be customized to expose the locale
// data for the user's locale for React Intl to work in the browser.
export default class IntlDocument extends Document {
  static async getInitialProps (ctx) {
    // extract locale
    const {
      req: { locale, localeDataScript }
    } = ctx

    // styled-components as recommended https://github.com/zeit/next.js/blob/master/examples/with-styled-components/pages/_document.js
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        locale,
        localeDataScript,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }

  render () {
    // Polyfill Intl API for older browsers
    const polyfill = `https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.${
      this.props.locale
    }`

    return (
      <html lang={this.props.locale}>
        <Head>
          <script dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-MLJV46S');`
          }}
          />
          <link rel='shortcut icon' href='/static/img/icons/favicon.ico' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta charSet='utf-8' />
          {/* <meta
            name='viewport'
            content='initial-scale=1.0, width=device-width'
          /> */}
          <link rel='stylesheet' href='https://rsms.me/inter/inter.css' />
          <link rel='stylesheet' href='//cdn.quilljs.com/1.2.6/quill.snow.css' />

        </Head>
        <body>
          <Main />
          <script src={polyfill} />
          <script
            dangerouslySetInnerHTML={{
              __html: this.props.localeDataScript
            }}
          />
          <NextScript />

        </body>
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-MLJV46S'
            height='0' width='0' style={{ display: 'none', visibility: 'none' }}
          />
        </noscript>
      </html>
    )
  }
}
