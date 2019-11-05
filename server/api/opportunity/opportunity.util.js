const Opportunity = require('./opportunity')
const { regions } = require('../location/locationData')

const getLocationRecommendations = async (me) => {
  const regionToMatch = regions.find(loc => {
    return loc.name === me.location || loc.containedTerritories.includes(me.location)
  })

  let locationOps
  if (regionToMatch) {
    locationOps = await Opportunity
      .find({
        location: { $in: [regionToMatch.name, ...regionToMatch.containedTerritories] },
        requestor: { $ne: me._id }
      })
      .populate('requestor', 'name nickname imgUrl')
      .populate('offerOrg', 'name imgUrl category')

    // if user has specified a territory, we should show the exact matches first, because we know
    // they are closest to the user.
    const userIsInTerritory = regionToMatch.name !== me.location
    if (userIsInTerritory) {
      locationOps.sort((a, b) => {
        if (a.location === me.location && b.location !== me.location) {
          return -1
        } else if (b.location === me.location && a.location !== me.location) {
          return 1
        } else {
          return 0 // we don't care about the ordering if the location isn't matching
        }
      })
    }
  } else {
    locationOps = []
  }

  return locationOps.slice(0, 10)
}

const getSkillsRecommendations = async (me) => {
  const tagsToMatch = me.tags

  // mongoose isn't happy if we provide an empty array as an expression
  if (tagsToMatch.length > 0) {
    const tagIdExpression = {
      $or: tagsToMatch.map(id => ({ tags: id }))
    }
    const opsWithMatchingTags = await Opportunity
      .find({ ...tagIdExpression, requestor: { $ne: me._id } })
      .populate('requestor', 'name nickname imgUrl')
      .populate('offerOrg', 'name imgUrl category')
    const opsWithCounts = []

    opsWithMatchingTags.forEach(op => {
      let count = 0
      op.tags.forEach(tag => {
        if (tagsToMatch.includes(tag)) {
          count++
        }
      })

      opsWithCounts.push({ count, op })
    })

    opsWithCounts.sort((a, b) => {
      return b.count - a.count
    })

    return opsWithCounts.map(op => op.op).slice(0, 10)
  } else {
    return []
  }
}

module.exports = { getLocationRecommendations, getSkillsRecommendations }
