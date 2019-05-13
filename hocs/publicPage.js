import React from 'react'
import Head from 'next/head'
import Router from 'next/router'

import { getUserFromServerCookie, getUserFromLocalCookie } from '../lib/auth/auth'
import { Layout } from 'antd'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'

import styled from 'styled-components'

//Dump all the custom elements and responsive scaffolding crap here
//BEGIN AWESOME DUMP OF CSS-ISH GOODNESS
export const A4 = styled.div`
  margin: 3em;
  padding-bottom: 4em;
  max-width: 50em;
  margin-left: auto ;
  margin-right: auto ;
  @media (max-width: 600px) {
    .div {
      margin: 0 3em;
    }
  }
`
export const FullPage = styled.div`
      margin: 0 auto;
      width: 80rem;

  @media screen and (min-width: 768px) and (max-width: 1680px) {
      width: calc(100vw - 2rem);
  }
  @media screen and (max-width: 767px) {
      width: calc(100vw - 1rem);
      margin: 0.5rem;
  }
  ` //end fullpage
  export const Grid = styled.div`
  
  position: relative;
  display: grid;
  justify-items: center;
  justify-content: space-evenly;
  grid-template-columns: repeat(auto-fit, 18.5rem);
  grid-gap: 2rem;

  @media screen and (max-width: 767px) {
    grid-gap: 0rem;
  }

 ` //end grid

  export const FillWindow = styled.div`
  
    min-height: calc(100vh - 220px); 
  }
`


//END AWESOME CSS DUMP
export default Page => class DefaultPage extends React.Component {
  static async getInitialProps (ctx) {
    const loggedUser = process.browser ? getUserFromLocalCookie() : getUserFromServerCookie(ctx.req)
    const pageProps = Page.getInitialProps && (await Page.getInitialProps(ctx))
    return {
      ...pageProps,
      loggedUser,
      currentUrl: ctx.pathname,
      isAuthenticated: !!loggedUser
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
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        </Head>
        <Header {...this.props} />
        <Layout.Content >
          <FillWindow>
            <Page {...this.props} />
          </FillWindow>
        </Layout.Content >
        <Footer {...this.props} />
      </Layout>
    )
  }
}
