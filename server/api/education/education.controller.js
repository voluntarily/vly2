const { sortedEducation, education } = require('./educationData')

const geteducation = function (req, res) {
  if (req.query.withRelationships) {
    const typesOfEducation = { education: education }
    res.json(typesOfEducation)
  } else {
    const returnEducation = sortedEducation.filter(element => element !== 'Online')
    returnEducation.unshift('Online')
    res.json(returnEducation)
  }
}

module.exports = geteducation
