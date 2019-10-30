/* global fetch */
import 'isomorphic-fetch'
import { config } from '../config/config'

export const APP_URL =
  typeof window === 'undefined' || process.env.NODE_ENV === 'test'
    ? process.env.BASE_URL || config.appUrl
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
  const headers = {
    'content-type': 'application/json'
  }
  if (cookies) {
    headers.Cookie = convertCookiesToKvps(cookies)
  }
  try {
    /**
     * Get request should not have a body. With JSON.stringify the result of stringify null
     *  Will return a string "null" as a result value
     * This gets added to the body as "null" which window fectch is gonna bitching about it so they will just gonna throw nasty error
     * SOLUTION: easy, just check if the body is actually null ( 3 equal signs) then make the request body to be undefined else leave it alone
     */
    const requestBody = body === null ? undefined : body
    const response = await fetch(`${API_URL}/${endpoint}`, {
      headers,
      method,
      body: JSON.stringify(requestBody)
    })
    if (!response.ok) {
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
