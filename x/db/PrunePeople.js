#!/usr/bin/env node
/**
 * Process the connected database to remove all dangling references
 * to people that no longer exist.
 * process each of the following collections:
 *  Member.person
 *  Interest.person
 *  PersonalGoal.person
 *  Activity.owner
 *  Opportunity.requestor
 *  Story.author
 */

const mongoose = require('mongoose')
const { config } = require('../../config/serverConfig')
require('../../server/api/person/person')
const Member = require('../../server/api/member/member')
const { Interest } = require('../../server/api/interest/interest')
const Story = require('../../server/api/story/story')
const Opportunity = require('../../server/api/opportunity/opportunity')
const Activity = require('../../server/api/activity/activity')
const PersonalGoal = require('../../server/api/personalGoal/personalGoal')

const prunePerson = async (model, field) => {
  const list = await model.find({}, field).populate(field)
  let count = 0
  for (const doc of list) {
    if (doc.person === null) {
      console.log('removing', doc)
      await model.remove({ _id: doc._id })
      count += 1
    }
  }
  if (count) {
    console.log(count, field, ' records removed')
  }
}

async function main () {
  mongoose.Promise = Promise
  console.log('This will remove all docs that reference people that non longer exist in the database.')
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

  await Promise.all([
    prunePerson(Member, 'person'),
    prunePerson(Interest, 'person'),
    prunePerson(PersonalGoal, 'person'),
    prunePerson(Opportunity, 'requestor'),
    prunePerson(Activity, 'owner'),
    prunePerson(Story, 'author')
  ])
  await mongoose.disconnect()
  process.exit(0)
}

main()
