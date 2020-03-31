const { sortedLocations, regions } = require('./locationData')

const getLocations = function (req, res) {
  if (req.query.withRelationships) {
    const regionsAndLocations = { regions: regions, locations: sortedLocations }
    res.json(regionsAndLocations)
  } else {
    const returnLocation = sortedLocations.filter(element => element !== 'Online')
    returnLocation.unshift('On the Internet / Remotely')
    res.json(returnLocation)
  }
}

module.exports = getLocations
