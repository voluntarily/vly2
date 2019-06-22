import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
// import { FormattedMessage } from 'react-intl'
import { Input, Layout } from 'antd'
import styled from 'styled-components'
import Navigation from '../Navigation/Navigation'
import Router from 'next/router'

import links from './HeaderMenu'
import { connect } from 'react-redux'
const Search = Input.Search

const Brand = styled.h1`
  font-weight: 300;
  font-size: 2em;
  float: left;
`

const LogoContainer = styled.a`

`

const Logo = styled.img`
  float: left;
  height: 3rem;
  width: 12rem;
  margin: 0.7rem;
  background-image: url('/static/vlogolong.svg');
  background-repeat: no-repeat;
  background-position: left top;
  @media screen and (max-width: 767px) {
    background-image: url('/static/vlogo.svg');
    width: 3rem;
  }

`
const SearchInput = styled(Search)`
  width: 18rem;
  display: inline-block;
  padding-left: 1rem;
  
`

const handleSearch = search => {
  Router.push({
    pathname: '/search',
    query: {
      search
    }
  })
}

const getAllowedLinks = isAuthenticated =>
  links()
    .filter(l => !l.authRequired || (l.authRequired && isAuthenticated))
    .filter(l => !isAuthenticated || (isAuthenticated && !l.anonymousOnly))

// eslint-disable-next-line no-unused-vars
const Header = ({ isAuthenticated, ...props }) => (
  <Layout.Header>
    <LogoContainer>
      <Link href={isAuthenticated ? '/' : '/'}>
        <Logo src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' alt='Voluntarily logo' />
      </Link>
    </LogoContainer>
    <Brand className='site-title' />
    <SearchInput
      // size='small'
      placeholder='search for opportunities'
      // enterButton='Search'
      onSearch={handleSearch}
    />
    <Navigation items={getAllowedLinks(isAuthenticated)} {...props} />
  </Layout.Header>

)
Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
}
const mapStateToProps = store => ({
  isAuthenticated: store.session.isAuthenticated,
  me: store.session.me
})

export default connect(
  mapStateToProps
)(Header)
