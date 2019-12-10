import React from 'react'
import PropTypes from 'prop-types'
import publicPage from './publicPage'
import { FillWindow, FullPage } from '../components/VTheme/VTheme'
import { FormattedMessage } from 'react-intl'
import Router from 'next/router'
import { Layout } from 'antd'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'

const adminPageHoc = Page => class AdminPage extends React.Component {
  static async getInitialProps (ctx) {
    if (Page.getInitialProps) {
      const initialProps = await Page.getInitialProps(ctx)

      if (!initialProps.isAuthenticated) {
        if (ctx.res) {
          const redirectUrl = encodeURIComponent(ctx.req.url)
          const signThruUrl = `/auth/sign-thru?redirect=${redirectUrl}`
          ctx.res.writeHead(302, { Location: signThruUrl })
          ctx.res.end()
        } else {
          const redirectUrl = encodeURIComponent(ctx.asPath)
          const signThruUrl = `/auth/sign-thru?redirect=${redirectUrl}`
          Router.push(signThruUrl)
        }
      }

      return initialProps
    }
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired
  }

  render () {
    if (this.props.isAuthenticated && this.props.isAdmin) {
      return <Page {...this.props} />
    }

    return (
      <Layout>
        {!this.props.isPlain && <Header {...this.props} />}
        <Layout.Content>
          <FillWindow>
            <FullPage>
              <h1>
                <FormattedMessage
                  id='admin-page.access-denied.heading'
                  defaultMessage='Access denied'
                  description='Heading shown when a person does not have permission to view an admin page'
                />
              </h1>
              <p>
                <FormattedMessage
                  id='admin-page.access-denied.content'
                  defaultMessage='You do not have permission to view this page.'
                  description='Content shown when a person does not have permission to view an admin page'
                />
              </p>
            </FullPage>
          </FillWindow>
        </Layout.Content>
        {!this.props.isPlain && <Footer {...this.props} />}
      </Layout>
    )
  }
}

export default Page => adminPageHoc(publicPage(Page))
