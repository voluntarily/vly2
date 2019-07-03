const { regions, territories } = require('./locationData')

const getLocations = function (req, res) {
  res.json({ regions, territories })
}

module.exports = getLocations
