export default () => [
  {
    key: 'index',
    href: '/',
    text: 'Explore',
    authRequired: true
  },
  {
    key: 'home',
    href: '/home',
    text: 'Dashboard',
    authRequired: true
  },
  {
    key: 'acts',
    href: '/acts',
    text: 'Activities',
    authRequired: true
  },
  {
    key: 'habout',
    text: 'About',
    href: '/about',
    anonymousOnly: true
  },
  {
    key: 'orgs',
    href: '/orgs',
    text: 'Organisations',

  },
  {
    key: 'help',
    text: 'Help',
    href: 'https://voluntarily.atlassian.net/servicedesk/customer/portals'
  },
  {
    key: 'hsignin',
    href: '/auth/sign-in',
    text: 'Log in',
    anonymousOnly: true
  },
  {
    key: 'hsignup',
    href: '/auth/sign-in',
    text: 'Sign up',
    anonymousOnly: true
  },
  {
    key: 'hsignoff',
    href: '/auth/sign-off',
    text: 'Sign Out',
    authRequired: true
  }
]
