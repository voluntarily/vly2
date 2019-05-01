const routes = require('next-routes')

// routesImplementation
//   .add([identifier], pattern = /identifier, page = identifier)
//   .add('/blog/:slug', 'blogShow')
//   .add('showBlogPostRoute', '/blog/:slug', 'blogShow')
// Name   Page      Pattern
module.exports = routes()
  .add('landing', '/', 'Landing/Landing')
  .add('about')
  .add('orgs', '/orgs', 'Org/OrgListPage')
  .add('org', '/orgs/:id', 'Org/OrgDetailPage')
  .add('orgedit', '/orgs/:id/edit', 'Org/OrgUpdatePage')
  .add('orgnew', '/org/new', 'Org/OrgUpdatePage')
  .add('ops', '/ops', 'Op/OpListPage')
  .add('op', '/ops/:id', 'Op/OpDetailPage')
  .add('opsedit', '/ops/:id/edit', 'Op/OpUpdatePage')
  .add('opnew', '/op/new', 'Op/OpUpdatePage')
  .add('opsection', '/op/section', 'Op/OpListSection')

// Usage inside Page.getInitialProps (req = { pathname, asPath, query } = { pathname: '/', asPath: '/about', query: { slug: 'about' } })
