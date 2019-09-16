const { config } = require('../../../config/config')
const Badge = require('./badge')
require('es6-promise').polyfill()
require('isomorphic-fetch')

const { fetch } = global
const issueNewBadge = async (req, res) => {
  const { BADGER_PASSWORD, BADGER_USERNAME } = config
  if ((!BADGER_PASSWORD && !BADGER_USERNAME) && process.env.NODE_ENV !== 'test') {
    return res.json({ 'message': 'Internal server error' }).status(500)
  }
  const badgrRes = await fetch(`https://api.badgr.io/o/token?username=${BADGER_USERNAME}&password=${BADGER_PASSWORD}`, {
    method: 'POST'
  })
  console.log(badgrRes)
  const { badgeID } = req.params
  const { email, _id } = req.body
  const badgrData = await badgrRes.json()
  const accessToken = badgrData.access_token
  const body = {
    'recipient': {
      'identity': `${email}`,
      'type': 'email',
      'hashed': true
    }
  }
  const response = await fetch(`https://api.badgr.io/v2/badgeclasses/${badgeID}/assertions`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()
  await insertIntoDatabase(data.result, _id)
  return res.json(data)
}

const insertIntoDatabase = async (result, id) => {
  const newBadgeIssue = result[0]
  const { entityType, image, badgeclass, issuer, issuerOpenBadgeId, createdAt, issuedOn, badgeclassOpenBadgeId, entityId } = newBadgeIssue
  const newBadge = {
    entityType,
    entityId,
    person: id,
    image,
    badgeclass,
    issuer,
    badgeclassOpenBadgeId,
    createdAt,
    issuedOn,
    issuerOpenBadgeId
  }
  Badge.insertMany(newBadge)
}

const listAllBadge = async (req, res) => {
  const { BADGER_PASSWORD, BADGER_USERNAME } = config
  if (!BADGER_PASSWORD && !BADGER_USERNAME) {
    return res.json({ 'message': 'Internal server error' }).status(500)
  }
  const badgrRes = await fetch(`https://api.badgr.io/o/token?username=${BADGER_USERNAME}&password=${BADGER_PASSWORD}`, {
    method: 'POST'
  })
  const badgrData = await badgrRes.json()
  const accessToken = badgrData['access_token']
  const badgeListResponse = await fetch('https://api.badgr.io/v2/badgeclasses', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  const data = await badgeListResponse.json()
  const { result } = data
  return res.json(result)
}

const listUserBadge = async (req, res) => {
  const { user } = req.params
  const { BADGER_PASSWORD, BADGER_USERNAME } = config
  const badgrRes = await fetch(`https://api.badgr.io/o/token?username=${BADGER_USERNAME}&password=${BADGER_PASSWORD}`, {
    method: 'POST'
  })
  const badgrData = await badgrRes.json()
  console.log(badgrData)
  const badgeResponse = await Badge.find({ person: user })
  if (badgeResponse == null) return res.json([]).status(200)
  return res.json(badgeResponse)
}

module.exports = {
  issueNewBadge,
  listAllBadge,
  listUserBadge
}
