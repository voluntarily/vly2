#!/usr/bin/env node
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* Remove all people from the database who have the role support */
const axios = require('axios')

const getData = async url => {
  try {
    const response = await axios.get(url)
    const data = response.data
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
  }
  return {}
}

const deletePerson = async personId => {
  try {
    // eslint-disable-next-line prefer-template
    const url = 'http://localhost:3122/api/people/' + personId
    const response = await axios.delete(url)
    const data = response.data
    return data
  } catch (error) {
    console.log(error)
  }
  return {}
}

getData('http://localhost:3122/api/people')
  .then(people => {
    console.log(people)
    people.people.map(p => {
      if (p.role === 'support') {
        console.log('deleting:', p.name)
        return deletePerson(p._id)
      }
    })
  })
