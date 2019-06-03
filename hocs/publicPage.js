import React from 'react'
import Head from 'next/head'
import Router from 'next/router'

import {
  getUserFromServerCookie,
  getUserFromLocalCookie,
  parseUserToSession
} from '../lib/auth/auth'
import { Layout } from 'antd'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'

import styled from 'styled-components'
import { setSession } from '../lib/redux/actions'

// Dump all the custom elements and responsive scaffolding crap here
// BEGIN AWESOME DUMP OF CSS-ISH GOODNESS
export const A4 = styled.div`
  margin: 3em;
  padding-bottom: 4em;
  max-width: 50em;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 600px) {
    .div {
      margin: 0 3em;
    }
  }
`
export const FullPage = styled.div`
  margin: 0 auto;
  width: 80rem;


  @media screen and (min-width: 768px) and (max-width: 1280px) {
    width: calc(100vw - 4rem);
    margin-left: 2rem;
    margin-right: 2rem;
  }
  @media screen and (max-width: 767px) {
    width: calc(100vw - 1rem);
    margin-left: 1rem;
  }
` // end fullpage
export const Grid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 18.5rem 18.5rem 18.5rem 18.5rem;
  grid-gap: 2rem;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
    grid-template-columns: repeat(auto-fit, 18.5rem);
    justify-content: start;
    justify-items: center;
  }

  @media screen and (max-width: 767px) {
    grid-template-columns: 100vw;
    grid-gap: 0rem;
  }
` // end grid

export const FillWindow = styled.div`
    min-height: calc(100vh - 220px);
  }
` // END AWESOME CSS DUMP

export default Page =>
  class DefaultPage extends React.Component {
    static async getInitialProps (ctx) {
      let session = {}
      const loggedUser = process.browser
        ? getUserFromLocalCookie()
        : getUserFromServerCookie(ctx.req)
      if (loggedUser) {
        try {
          session = await parseUserToSession(loggedUser)
          ctx.store.dispatch(setSession(session))
        } catch (err) {
          console.error()
        }
      }
      const pageProps =
        Page.getInitialProps && (await Page.getInitialProps(ctx))
      return {
        ...pageProps,
        me: session.me,
        isAuthenticated: session.isAuthenticated
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
            <title>Voluntari.ly</title>
            <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
            <meta charSet='utf-8' />
            <meta
              name='viewport'
              content='initial-scale=1.0, width=device-width'
            />
            <link rel='stylesheet' href='https://rsms.me/inter/inter.css' />
            <script type='text/javascript' src='https://voluntarily.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-bgykhu/b/10/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=6cd14dc4' />
            <script type='text/javascript' async src='https://www.googletagmanager.com/gtag/js?id=UA-141212194-1' />
            <script type='text/javascript' dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-141212194-1'); ` }} />
          </Head>
          <Header {...this.props} />
          <Layout.Content>
            <FillWindow>
              <Page {...this.props} />
            </FillWindow>
          </Layout.Content>
          <Footer {...this.props} />
        </Layout>
      )
    }
  }
