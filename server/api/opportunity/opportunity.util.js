const Opportunity = require('./opportunity')
const { regions } = require('../location/locationData')
const { Role } = require('../../services/authorize/role')
const { OpportunityType } = require('./opportunity.constants')
const { ASK, OFFER } = OpportunityType
const stringSimilarity = require('string-similarity')
const natural = require('natural')
const stopword = require('stopword')
const AliasSet = require('../aliases/aliasSet')

const arrayIntersects = (arrA, arrB) =>
  arrA.filter((x) => arrB.includes(x)).length
const MAX_RECOMMENDATIONS = 10

/**
 *
 * @param {{ locations: string[], _id }} me
 * @returns {Promise<any[]>}
 */
const getLocationRecommendations = async (me) => {
  const regionsToMatch = regions.filter(
    (loc) =>
      me.locations.includes(loc.name) ||
      !!loc.containedTerritories.find((containedTerritory) =>
        me.locations.includes(containedTerritory)
      )
  )

  if (regionsToMatch.length === 0) {
    return []
  }

  // Extract all region names and the territories of those regions
  // e.g. ['Bay of Plenty', 'Western Bay of Plenty District', 'Tauranga City', ..., 'Waikato', 'Thames-Coromandel District', 'Taupo District', ...]
  const regionNames = regionsToMatch.flatMap((region) => [
    region.name,
    ...region.containedTerritories
  ])

  let locationOps = await Opportunity.find({
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
    locationOps.map((op) => {
      (arrayIntersects(me.locations, op.locations)
        ? closestOpportunities
        : otherOpportunities
      ).push(op)
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
  if (me.role.includes(Role.VOLUNTEER)) {
    types.push(OFFER)
  }
  if (me.role.includes(Role.BASIC) || types.length === 0) {
    types.push(ASK)
  }

  // Split composite tags into singular words
  var splitTags = tagsToMatch.flatMap((tag) => {
    return stopword.removeStopwords(tag.split(' '))
  })
  // Tags with special characters are not stemmed
  var format = new RegExp(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/)

  // Find all aliases of the user's tags
  var aliasesJSON = await AliasSet.find({ tag: { $in: splitTags } })
  var aliases = []
  aliasesJSON.forEach((aliasSet) => {
    aliasSet.aliases.forEach((alias) => {
      aliases.push(alias)
    })
  })

  // Stem the tags to contain the root of a word
  splitTags = splitTags.concat(aliases)
  var stemmedTags = splitTags
    .filter((tag) => {
      if (format.test(tag)) {
        return false
      } else {
        return true
      }
    })
    .map((tag) => {
      return natural.PorterStemmer.stem(tag)
    })

  // Turn stemmed words into a regular expression
  var regexTags = new RegExp(stemmedTags.join('|'), 'i')
  // Join arrays of tags and tag word roots for search
  var tagsToSearch = tagsToMatch.concat(aliases, regexTags)

  const opsWithMatchingTags = await Opportunity.find({
    tags: { $in: tagsToSearch },
    type: { $in: types },
    requestor: { $ne: me._id }
  })
    .populate('requestor', 'name nickname imgUrl')
    .populate('offerOrg', 'name imgUrl role')
  const opsWithCounts = []

  opsWithMatchingTags.forEach((op) => {
    let count = 0
    op.tags.forEach((tag) => {
      if (tagsToMatch.includes(tag)) {
        count++
      } else if (tagsToSearch.length !== 0) {
        if (aliases.includes(tag)) {
          // An alias match is half as valuable as a full match
          count = count + 0.5
        } else {
          // Calculate similarity score that will be added to the score
          const simScore = stringSimilarity.findBestMatch(tag, stemmedTags)
            .bestMatch.rating
          count = count + simScore
        }
      }
    })
    opsWithCounts.push({ count, op })
  })

  opsWithCounts.sort((a, b) => {
    return b.count - a.count
  })
  return opsWithCounts.map((op) => op.op).slice(0, MAX_RECOMMENDATIONS)
}

module.exports = { getLocationRecommendations, getSkillsRecommendations }
