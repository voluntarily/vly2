const mongoose = require('mongoose')
const { config } = require('../../config/serverConfig')
const Person = require('../../server/api/person/person')
const { Role } = require('../../server/services/authorize/role')

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

  if (!process.argv[2]) {
    console.log('To make someone an admin run this script and provide an email address')
    console.log('e.g. node x/db/make-admin.js test@example.com')
    console.log('Note: the email provided should match an existing person record')
    process.exit(1)
  }

  const person = await Person.findOne({ email: process.argv[2] })

  if (person === null) {
    console.log(`Could not find person record for email: ${process.argv[2]}`)
    process.exit(1)
  }

  if (person.role.includes(Role.ADMIN)) {
    console.log(`${person.name} <${person.email}> is already an admin`)
    process.exit(0)
  }

  if (Array.isArray(person.role)) {
    person.role.push(Role.ADMIN)
  } else {
    person.role = [Role.ADMIN]
  }

  await person.save()
  console.log(`${person.name} <${person.email}> is now an admin`)

  await mongoose.disconnect()
  process.exit(0)
}

main()
