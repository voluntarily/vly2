const routes = require('next-routes')

// routesImplementation
//   .add([identifier], pattern = /identifier, page = identifier)
//   .add('/blog/:slug', 'blogShow')
//   .add('showBlogPostRoute', '/blog/:slug', 'blogShow')
// Name   Page      Pattern
module.exports = routes()
  // Organisations
  .add('orgs', '/orgs', 'org/orglistpage')
  .add('org', '/orgs/:id', 'org/orgdetailpage')
  .add('orgnew', '/org/:new', 'org/orgdetailpage')
  // Opportunities
  .add('ops', '/ops', 'op/oplistpage')
  .add('op', '/ops/:id', 'op/opdetailpage')
  .add('opnew', '/op/:new', 'op/opdetailpage')
  // Archived Opportunities
  .add('archivedops', '/archivedops/:id', 'archivedop/archivedopdetailpage')
  // People
  .add('people', '/people', 'person/personlistpage')
  .add('person', '/people/:id', 'person/persondetailpage')
  .add('personnew', '/person/:new', 'person/persondetailpage')
  // Activities
  .add('acts', '/acts', 'act/actlistpage')
  .add('acts_ask', '/a/:type', 'act/actlistpage')
  .add('acts_offer', '/a/:type', 'act/actlistpage')

  .add('act', '/acts/:id', 'act/actdetailpage')
  .add('actnew', '/act/:new', 'act/actdetailpage')
  .add('statistics', '/statistics', 'statistics/orgstatisticspage')
  .add('feedbacksubmit', '/feedback/submit', 'feedback/feedbacksubmitpage')
  // .add('actsection', '/act/section', 'act/actlistsection')
// Usage inside Page.getInitialProps (req = { pathname, asPath, query } = { pathname: '/', asPath: '/about', query: { slug: 'about' } })
