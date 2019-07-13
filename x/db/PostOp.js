#!/usr/bin/env node
/* eslint-disable no-console */
const axios = require('axios')
const fs = require('fs')
const { jwtData } = require('../../server/middleware/session/__tests__/setSession.fixture')
const argv = require('yargs')
  .usage('Usage: PostOp [jsonfile]')
  .command('PostOp', 'Load an Opportunity from json file or stdin json')
  .help('h')
  .alias('h', 'help')
  .argv

const API_URL = process.env.VLY_URL || 'http://localhost:3122'

const postOp = Op => {
  // console.log(Op)
  axios.post(`${API_URL}/api/opportunities`, Op, { headers: { Cookie: `idToken=${jwtData.idToken}` } })
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
}

const content = fs.readFileSync(argv._[0] ? argv._[0] : 0, 'utf8')
const jsonContent = JSON.parse(content)
postOp(jsonContent)
