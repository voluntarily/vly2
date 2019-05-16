require('@babel/register')
/* eslint-disable no-console */
const vlyapi = require('./vlyapi')
const fs = require('fs')

const argv = require('yargs')
  .usage('Usage: vly get entity | vly post entity datafile')
  .command('PostPerson', 'Load a person from json file or stdin json')
  .help('h')
  .alias('h', 'help')
  .argv

const main = async () => {
  console.log('vly', argv._[0], argv._[1])
  switch (argv._[0]) {
    case 'get':
      vlyapi.get(argv._[1])
      break
    case 'post':
      try {
        const content = fs.readFileSync(argv._[2] ? argv._[2] : 0, 'utf8')
        const jsonContent = JSON.parse(content)
        vlyapi.post(argv._[1], jsonContent)
      } catch (e) {
        console.error(e)
      }
      break
    default:
      console.log(argv.usage)
  }
}

main()
