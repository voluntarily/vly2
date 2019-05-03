/* eslint-disable no-console */
const axios = require('axios')

const getData = async url => {
  try {
    const response = await axios.get(url)
    const data = response.data
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}

getData('http://localhost:3122/api/people')
