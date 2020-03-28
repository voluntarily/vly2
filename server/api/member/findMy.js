const { findOrgByPersonIdAndRole } = require('./member.lib')

const findMyOrg = async (req, res) => {
  if (!req.session || !req.session.isAuthenticated || !req.session.me) {
    return res.status(403).send('Must be signed in')
  }
  const orgid = await findOrgByPersonIdAndRole(req.session.me._id, req.params.role)
  if (!orgid) { // failed to find matching org
    return res.status(404).send('No matching organisation')
  }
  // forward to the /orgs/id page
  res.redirect(307, `/orgs/${orgid}`)
}

// redirect to the current persons profile
const findMyPerson = async (req, res) => {
  if (!req.session || !req.session.isAuthenticated || !req.session.me) {
    return res.status(403).send('Must be signed in')
  }
  // forward to the /people/id page
  res.redirect(307, `/people/${req.session.me._id}`)
}

module.exports = {
  findMyOrg,
  findMyPerson
}
