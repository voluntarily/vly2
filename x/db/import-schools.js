const SchoolLookUp = require('../../server/api/school-lookup/school-lookup')
const mongoose = require('mongoose')
const { config } = require('../../config/config')
const schoolImport = require('../../lib/school-import/import')

async function main () {
  mongoose.Promise = Promise

  try {
    await mongoose.connect(
      config.databaseUrl,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
      }
    )

    await SchoolLookUp.deleteMany({})
  } catch (error) {
    console.log(error)
    process.exit(1)
  }

  await schoolImport(100)

  await mongoose.disconnect()

  console.log('Done')
  process.exit(0)
}

main()
