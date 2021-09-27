/* This Wrapper adds the header and footer layout to a standard page
  to inhibit rendering of the header/footer return isPlain = true from
  the wrapped component GetInitialProps
 */
import { Layout } from 'antd'
import React from 'react'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import { FillWindow } from '../components/VTheme/VTheme'
import { wrapper } from '../lib/redux/store'
import { getSession } from '../lib/auth/auth'
 
export function PublicPage (Page) {
  function DefaultPage (props) {
    return (
      <Layout>
        {/* <Header /> */}
        <Layout.Content>
          <FillWindow>
            <Page {...props} />
          </FillWindow>
        </Layout.Content>
        {/* <Footer {...props} /> */}
      </Layout>
    )
  }

  return DefaultPage
}

export const getServerSideProps = wrapper.getServerSideProps(store =>
  async ({ req, res }) => {
    const session = await getSession(req, store)
    const json = JSON.stringify(session)
    console.log('5. Page.getServerSideProps ', json)
    store.dispatch({ type: 'TICK', payload: 'set in GSSP index.js' })

    // should session be in the props or the store or both?
    return {
    }
  }
)

export default PublicPage
