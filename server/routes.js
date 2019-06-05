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
  .add('orgedit', '/orgs/:id/edit', 'org/orgupdatepage')
  .add('orgnew', '/org/new', 'org/orgupdatepage')
  // Opportunities
  .add('ops', '/ops', 'op/oplistpage')
  .add('op', '/ops/:id', 'op/opdetailpage')
  .add('opedit', '/ops/:id/edit', 'op/opupdatepage')
  .add('opnew', '/op/new', 'op/opupdatepage')
  .add('opsection', '/op/section', 'op/oplistsection')
  // People
  .add('people', '/people', 'person/personlistpage')
  .add('person', '/people/:id', 'person/persondetailpage')
  .add('personedit', '/people/:id/edit', 'person/personupdatepage')
  .add('personnew', '/person/new', 'person/personupdatepage')
  .add('personsection', '/person/section', 'person/personlistsection')
  // Activities
  .add('acts', '/acts', 'act/actlistpage')
  .add('act', '/acts/:id', 'act/actdetailpage')
  .add('actedit', '/acts/:id/edit', 'act/actupdatepage')
  .add('actnew', '/act/new', 'act/actupdatepage')
  .add('actsection', '/act/section', 'act/actlistsection')
// Usage inside Page.getInitialProps (req = { pathname, asPath, query } = { pathname: '/', asPath: '/about', query: { slug: 'about' } })
