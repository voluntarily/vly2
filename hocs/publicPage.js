import { Layout } from 'antd'
import Cookie from 'js-cookie'
import Head from 'next/head'
import Router from 'next/router'
import React from 'react'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import { getUserFromLocalCookie, getUserFromServerCookie, parseUserToSession } from '../lib/auth/auth'
import { setSession } from '../lib/redux/actions'
import { FillWindow } from '../components/VTheme/VTheme'
// Dump all the custom elements and responsive scaffolding crap here
// BEGIN AWESOME DUMP OF CSS-ISH GOODNESS

export default Page =>
  class DefaultPage extends React.Component {
    static async getInitialProps (ctx) {
      let cookies = ctx.req ? ctx.req.cookies : Cookie.get()
      let session = {}
      const loggedUser = process.browser
        ? getUserFromLocalCookie()
        : getUserFromServerCookie(ctx.req)
      if (loggedUser) {
        try {
          session = await parseUserToSession(loggedUser, cookies)
          ctx.store.dispatch(setSession(session))
        } catch (err) {
          console.error('PublicPage error parsing user session: ', err)
        }
      }

      const pageProps =
        Page.getInitialProps && (await Page.getInitialProps(ctx))
      return {
        ...pageProps,
        me: session.me || false,
        isAuthenticated: !!session.isAuthenticated,
        isPlain: false
      }
    }

    constructor (props) {
      super(props)
      this.logout = this.logout.bind(this)
    }

    logout (eve) {
      if (eve.key === 'logout') {
        Router.push(`/?logout=${eve.newValue}`)
      }
    }

    componentDidMount () {
      window.addEventListener('storage', this.logout, false)
    }

    componentWillUnmount () {
      window.removeEventListener('storage', this.logout, false)
    }
    render () {
      return (
        <Layout>
          <Head>
            <title>Voluntarily</title>
            <link rel='shortcut icon' href='../static/img/icons/favicon.ico' />
            <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
            <meta charSet='utf-8' />
            <meta
              name='viewport'
              content='initial-scale=1.0, width=device-width'
            />
            <link rel='stylesheet' href='https://rsms.me/inter/inter.css' />
            <link rel='stylesheet' href='//cdn.quilljs.com/1.2.6/quill.snow.css' />
            <script type='text/javascript' src='https://voluntarily.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-t2deah/b/11/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=2e085869' />
            <script type='text/javascript' async src='https://www.googletagmanager.com/gtag/js?id=UA-141212194-1' />
            <script type='text/javascript' dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-141212194-1'); ` }} />
          </Head>
          { !this.props.isPlain && <Header {...this.props} />}
          <Layout.Content>
            <FillWindow>
              <Page {...this.props} />
            </FillWindow>
          </Layout.Content>
          { !this.props.isPlain && <Footer {...this.props} />}
        </Layout>
      )
    }
  }
