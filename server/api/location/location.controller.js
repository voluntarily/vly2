const { sortedLocations, regions } = require('./locationData')

const getLocations = function (req, res) {
  if (req.query.withRelationships) {
    const regionsAndLocations = { regions: regions, locations: sortedLocations }
    res.json(regionsAndLocations)
  } else {
    res.json(sortedLocations)
  }
}

module.exports = getLocations
