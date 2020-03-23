import { FormattedMessage } from 'react-intl'

export default () => [
  {
    key: 'home',
    href: '/home',
    text:
  <FormattedMessage
    id='HeaderMenu.home'
    defaultMessage='Home'
  />,
    authRequired: true
  },
  {
    key: 'acts',
    href: '/acts',
    text:
  <FormattedMessage
    id='HeaderMenu.activities'
    defaultMessage='Activities'
  />,
    authRequired: true
  },
  {
    key: 'habout',
    href: 'https://blog.voluntarily.nz',
    text:
  <FormattedMessage
    id='HeaderMenu.about'
    defaultMessage='About'
  />,
    anonymousOnly: true
  },
  {
    key: 'help',
    text: 'Support 🙋🏽‍♀️',
    href: 'https://voluntarily.atlassian.net/servicedesk/customer/portals'
  },
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
