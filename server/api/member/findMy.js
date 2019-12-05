const Member = require('./member')

const findMyOrg = async (req, res) => {
  if (!req.session || !req.session.isAuthenticated || !req.session.me) {
    return res.status(403).send('Must be signed in')
  }
  // search membership table for org matching category and person id
  const query = { person: req.session.me._id }
  let myorgs = await Member.find(query).populate({ path: 'organisation', select: 'name category' }).exec()

  // filter by category if present  e.g /my/org/vp
  const category = req.params.category
  if (category) {
    myorgs = myorgs.filter(
      o => o.organisation.category.includes(category))
  }
  if (!myorgs.length) { // failed to find matching org
    return res.status(404).send('No matching organisation')
  }
  // get id of Organisation
  const orgid = myorgs[0].organisation._id
  // forward to the /orgs/id page
  res.redirect(307, `/orgs/${orgid}`)
  // res.json({ status: 'OK', category, org: myorgs[0] })
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
