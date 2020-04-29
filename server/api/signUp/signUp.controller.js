const { Role } = require('../../services/authorize/role')

/**
 * add or remove a role from the array
 * @param {*} me - contains a roles array
 * @param {Boolean} flag - true to set role
 * @param {Role} role - which role to set
 */
const updateRole = (me, flag, role) => {
  if (flag) {
    if (!me.role.includes(role)) {
      me.role.push(role)
    }
  } else {
    const index = me.role.indexOf(role)
    if (index > -1) {
      me.role.splice(index, 1)
    }
  }
}

/* the registerPerson endpoint allows a person to
   register as volunteer or asker with some initial values set.

   /api/registerPerson

*/

const registerPerson = async (req, res) => {
  try {
    if (!req.session.isAuthenticated) {
      return res.status(403).end()
    }
    // check parameters
    // if (req.method !== 'POST' || !req.body) res.status(400).end()
    const prefs = req.body
    // const { org } = req.query
    const me = req.session && req.session.me

    // is the person an asker?
    if (prefs.roleAsk !== undefined) { updateRole(me, prefs.roleAsk, Role.BASIC) }

    // is the person a volunteer?
    if (prefs.roleOffer !== undefined) { updateRole(me, prefs.roleOffer, Role.VOLUNTEER) }

    // set the chosen topic groups
    if (prefs.topicGroups) {
      me.topicGroups = prefs.topicGroups
    }
    // set the person data
    if (prefs.person) {
      if (prefs.person.nickname) {
        me.nickname = prefs.person.nickname
      }
      if (prefs.person.imgUrl) {
        me.imgUrl = prefs.person.imgUrl
      }
      if (prefs.person.imgUrlSm) {
        me.imgUrlSm = prefs.person.imgUrlSm
      }
      if (prefs.person.locations.length) {
        me.locations = prefs.person.locations
      }
    }
    await me.save()
    res.json(me)
  } catch (e) {
    res.status(500).send(e)
  }
}

module.exports = {
  updateRole,
  registerPerson
}
