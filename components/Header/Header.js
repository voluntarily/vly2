// import { FormattedMessage } from 'react-intl'
import { Input, Layout } from 'antd'
import Link from 'next/link'
import Router from 'next/router'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Navigation from '../Navigation/Navigation'
import links from './HeaderMenu'

const Search = Input.Search

const Brand = styled.h1`
  font-weight: 300;
  font-size: 2em;
  float: left;
`

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  @media screen and (max-width: 767px) {
    grid-template-columns: 0fr 1fr 2fr;
  }
`

const LogoContainer = styled.a`
  margin: 0 auto;
  @media screen and (max-width: 767px) {
    margin: 0;
  }
`

const Logo = styled.img`
  height: 3rem;
  width: 12rem;
  margin: 0.7rem;
  margin-top: 0.8rem;
  background-image: url('/static/vlogolong.svg');
  background-repeat: no-repeat;
  background-position: left top;
  @media screen and (max-width: 767px) {
    background-image: url('/static/vlogo.svg');
    margin-top: 0.5rem;
    margin-left: 0.5rem;
    width: 3rem;
  }
`
const SearchInput = styled(Search)`
  width: 20rem;
  display: inline-block;
  margin-left: 0.5rem;


  padding: 4px;
  border-radius: 4px;

  @media screen and (max-width: 767px) {
    display: none;
  }
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
  <Layout.Header style={{ position: 'fixed', zIndex: 10, width: '100%', backgroundColor: 'white', boxShadow: '1px 1px 12px 0 rgba(0, 0, 0, 0.1)' }}>
    <MenuGrid>
      <div>
        <Brand className='site-title' />
        <SearchInput
          // size='small'
          placeholder='Search for cool ways to help out'
          // enterButton='Search'
          onSearch={handleSearch}
        />
      </div>
      <LogoContainer>
        <Link href={isAuthenticated ? '/' : '/'}>
          <Logo
            src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
            alt='Voluntarily logo'
          />
        </Link>
      </LogoContainer>
      <div>
        <Navigation items={getAllowedLinks(isAuthenticated)} {...props} />
      </div>
    </MenuGrid>
  </Layout.Header>
)
Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
}
const mapStateToProps = store => ({
  isAuthenticated: store.session.isAuthenticated,
  me: store.session.me
})

export default connect(mapStateToProps)(Header)
