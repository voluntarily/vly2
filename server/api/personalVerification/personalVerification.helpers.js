require('isomorphic-fetch') /* global fetch */
const { uuid } = require('uuidv4')
const crypto = require('crypto')
const moment = require('moment')
const { config } = require('../../../config/serverConfig')

const createNonce = () => uuid()
const createReference = () => uuid()
const createUnixTimestamp = () => moment().unix() * 1000
const postCloudcheck = async (options) => {
  const path = options.path || ''
  console.log('data: ' + options.data)
  const obj = options.data || {}

  const signature = generateSignature(path, obj)
  obj.signature = signature

  let bodyString = ''
  for (const [key, value] of Object.entries(obj)) {
    if (bodyString) {
      bodyString += '&'
    }
    bodyString += `${key}=${encodeURIComponent(value)}`
  }

  return fetch(`${config.verification.cloudcheck.url}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Content: 'application/x-www-form-urlencoded'
    },
    body: bodyString
  }).then((response) => {
    return response.json()
  }).then((data) => {
    return data
  }).catch(error => {
    console.error(error)
    throw Error(`Error caling cloudcheck with Path: ${path}`)
  })
}

const getCloudcheck = async (options) => {
  const path = options.path
  const obj = options.data

  const signature = generateSignature(path, obj)
  obj.signature = signature

  let urlQueryString = ''
  for (const [key, value] of Object.entries(obj)) {
    if (urlQueryString) {
      urlQueryString += '&'
    }
    urlQueryString += `${key}=${value}`
  }

  return fetch(`${config.verification.cloudcheck.url}${options.path}?${urlQueryString}`)
    .then((response) => {
      return response.json()
    }).then((data) => {
      return data.capture
    }).catch(error => {
      console.error(error)
      throw Error(`Error caling cloudcheck with Path: ${path}`)
    })
}

const generateSignature = (path, obj) => {
  let string = path
  for (const [key, value] of Object.entries(obj)) {
    string += `${key}=${value};`
  }

  return crypto.createHmac('sha256', config.verification.cloudcheck.secret)
    .update(string)
    .digest('hex').toString('base64')
}

module.exports = {
  createNonce,
  createReference,
  createUnixTimestamp,
  postCloudcheck,
  getCloudcheck
}
