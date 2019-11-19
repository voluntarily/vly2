const mongoose = require('mongoose')
const Opportunity = require('../opportunity/opportunity')
const Person = require('../person/person')
const Organisation = require('../organisation/organisation')
const Tag = require('../tag/tag')
const TagObj = require('../tag/tagObj')
const Activity = require('../activity/activity')
const cuid = require('cuid')
const optitle = ['A Quest for soldering irons',
  'An opportunity modified',
  'Basics of 3D printing',
  'Coding camp',
  'Dev Meeting',
  'Need a developer',
  'How to make robots',
  'Learn programming in 30 days',
  'Lets build a webpage',
  'Lets eat python',
  'Teaching student how to program']

const forall = async (model, action) => {
  const cursor = model.find().cursor()

  // Execute the each command, triggers for each document
  cursor.eachAsync(async item => {
    await action(item)
    // return user.save().exec()        // Need promise
  }).then(
    (res) => console.log('db action completed'),
    (err) => console.log('db action failed', err)
  )
}

const getModel = name => {
  switch (name) {
    case 'Organisation': return Organisation
    case 'Opportunity': return Opportunity
    case 'Activity': return Activity
    case 'Person': return Person
    case 'TagObj': return TagObj
    case 'Tag': return Tag
  }
}
const createPerson = async (p) => {
  let count = 1
  while (count <= p) {
    const person = {
      name: `Testy ${cuid()}`,
      nickname: 'T',
      email: `testy${cuid()}@gmail.com`,
      about: 'tester',
      gender: 'Male',
      language: 'English',
      role: ['volunteer', 'activityProvider'],
      status: 'active',
      imgUrl: 'https://image.freepik.com/free-vector/web-programmer_23-2147502079.jpg',
      phone: '0542554815',
      dateAdded: Date.now()
    }
    count += 1
    await Person.create(person).catch((err) => `unable to create people: ${console.log(err)}`)
  }
}

const createOpportunity = async (op) => {
  try {
    const person = await Person.find({}).exec()
    const orgs = await Organisation.find({}).exec()
    for (let i = 0; i < op; i++) {
      const ops = {
        name: optitle[Math.floor(Math.random() * optitle.length)],
        subtitle: 'Help us to learn how to code',
        imgUrl: 'https://leaderonomics.com/wp-content/uploads/2017/04/1807658-1-600x470.jpg',
        description: 'code... code...',
        duration: '4 weeks, 2 hour session',
        offerOrg: orgs._id,
        location: 'Auckland',
        status: 'active',
        requestor: person[Math.floor(Math.random() * person.length)]._id,
        date: [null, null]
      }
      await Opportunity.create(ops).catch((err) => `unable to create people: ${console.log(err)}`)
    }
  } catch (err) {
    console.log(err)
  }
}

const GetRandomPersonID = async () => {
  try {
    const numPeople = await Person.countDocuments()
    const index = Math.floor(Math.random() * numPeople)
    const person = await Person.findOne({ nickname: 'T' }, '_id').skip(index).exec()
    console.log(person._id)
    return person._id
  } catch (err) {
    return console.log(err)
  }
}

const dbfactory = async (req, res) => {
  await GetRandomPersonID()
}
/*
  DB Action Endpoint is used to perform some Database admin activities
  Note - because this is a tool for updating the database when the schema changes
  the code does not form part of the main applicaiton and is thus excluded from
  test coverage
*/
const dbAction = async (req, res) => {
  switch (req.params.action) {
    case 'log':
      console.log('db', req.query.msg)
      break
    case 'list': {
      const model = getModel(req.query.e)
      if (model) { await forall(model, console.log) }
      break
    }

    case 'fixName': {
      const model = getModel(req.query.e)
      if (model) {
        await forall(model, async item => {
          if (item.title) {
            item.name = item.title
            delete item.title
            await item.save()
          }
          if (item.avatar) {
            item.imgUrl = item.avatar
            delete item.avatar
            await item.save()
          }
        })
      }
      break
    }
    case 'fixTags': {
      /* example: localhost:3122/api/db/fixTags?e="Person" */
      const model = getModel(req.query.e)
      console.log('FixTags: Model = ', model)
      if (model) {
        await forall(model, async item => {
          console.log('before:', item)
          if (item.tags && item.tags.length !== 0 &&
            mongoose.Types.ObjectId.isValid(item.tags[0])) {
            const strTags = await Promise.all(item.tags.map(
              async t => {
                const tag = await TagObj.findById(t)
                return tag.tag
              }))
            console.log('strTags', strTags)
            item.tags = strTags
            console.log('about to save:', item)
            const saved = await item.save()
            console.log('saved:', saved)
          }
        })
      }
      break
    }
    case 'initdb': {
      await createPerson(req.query.people)
      await createOpportunity(req.query.ops)
      // await createOrgs()
    }
  }
  const result = {
    message: `DB Action ${req.params.action}`,
    params: req.params,
    query: req.query
  }
  return res.status(200).json(result)
}

module.exports = {
  dbAction,
  getModel,
  dbfactory
}
