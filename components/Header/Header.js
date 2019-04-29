import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { Layout } from 'antd'
import styled from 'styled-components'
import Navigation from '../Navigation/Navigation'
import links from './HeaderMenu'

const Brand = styled.h1`
  font-weight: 300;
  font-size: 2em;
  float: left;
`
const Wa = styled.a`
  text-decoration: none;
  color: white;
`
const Logo = styled.img`
  float: left;
  margin: 0.5rem;
`

const getAllowedLinks = isAuthenticated => links()
  .filter(l => !l.authRequired || (l.authRequired && isAuthenticated))
  .filter(l => !isAuthenticated || (isAuthenticated && !l.anonymousOnly))

// eslint-disable-next-line no-unused-vars
const Header = ({ isAuthenticated }) => (
  <Layout.Header >
    <Logo src='/static/vlogo.svg' />
    <Brand className='site-title' >
      <Link href='/' >
        <Wa><FormattedMessage
          id='siteTitle'
          defaultMessage='Voluntari.ly'
          description='Name of the Application on the menu bar'
        /></Wa>
      </Link>
    </Brand>
    {/* <SearchBar /> */}
    <Navigation items={getAllowedLinks(isAuthenticated)} />

  </Layout.Header>
)
Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
}

export default Header
