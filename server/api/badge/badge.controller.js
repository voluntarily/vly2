require('isomorphic-fetch') /* global fetch */
const { config } = require('../../../config/config')
const Badge = require('./badge')

const getToken = async () => {
  const { BADGER_PASSWORD, BADGER_USERNAME } = config
  if ((!BADGER_PASSWORD && !BADGER_USERNAME) && process.env.NODE_ENV !== 'test') {
    throw new Error()
  }
  const badgrResponse = await fetch(`https://api.badgr.io/o/token?username=${BADGER_USERNAME}&password=${BADGER_PASSWORD}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const badgrData = await badgrResponse.json()
  return badgrData.access_token
}

const issueNewBadge = async (req, res) => {
  const { badgeID } = req.params
  const { email, _id } = req.body
  let accessToken 
  
  try { 
    accessToken = getToken()
  } catch(e) {
    return res.json({ message: 'Internal Server error, badge functionality is not available' }).sendStatus(500)
  }

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
  process.env.NODE_ENV !== 'test' && await insertNewBageIntoDatabase(data.result, _id)
  return res.json(data)
}

const insertNewBageIntoDatabase = async (result, id) => {
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
  let accessToken
  try {
    accessToken = getToken()
  } catch (e) {
    return res.json({ message: 'Badge system currently unavailable'}).sendStatus(500)
  }
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
