import Document from 'next/document'
import { ServerStyleSheet } from 'styled-components'
/**
 * Taken from https://github.com/vercel/next.js/tree/master/examples/with-styled-components/pages
 * This is required to fix a Flash of unstyled Content FOUC appearing on first page load due to the
 * styled-components stylesheet not being available immediately on first SSR render.
 *
 */
export default class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
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
}
