export default () =>
  [
    {
      key: 'facts',
      text: 'Activities',
      href: '/acts'
    },
    {
      key: 'forgs',
      text: 'Organisations',
      href: '/orgs'
    },
    {
      key: 'fpeople',
      text: 'People',
      href: '/people'
    },
    {
      key: 'fops',
      text: 'Opportunities',
      href: '/ops'
    },
    {
      key: 'ftest',
      text: 'Showcase',
      href: '/test'
    },
    {
      key: 'fnotsecret',
      text: 'Not Secret',
      href: '/notsecret',
      anonymousOnly: true
    },
    {
      key: 'fsecret',
      text: 'Secret',
      href: '/secret',
      authRequired: true
    }
  ]
