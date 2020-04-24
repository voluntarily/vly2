const Opportunity = require('./opportunity')
const { regions } = require('../location/locationData')
const { Role } = require('../../services/authorize/role')
const { OpportunityType } = require('./opportunity.constants')
const { ASK, OFFER } = OpportunityType

const arrayIntersects = (arrA, arrB) => arrA.filter(x => arrB.includes(x)).length
const MAX_RECOMMENDATIONS = 10

/**
 *
 * @param {{ locations: string[], _id }} me
 * @returns {Promise<any[]>}
 */
const getLocationRecommendations = async (me) => {
  const regionsToMatch = regions.filter(loc =>
    me.locations.includes(loc.name) ||
      !!loc.containedTerritories.find(containedTerritory => me.locations.includes(containedTerritory))
  )

  if (regionsToMatch.length === 0) {
    return []
  }

  // Extract all region names and the territories of those regions
  // e.g. ['Bay of Plenty', 'Western Bay of Plenty District', 'Tauranga City', ..., 'Waikato', 'Thames-Coromandel District', 'Taupo District', ...]
  const regionNames = regionsToMatch.flatMap(region => [region.name, ...region.containedTerritories])

  let locationOps = await Opportunity
    .find({
      locations: { $in: regionNames },
      requestor: { $ne: me._id }
    })
    .sort('name')
    .collation({ locale: 'en_US', strength: 1 })
    .populate('requestor', 'name nickname imgUrl')
    .populate('offerOrg', 'name imgUrl role')
  // if user has specified a territory, we should show the exact matches first, because we know
  // they are closest to the user.
  const userIsInTerritory = !me.locations.includes(regionNames)
  if (userIsInTerritory) {
    const closestOpportunities = []
    const otherOpportunities = []
    locationOps.map(op => {
      (arrayIntersects(me.locations, op.locations) ? closestOpportunities : otherOpportunities).push(op)
    })

    locationOps = closestOpportunities.concat(otherOpportunities)
  }

  return locationOps.slice(0, MAX_RECOMMENDATIONS)
}

const getSkillsRecommendations = async (me) => {
  const tagsToMatch = [...me.tags, ...me.topicGroups]
  if (!tagsToMatch.length) {
    return []
  }

  const types = []
  if (me.role.includes(Role.VOLUNTEER)) { types.push(OFFER) }
  if (me.role.includes(Role.BASIC) || types.length === 0) { types.push(ASK) }
  const opsWithMatchingTags = await Opportunity
    .find({
      tags: { $in: tagsToMatch },
      type: { $in: types },
      requestor: { $ne: me._id }
    })
    .populate('requestor', 'name nickname imgUrl')
    .populate('offerOrg', 'name imgUrl role')
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
  console.log(opsWithCounts)
  return opsWithCounts.map(op => op.op).slice(0, MAX_RECOMMENDATIONS)
}

module.exports = { getLocationRecommendations, getSkillsRecommendations }
