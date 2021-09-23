/* This Wrapper adds the header and footer layout to a standard page
  to inhibit rendering of the header/footer return isPlain = true from
  the wrapped component GetInitialProps
 */
import { Layout } from 'antd'
import React from 'react'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import { FillWindow } from '../components/VTheme/VTheme'

export function PublicPage (Page) {
  function DefaultPage (props) {
    const isPlain = props.isPlain
    return (
      <Layout>
        {!isPlain && <Header />}
        <Layout.Content>
          <FillWindow>
            <Page {...props} />
          </FillWindow>
        </Layout.Content>
        {!isPlain && <Footer {...props} />}
      </Layout>
    )
  }

  DefaultPage.getInitialProps = async (ctx) => {
    const pageProps = Page.getInitialProps && (await Page.getInitialProps(ctx))
    const isPlain = false
    return {
      isPlain,
      ...pageProps // page props can override these props
    }
  }
  return DefaultPage
}
export default PublicPage
