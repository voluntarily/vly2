const Person = require('./person')
const Badge = require('../badge/badge')

const personProfileCompletenessById = async (personId) => {
  const person = await Person.findById(personId).exec()
  if (!person) return false
  return personProfileCompleteness(person)
}

const personProfileCompleteness = (person) => {
  let score = 0
  let count = 0

  const scoreStr = (str, len) => {
    score += str ? str.length >= len && 1 : 0
    count += 1
  }

  const scoreArr = (arr, len) => {
    score += arr.length >= len && 1
    count += 1
  }

  scoreStr(person.name, 4)
  scoreStr(person.email, 6)
  scoreStr(person.nickname, 2)
  scoreStr(person.about, 50)
  scoreStr(person.location, 4)
  scoreStr(person.phone, 7)
  scoreStr(person.imgUrl, 10)
  // scoreStr(person.pronoun, 4) // defaulted
  // scoreStr(person.language, 4) // defaulted
  scoreStr(person.website, 10)
  // scoreStr(person.facebook, 4) // optional
  // scoreStr(person.twitter, 4) // optional
  // scoreStr(person.role, 4) // defaulted
  // scoreStr(person.status, 4) // can't set
  // scoreStr(person.dateAdded, 4) // defaulted
  // scoreStr(person.href, 4) // internal use
  scoreArr(person.tags, 5)
  // scoreStr(person.teacher, 4) // internal

  return { score, count }
}

const personHasBadge = async (person, badgeclass) => {
  const count = await Badge.count({ person: person._id, badgeclass }).exec()
  return count > 0
}

module.exports = {
  personProfileCompleteness,
  personProfileCompletenessById,
  personHasBadge
}
