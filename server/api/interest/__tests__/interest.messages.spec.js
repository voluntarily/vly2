import test from 'ava'
import { appReady } from '../../../server'
import { Interest } from '../interest'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import Opportunity from '../../opportunity/opportunity'
import ops from '../../opportunity/__tests__/opportunity.fixture'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import Organisation from '../../organisation/organisation'
import orgs from '../../organisation/__tests__/organisation.fixture'
import { getInterestDetail } from '../interest.lib'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  await appReady

  t.context.people = await Person.create(people)
  t.context.me = t.context.people[0] // I am the first person.
  t.context.orgs = await Organisation.create(orgs)

  // setup opportunities 5 items
  ops.forEach((op, index) => {
    // each op has a different person as requestor, but not me
    op.requestor = t.context.people[index + 1]._id
    // all the ops belong to the OMGTech org
    op.offerOrg = t.context.orgs[1]._id
  })
  t.context.ops = await Opportunity.create(ops)

  // setup interests
  // each op has person + 2 interested.
  const interests = t.context.ops.map((op, index) => {
    const enquirer = t.context.people[index + 2]
    return {
      person: enquirer._id,
      opportunity: op._id,
      comment: `${index} ${enquirer.nickname} interested in ${op.name}`,
      messages: [{
        name: enquirer.nickname,
        body: `${index} ${enquirer.name} interested in ${op.name}`,
        author: enquirer._id
      }]
    }
  })
  t.context.interests = await Interest.create(interests)
})

test.serial('Append a message to an interest record via db call', async t => {
  // get an interest record
  const interest = t.context.interests[0]
  const meid = interest.person
  const message1 = {
    name: 'Welcome to Voluntarily',
    body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    In erat mauris, faucibus quis pharetra sit amet, pretium ac libero. 
    Etiam vehicula eleifend bibendum. Morbi gravida metus ut sapien 
    condimentum sodales mollis augue sodales. `,
    author: meid
  }
  interest.messages.push(message1)
  await interest.save()
  let newInterest = await getInterestDetail(interest._id)
  t.is(newInterest.messages[1].body, message1.body)

  // add a second message
  const testbody = 'I don\'t know but it seems fun'
  const message2 = {
    body: testbody,
    author: newInterest.opportunity.requestor._id
  }
  interest.messages.push(message2)
  await interest.save()
  newInterest = await getInterestDetail(interest._id)
  t.is(newInterest.messages[2].body, message2.body)

  // find message
  const foundMessage = await Interest.findOne({ 'messages.body': testbody }).exec()
  t.truthy(foundMessage.messages[0].body, testbody)
})
