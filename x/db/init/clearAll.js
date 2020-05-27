const { connectDB, disconnectDB } = require('./util')
const { clearCollections } = require('./clearCollections')
const { makeDefaultOrgs } = require('./makeDefaultOrgs')
const { loadGoals } = require('../../../server/api/goal/loadGoals')

async function main () {
  console.log('Warning - this will wipe your database')
  connectDB()
  await clearCollections()
  await makeDefaultOrgs()
  await loadGoals()
  disconnectDB()
  console.log('Done')
  process.exit(0)
}

main()
