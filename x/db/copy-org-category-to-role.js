const mongoose = require('mongoose')
const { config } = require('../../config/serverConfig')
const Organisation = require('../../server/api/organisation/organisation')
async function main () {
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

  // if (!process.argv[2]) {
  //   console.log('usage: node x/db/copy-org-category-to-role')
  //   console.log('Iterate each Organisation and copy category values to role array ')
  //   process.exit(1)
  // }

  const done = new Promise((resolve, reject) => {
    Organisation
      .find({ })
      .cursor()
      .on('data', function (doc) {
        console.log(doc.name, doc.category, doc.role)
        if (doc.category && !doc.role) {
          doc.role = doc.category
          doc.save()
        }
      })
      .on('end', function () {
        console.log('Done!')
        resolve(true)
      })
  })
  await done
  await mongoose.disconnect()
  process.exit(0)
}

main()
