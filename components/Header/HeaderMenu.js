export default () =>
  [
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
      key: 'hsecret',
      href: '/secret',
      text: 'Private',
      authRequired: true
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
      text: 'Sign Off',
      authRequired: true
    }
  ]
