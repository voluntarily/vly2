/* global fetch */
// TODO: [VP-757] switch to isomorphic-unfetch
import 'isomorphic-fetch'
import { config } from '../config/clientConfig.js'

export const APP_URL =
  typeof window === 'undefined' || process.env.NODE_ENV === 'test'
    ? process.env.APP_URL || config.appUrl
    : ''

export const API_URL = `${APP_URL}/api`

export const convertCookiesToKvps = (cookies) => {
  let cookieKvp = ''
  if (cookies) {
    Object.keys(cookies).map(key => {
      cookieKvp += `${key}=${cookies[key]};`
    })
  }
  return cookieKvp
}

const callApi = async (endpoint, method = 'get', body, cookies) => {
  try {
    const url = `${API_URL}/${endpoint}`
    const options = { method, headers: { } }
    if (method === 'post' || method === 'put') {
      options.headers = { 'Content-Type': 'application/json' }
      options.body = JSON.stringify(body)
    }
    if (cookies) {
      options.headers.Cookie = convertCookiesToKvps(cookies)
    }

    const response = await fetch(url, options)
    if (!response.ok) {
      console.error('callApi error response', response)
      // according to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject
      // it is useful to make reason an instanceof Error
      return Promise.reject(new Error(JSON.stringify({ status: response.status, statusText: response.statusText, message: response.body })))
    }
    const json = await response.json()
    return json
  } catch (err) {
    return Promise.reject(err)
  }
}

export default callApi
