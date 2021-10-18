#!/usr/bin/env node
require('@babel/register')
/*
  General purpose command line processor for database functions
  usage examples:

  ## Get basic entities
    vly list people
    vly list organisations
    vly list interests
    vly list activities
    vly list opportunities

  return json file of the related entity.

  ## Post entitites ( note plurals on the names )
    vly post people andrew.person.json
    vly post opportunities op-impact.json

*/
/* eslint-disable no-console */
const vlyapi = require('./vlyapi')
const fs = require('fs')

const argv = require('yargs')
  .usage('Usage: vly list entity | vly post entity datafile')
  .command('Post Person', 'Load a person from json file or stdin json')
  .help('h')
  .alias('h', 'help').argv

const main = async () => {
  // console.log('vly', argv._[0], argv._[1])
  switch (argv._[0]) {
    case 'list':
      vlyapi.list(argv._[1], argv._[2])
      break
    case 'get':
      // argv[2] should be an _id
      vlyapi.get(argv._[1], argv._[2])
      break
    case 'post':
      try {
        const content = fs.readFileSync(argv._[2] ? argv._[2] : 0, 'utf8')
        const json = JSON.parse(content)
        if (Array.isArray(json)) {
          console.log(`posting ${json.length} items`)
          json.forEach(j => {
            vlyapi.post(argv._[1], j)
          })
        } else {
          vlyapi.post(argv._[1], json)
        }
      } catch (e) {
        console.error(e)
      }
      break
    case 'delete':
      // argv[2] should be an _id
      vlyapi._delete(argv._[1], argv._[2])
      break
    default:
      console.log(argv.usage)
  }
}

main()
