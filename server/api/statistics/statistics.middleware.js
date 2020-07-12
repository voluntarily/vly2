const { Role } = require('../../services/authorize/role')

const authoriseStatistics = (req, res, next) => {
  const { orgId } = req.params

  // authentication
  const currentUser = req.session.me
  if (!currentUser || !req.session.isAuthenticated) {
    return res.status(401).send()
  }

  // authorisation
  if (
    !Array.isArray(currentUser.role) ||
    !currentUser.role.includes(Role.ORG_ADMIN) ||
    !Array.isArray(currentUser.orgAdminFor) ||
    !currentUser.orgAdminFor.includes(orgId)
  ) {
    return res.status(403).send()
  }

  next()
}

module.exports = {
  authoriseStatistics
}
