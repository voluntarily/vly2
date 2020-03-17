const { connectDB, disconnectDB, fetchJson, getSentences, gra, getTags } = require('./util')
const Person = require('../../../server/api/person/person')
const cuid = require('cuid')
const he = { subject: 'he', object: 'him', possessive: 'his' }
const she = { subject: 'she', object: 'her', possessive: 'her' }
const they = { subject: 'they', object: 'them', possessive: 'their' }
const pronoun = () => {
  switch (gra(0, 2)) { case 0: return he; case 1: return she; case 2: return they }
}

// const peopleService = 'https://randomuser.me'
const peopleService = 'http://localhost:3000'

const makePeople = async (count) => {
  const url = `${peopleService}/api/?results=${count}`
  const res = await fetchJson(url)
  const users = res.results
  const people = users.map(person => {
    const code = cuid()
    const email = `${person.login.username}-${code}@mailinator.com`
    const tags = getTags(gra(2, 10))
    const sentences = getSentences()
    const about = `${person.name.first} ${person.name.last} has a cuid of ${code} and email of ${email}\n${sentences}`
    return ({
      name: `${person.name.first} ${person.name.last}`,
      nickname: person.login.username,
      imgUrl: person.picture.medium,
      imgUrlsm: person.picture.thumbnail,
      email,
      phone: person.phone,
      pronoun: pronoun(),
      about,
      tags
    })
  })
  return Person.create(people)
}

async function main () {
  connectDB()
  await Person.deleteMany()
  if (!process.argv[2]) {
    console.log('Usage: makePeople count')
    process.exit(1)
  }
  const count = process.argv[2]
  const people = await makePeople(count)
  disconnectDB()
  console.log(people.length, 'People created')
  process.exit(0)
}

//  main()

module.exports = {
  makePeople,
  main
}
