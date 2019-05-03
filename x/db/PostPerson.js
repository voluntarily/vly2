#!/usr/bin/env node
/* eslint-disable no-console */
const axios = require('axios')
const fs = require('fs')
const argv = require('yargs')
  .usage('Usage: PostPerson [jsonfile]')
  .command('PostPerson', 'Load a person from json file or stdin json')
  .help('h')
  .alias('h', 'help')
  .argv

const postPerson = person => {
  console.log(person)
  axios.post('http://localhost:3122/api/people', person)
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
}

const content = fs.readFileSync(argv._[0] ? argv._[0] : 0, 'utf8')
const jsonContent = JSON.parse(content)
postPerson(jsonContent)
