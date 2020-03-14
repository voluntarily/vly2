import { FormattedMessage } from 'react-intl'

export default () => [
  {
    key: 'home',
    href: '/home',
    text:
  <FormattedMessage
    id='HeaderMenu.volunteer'
    defaultMessage='Volunteer'
  />,
    authRequired: true
  },
  {
    key: 'acts',
    href: '/acts',
    text:
  <FormattedMessage
    id='HeaderMenu.resorces'
    defaultMessage='Resources'
  />,
    authRequired: true
  },
  {
    key: 'habout',
    href: '/about',
    text:
  <FormattedMessage
    id='HeaderMenu.about'
    defaultMessage='About'
  />,
    anonymousOnly: true
  },
  {
    key: 'orgs',
    href: '/orgs',
    text:
  <FormattedMessage
    id='HeaderMenu.organisations'
    defaultMessage='Organisations'
  />
  },
  // {
  //   key: 'help',
  //   text: 'Help',
  //   href: 'https://voluntarily.atlassian.net/servicedesk/customer/portals'
  // },
  {
    key: 'hsignin',
    href: '/home',
    text:
  <FormattedMessage
    id='HeaderMenu.sign-in'
    defaultMessage='Sign in'
  />,
    anonymousOnly: true
  },
  {
    key: 'hsignoff',
    href: '/auth/sign-off',
    text:
  <FormattedMessage
    id='HeaderMenu.sign-out'
    defaultMessage='Sign out'
  />,
    authRequired: true
  }
]
