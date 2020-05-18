const { config } = require('../../../config/serverConfig')
const { sortedLocations, regions } = require('./locationData')

const getLocations = function (req, res) {
  const addressFinderKey = config.ADDRESS_FINDER_KEY
  if (req.query.withRelationships) {
    const regionsAndLocations = { regions: regions, locations: sortedLocations, addressFinderKey: addressFinderKey }
    res.json(regionsAndLocations)
  } else {
    const returnLocation = sortedLocations.filter(element => element !== 'Online')
    returnLocation.unshift('On the Internet / Remotely')
    const locationsAndAddressFinderKey = {
      locations: returnLocation,
      addressFinderKey
    }
    res.json(locationsAndAddressFinderKey)
  }
}

module.exports = getLocations
