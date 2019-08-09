const routes = require('next-routes')

// routesImplementation
//   .add([identifier], pattern = /identifier, page = identifier)
//   .add('/blog/:slug', 'blogShow')
//   .add('showBlogPostRoute', '/blog/:slug', 'blogShow')
// Name   Page      Pattern
module.exports = routes()
  .add('landing', '/', 'landing')
  .add('about')
  // Organisations
  .add('orgs', '/orgs', 'org/orglistpage')
  .add('org', '/orgs/:id', 'org/orgdetailpage')
  .add('orgnew', '/org/:new', 'org/orgdetailpage')
  // Opportunities
  .add('ops', '/ops', 'op/oplistpage')
  .add('op', '/ops/:id', 'op/opdetailpage')
  .add('opnew', '/op/:new', 'op/opdetailpage')
  .add('opsection', '/op/section', 'op/oplistsection')
  // Archived Opportunities
  .add('archivedops', '/archivedops/:id', 'archivedop/archivedopdetailpage')
  // People
  .add('people', '/people', 'person/personlistpage')
  .add('person', '/people/:id', 'person/persondetailpage')
  .add('personnew', '/person/:new', 'person/persondetailpage')
  .add('personsection', '/person/section', 'person/personlistsection')
  // Activities
  .add('acts', '/acts', 'act/actlistpage')
  .add('act', '/acts/:id', 'act/actdetailpage')
  .add('actnew', '/act/:new', 'act/actdetailpage')
  // .add('actsection', '/act/section', 'act/actlistsection')
// Usage inside Page.getInitialProps (req = { pathname, asPath, query } = { pathname: '/', asPath: '/about', query: { slug: 'about' } })
