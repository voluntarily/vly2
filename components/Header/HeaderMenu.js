export default () => [
  {
    key: 'home',
    href: '/home',
    text: 'Home',
    authRequired: true
  },
  {
    key: 'habout',
    text: 'About',
    href: '/about'
  },
  {
    key: 'horgs',
    text: 'Organisations',
    href: '/orgs'
  },

  {
    key: 'hsignin',
    href: '/auth/sign-in',
    text: 'Sign In',
    anonymousOnly: true
  },
  {
    key: 'hsignoff',
    href: '/auth/sign-off',
    text: 'Sign Out',
    authRequired: true
  }
]
