/* eslint-disable no-console */
const axios = require('axios')
const API_URL = process.env.VLY_URL || 'http://localhost:3122'

export const get = async (endpoint, params) => {
  try {
    const url = `${API_URL}/api/${endpoint}`
    const response = await axios.get(url, params)
    const data = response.data
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}

export const post = (endpoint, thing) => {
  const url = `${API_URL}/api/${endpoint}`
  console.log(thing)
  axios.post(url, thing)
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
}
