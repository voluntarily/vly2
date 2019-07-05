const { sortedLocations } = require('./locationData')

const getLocations = function (req, res) {
  res.json(sortedLocations)
}

module.exports = getLocations
