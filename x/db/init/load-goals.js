const mongoose = require('mongoose')
const { config } = require('../../../config/serverConfig')
const { loadGoals } = require('../../../server/api/goal/loadGoals')

async function main () {
  mongoose.Promise = Promise
  console.log('Loading goals')

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

  await loadGoals()

  await mongoose.disconnect()

  console.log('Done')
  process.exit(0)
}

main()
