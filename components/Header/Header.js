// import { FormattedMessage } from 'react-intl'
import { Icon, Input, Layout } from 'antd'
import Link from 'next/link'
import Router from 'next/router'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Navigation from '../Navigation/Navigation'
import links from './HeaderMenu'
import { useIntl } from 'react-intl'

const Search = Input.Search

const Brand = styled.h1`
  font-weight: 300;
  font-size: 2em;
  float: left;
`
const Notice = styled.div`
  font-weight: 600;
  font-size: 1.2em;
  width: 100%;
  background-color: blanchedalmond;
  padding-left: 1rem;
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
const Header = ({ isAuthenticated, ...props }) => {
  const intl = useIntl()
  let notice = intl.formatMessage({ id: 'notice', defaultMessage: 'none' })
  if (notice === 'none') notice = '' // wipe notice if its set to none
  const height = notice ? '112px' : '56px'
  return (
    <Layout.Header style={{ position: 'fixed', height: height, zIndex: 10, width: '100%', backgroundColor: 'white', boxShadow: '1px 1px 12px 0 rgba(0, 0, 0, 0.1)' }}>
      {notice && <Notice><Icon type='warning' /> {notice}</Notice>}
      <MenuGrid>
        <div>
          <Brand className='site-name' />
          <SearchInput
            placeholder='Search for cool ways to help out'
            onSearch={handleSearch}
          />
        </div>
        <Link href='/landing'>
          <LogoContainer>
            <Logo
              src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
              alt='Voluntarily logo'
            />
          </LogoContainer>
        </Link>
        <div>
          <Navigation items={getAllowedLinks(isAuthenticated)} {...props} />
        </div>
      </MenuGrid>
    </Layout.Header>
  )
}
Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
}
const mapStateToProps = store => ({
  isAuthenticated: store.session.isAuthenticated,
  me: store.session.me
})

export default connect(mapStateToProps)(Header)
