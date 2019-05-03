const routes = require('next-routes')

// routesImplementation
//   .add([identifier], pattern = /identifier, page = identifier)
//   .add('/blog/:slug', 'blogShow')
//   .add('showBlogPostRoute', '/blog/:slug', 'blogShow')
// Name   Page      Pattern
module.exports = routes()
  .add('landing', '/', 'Landing')
  .add('about')
  // Organisations
  .add('orgs', '/orgs', 'org/OrgListPage')
  .add('org', '/orgs/:id', 'org/OrgDetailPage')
  .add('orgedit', '/orgs/:id/edit', 'org/OrgUpdatePage')
  .add('orgnew', '/org/new', 'org/OrgUpdatePage')
  // Opportunities
  .add('ops', '/ops', 'op/OpListPage')
  .add('op', '/ops/:id', 'op/OpDetailPage')
  .add('opedit', '/ops/:id/edit', 'op/OpUpdatePage')
  .add('opnew', '/op/new', 'op/OpUpdatePage')
  .add('opsection', '/op/section', 'op/OpListSection')
  // People
  .add('people', '/people', 'person/PersonListPage')
  .add('person', '/people/:id', 'person/PersonDetailPage')
  .add('personedit', '/people/:id/edit', 'person/PersonUpdatePage')
  .add('personnew', '/person/new', 'person/PersonUpdatePage')
  .add('personsection', '/person/section', 'person/PersonListSection')

// Usage inside Page.getInitialProps (req = { pathname, asPath, query } = { pathname: '/', asPath: '/about', query: { slug: 'about' } })
