import 'isomorphic-fetch'
import { config } from '../config/config'

export const APP_URL = (typeof window === 'undefined' || process.env.NODE_ENV === 'test')
  ? process.env.BASE_URL || config.appUrl
  : ''

export const API_URL = `${APP_URL}/api`

const callApi = async (endpoint, method = 'get', body) => {
  console.log('callAPI', endpoint, method, body)
  try {

    const response = await fetch(`${API_URL}/${endpoint}`, {
      headers: { 'content-type': 'application/json' },
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