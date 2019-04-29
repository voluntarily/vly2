import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import styled from 'styled-components'

const AppHeader = styled.div`
  display: flex;
  margin-bottom: 20px;
`

const HeaderLink = styled.a`
  margin-right: 20px;
  font-size: 14px;
  color: ${p => p.isActive ? '#333' : '#999'};
  text-decoration: none;
  text-transform: uppercase;
  padding-top: 2px;
  padding-bottom: 2px;
  border-top: 1px solid ${p => p.isActive ? '#333' : 'transparent'};
  border-bottom: 1px solid ${p => p.isActive ? '#333' : 'transparent'};
  transition: color .25s;
  font-weight: isActive ? '600' : '400';

  &:hover {
    color: #333;
  }
`

const links = [
  { href: '/', text: 'Home' },
  { href: '/about', text: 'About' },
  { href: '/secret', text: 'Top Secret', authRequired: true },
  { href: '/auth/sign-in', text: 'Sign In', anonymousOnly: true },
  { href: '/auth/sign-off', text: 'Sign Off', authRequired: true }
]

const getAllowedLinks = isAuthenticated => links
  .filter(l => !l.authRequired || (l.authRequired && isAuthenticated))
  .filter(l => !isAuthenticated || (isAuthenticated && !l.anonymousOnly))

const Header = ({ isAuthenticated, currentUrl }) => (
  <AppHeader>
    {getAllowedLinks(isAuthenticated).map(l => (
      <Link prefetch key={l.href} href={l.href}>
        <HeaderLink isActive={currentUrl === l.href}>
          {l.text}
        </HeaderLink>
      </Link>
    ))}
  </AppHeader>
)

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  currentUrl: PropTypes.string.isRequired
}

export default Header
