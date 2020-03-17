const { connectDB, disconnectDB } = require('./util')
const { clearCollections } = require('./clearCollections')

async function main () {
  console.log('Warning - this will wipe your database')
  connectDB()
  await clearCollections()
  disconnectDB()
  console.log('Done')
  process.exit(0)
}

main()
