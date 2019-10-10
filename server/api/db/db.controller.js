const Opportunity = require('../opportunity/opportunity')
const Person = require('../person/person')
const Organisation = require('../organisation/organisation')
const Activity = require('../activity/activity')
const cuid = require('cuid')
const optitle = [
  'A Quest for soldering irons',
  'An opportunity modified',
  'Basics of 3D printing',
  'Coding camp',
  'Dev Meeting',
  'Need a developer',
  'How to make robots',
  'Learn programming in 30 days',
  'Lets build a webpage',
  'Lets eat python',
  'Teaching student how to program'
];

const oplocation = [
  'Auckland',
  'Wellington',
  'Hamilton',
  'Christchurch',
  'Dunedin',
  'Matamata',
  'Hawkes Bay',
  'Queenstown',
];

const opduration = [
  '2 Hours (Flexible)',
  '6 hours',
  '1 hour',
  '3 hours',
  '45 minutes',
  '2-3 hours'
];


const forall = (model, action) => {
  var cursor = model.find().cursor()
  // Execute the each command, triggers for each document
  cursor.eachAsync(item => {
    action(item)
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
        imgUrl: 'https://picsum.photos/id/' + [Math.round(Math.random() * 50)] + '/200/300',
        description: 'code... code...',
        duration: opduration[Math.floor(Math.random() * opduration.length)],
        offerOrg: orgs._id,
        location: oplocation[Math.floor(Math.random() * oplocation.length)],
        status: 'active',
        requestor: person[Math.floor(Math.random() * person.length)]._id,
        date: createRandomDate(new Date(2019, 1, 1), new Date(2020, 1, 1))
      }
      await Opportunity.create(ops).catch((err) => `unable to create people: ${console.log(err)}`)
    }
  } catch (err) {
    console.log(err)
  }
}

const createRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
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
      if (model) { forall(model, console.log) }
      break
    }

    case 'fixName': {
      const model = getModel(req.query.e)
      if (model) {
        forall(model, async item => {
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
