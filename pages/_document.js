// import '../static/empty.less'
import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

// The document (which is SSR-only) needs to be customized to expose the locale
// data for the user's locale for React Intl to work in the browser.
export default class IntlDocument extends Document {
  static async getInitialProps (context) {
    const props = await super.getInitialProps(context)

    // collect style sheets
    const sheet = new ServerStyleSheet()
    const page = context.renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    // return { ...page, styleTags }

    const {
      req: { locale, localeDataScript }
    } = context
    return {
      ...page,
      ...props,
      locale,
      localeDataScript,
      styleTags
    }
  }

  render () {
    // Polyfill Intl API for older browsers
    const polyfill = `https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.${
      this.props.locale
    }`

    return (
      <html>
        <Head>
          <link rel='shortcut icon' href='../static/img/icons/favicon.ico' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta charSet='utf-8' />
          <meta
            name='viewport'
            content='initial-scale=1.0, width=device-width'
          />
          <link rel='stylesheet' href='https://rsms.me/inter/inter.css' />
          <link rel='stylesheet' href='//cdn.quilljs.com/1.2.6/quill.snow.css' />
          {this.props.styleTags}

          <script type='text/javascript' src='https://voluntarily.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-t2deah/b/11/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=2e085869' />
          <script type='text/javascript' async src='https://www.googletagmanager.com/gtag/js?id=UA-141212194-1' />
          <script type='text/javascript' dangerouslySetInnerHTML={{ __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-141212194-1'); ` }} />

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
      </html>
    )
  }
}
