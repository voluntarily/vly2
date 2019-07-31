const { sortedLocations, regions } = require('./locationData')

const getLocations = function (req, res) {
  if (req.query.withRelationships) {
    res.json(regions)
  } else {
    res.json(sortedLocations)
  }
}

module.exports = getLocations
