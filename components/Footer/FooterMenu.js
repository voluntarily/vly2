export default () =>
  [
    {
      key: 'admin',
      text: 'Admin',
      href: '/admin',
      authRequired: true
    },
    {
      key: 'facts',
      text: 'Activities',
      href: '/acts',
      authRequired: true
    },
    {
      key: 'forgs',
      text: 'Organisations',
      href: '/orgs',
      authRequired: true
    },
    {
      key: 'fpeople',
      text: 'People',
      href: '/people',
      authRequired: true
    },
    {
      key: 'fops',
      text: 'Opportunities',
      href: '/ops',
      authRequired: true
    }
  ]
