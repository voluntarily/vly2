const people = require('./test.database.fixture')
const Person = require('../../api/person/person')

exports.personcreate = async t => {
  await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  console.log(people.length)
}
