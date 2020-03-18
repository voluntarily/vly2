const mongoose = require('mongoose')
const { config } = require('../../config/serverConfig')
const Person = require('../../server/api/person/person')
const { Role } = require('../../server/services/authorize/role')

async function main() {
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

  // Get all person objects and move their 'location' field into a new field of type array called 'locations'
  const persons = await Person.find()

  for (const person of persons) {
    if (person.locations && Array.isArray(person.locations) && person.locations.length > 0) {
      console.log(`Skipping ${person.email} as they already have locations`)
      continue
    }

    // Copy the location value and commit it
    person.locations = person.location ? [person.location] : []
    await Person.updateOne({ _id: person._id }, person)

    // It's been copied and committed, so drop the old field
    await Person.updateMany({}, { $unset: { location: 1 } }, { multi: true });

    console.log(`Migrated ${person.email}`)
  }
}

main()
