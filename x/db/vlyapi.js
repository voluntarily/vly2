/* eslint-disable no-console */
const axios = require('axios')
const API_URL = process.env.VLY_URL || 'http://localhost:3122'

export const list = async (endpoint, params) => {
  try {
    const query = params ? `?${params}`: ''
    const url = `${API_URL}/api/${endpoint}${query}`
    const response = await axios.get(url, params)
    const data = response.data
    console.log(JSON.stringify(data))
  } catch (error) {
    console.log(error)
  }
}

export const get = async (endpoint, id, params) => {
  try {
    const query = params ? `?${params}`: ''
    const url = `${API_URL}/api/${endpoint}/${id}${query}`
    
    const response = await axios.get(url)
    const data = response.data
    console.log(JSON.stringify(data))
  } catch (error) {
    console.log(error)
  }
}

export const post = (endpoint, thing) => {
  const url = `${API_URL}/api/${endpoint}`
  // console.log(thing)
  axios.post(url, thing)
    .then((response) => {
      const data = response.data
      console.log(JSON.stringify(data))
    })
    .catch((error) => {
      console.log(error)
    })
}

export const _delete = (endpoint, id) => {
  const url = `${API_URL}/api/${endpoint}/${id}`
  axios.delete(url)
    .then((response) => {
      console.log(JSON.stringify(response.data))
    })
    .catch((error) => {
      console.log(error)
    })
}
