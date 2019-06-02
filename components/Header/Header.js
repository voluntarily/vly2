import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
// import { FormattedMessage } from 'react-intl'
import { Layout } from 'antd'
import styled from 'styled-components'
import Navigation from '../Navigation/Navigation'
import links from './HeaderMenu'
import { connect } from 'react-redux'

const Brand = styled.h1`
  font-weight: 300;
  font-size: 2em;
  float: left;
`

const Logo = styled.img`
  float: left;
  margin: 0.7rem;
`

const getAllowedLinks = isAuthenticated =>
  links()
    .filter(l => !l.authRequired || (l.authRequired && isAuthenticated))
    .filter(l => !isAuthenticated || (isAuthenticated && !l.anonymousOnly))

// eslint-disable-next-line no-unused-vars
const Header = ({ isAuthenticated, ...props }) => (
  <Layout.Header>
    <a>
      <Link href='/'>
        <Logo src='/static/vlogolong.svg' alt='Voluntarily logo' />
      </Link>
    </a>
    <Brand className='site-title' />
    {/* <SearchBar /> */}
    <Navigation items={getAllowedLinks(isAuthenticated)} {...props} />
  </Layout.Header>

)
Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
}
const mapStateToProps = store => ({
  isAuthenticated: store.session.isAuthenticated
})

export default connect(
  mapStateToProps
)(Header)
