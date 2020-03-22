const mongoose = require('mongoose')
const { config } = require('../../../config/serverConfig')
const fs = require('fs')

// sequence generator
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step))
const gra = (min, max) => { return (Math.round(Math.random() * (max - min) + min)) }
const coin = (a, b) => { return gra(0, 1) ? a : b }

// sentence generator
const path = `${__dirname}/sentences.txt`
const sentences = []

fs.readFileSync(path, 'utf-8').split(/\r?\n/).forEach(line => { sentences.push(line) })

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const getSentences = () => {
  const count = gra(5, 15)
  const pick = Array(count).fill({}).map(() => sentences[gra(0, sentences.length - 1)])
  return pick.join('\n')
}

const fetch = require('isomorphic-fetch')
const fetchJson = async (url, options) => {
  const response = await fetch(url, options)
  if (!response.ok) {
    console.error('fetch error:', response)
    // according to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject
    // it is useful to make reason an instanceof Error
    return Promise.reject(new Error(JSON.stringify({ status: response.status, statusText: response.statusText, message: response.body })))
  }
  return response.json()
}

const tags = [
  'coding', 'javascript', 'react', 'styled-components', 'critical thinking', 'mongodb',
  'effective communication.', 'teamwork', 'responsibility', 'creativity', 'problem-solving',
  'leadership', 'storytelling', 'python', 'c++', 'java', 'forth', 'php', 'ada', 'fortran',
  'assembler', 'linux', 'mobile', 'ux', 'networks', 'tcp/ip', 'r', 'scala', 'excel', 'vba',
  'c', 'algol', 'lisp', 'awk', 'bash', 'aws', 'pascal', 'eiffel', 'rust', 'julia', 'logo',
  'flying', 'swimming', 'one', 'two', 'three', 'robot', '::///',
  'big', 'small', 'one', 'two', 'three', 'hello', 'brandon intermediate', 'rangitoto college',
  'test', 'skill 1', 'skill 2', 'skill 3', 'skill 4', 'fossils', 'robot', 'alfriston school',
  'school', 'activity', 'virus', 'sports', 'activities', 'explosives', 'hammers', 'falling',
  'fake tunnels', 'dinosaurs', 'thing', 'python', 'javascript', 'robots', 'reading', 'magnets',
  'science', 'power', 'electromangetism', 'gravity']

const getTags = count => {
  return Array(count).fill({}).map(() => tags[gra(0, tags.length - 1)])
}

const connectDB = async () => {
  mongoose.Promise = Promise

  try {
    await mongoose.connect(
      config.databaseUrl,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      }
    )
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

const disconnectDB = async () => {
  await mongoose.disconnect()
}

module.exports = {
  range,
  gra,
  coin,
  asyncForEach,
  fetchJson,
  getSentences,
  getTags,
  connectDB,
  disconnectDB
}
