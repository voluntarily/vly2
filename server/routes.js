const routes = require('next-routes')

// routesImplementation
//   .add([identifier], pattern = /identifier, page = identifier)
//   .add('/blog/:slug', 'blogShow')
//   .add('showBlogPostRoute', '/blog/:slug', 'blogShow')
// Name   Page      Pattern
module.exports = routes() // ----   ----      -----
  .add('about')
  .add('orgs', '/orgs', 'orgs')
  .add('orgedit', '/orgs/:id/edit', 'orgs/OrgUpdatePage')
  .add('orgnew', '/org/new', 'orgs/OrgUpdatePage')
  .add('org', '/orgs/:id', 'orgs/OrgDetailPage')

// Usage inside Page.getInitialProps (req = { pathname, asPath, query } = { pathname: '/', asPath: '/about', query: { slug: 'about' } })
