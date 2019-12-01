const { sortededucation, education } = require('./educationData')

const geteducation = function (req, res) {
  if (req.query.withRelationships) {
    const typesOfEducation = { education: education }
    res.json(typesOfEducation)
  } else {
    const returnLocation = sortededucation.filter(element => element !== 'Online')
    returnLocation.unshift('Online')
    res.json(returnLocation)
  }
}

module.exports = geteducation
