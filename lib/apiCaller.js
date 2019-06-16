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
  let headers = {
    'content-type': 'application/json'
  }
  if (cookies) {
    headers.Cookie = convertCookiesToKvps(cookies)
  }
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      headers,
      method,
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      return Promise.reject(response)
    }
    const json = await response.json()
    return json
  } catch (err) {
    console.log('callAPI error', err)
  }
}

export default callApi
