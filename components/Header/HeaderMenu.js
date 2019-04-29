export default () =>
  [
    {
      key: 'about',
      text: 'About',
      href: '/about'
    },
    {
      key: 'orgs',
      text: 'Organisations',
      href: '/orgs'
    },
    {
      key: 'secret',
      href: '/secret',
      text: 'Private',
      authRequired: true
    },
    {
      key: 'signin',
      href: '/auth/sign-in',
      text: 'Sign In',
      anonymousOnly: true
    },
    {
      href: '/auth/sign-off',
      text: 'Sign Off',
      authRequired: true
    }
  ]
