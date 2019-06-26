import test from 'ava'
// import request from 'supertest'
import { appReady } from '../../server'
import Person from '../../api/person/person'
import people from './test.database.fixture'
import ops from '../../api/opportunity/__tests__/opportunity.fixture'
import Opportunity from '../../api/opportunity/opportunity'
import MemoryMongo from '../test-memory-mongo'
import { personcreate } from './test-utils'
// import {shallow} from 'enzyme'

test.before('before connect to database', async (t) => {
  await appReady
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.beforeEach(personcreate)

test.afterEach.always(async () => {
  await Person.deleteMany()
})

test.serial('counting the number of people', async t => {
  const count = await Person.countDocuments()
  t.is(count, people.length)
})

test.serial('setup list of opportunities and owner', async t => {
  var objectID = require('bson-objectid')
  const interestedStatus = ['interested']

  people.map(p => {
    p._id = objectID.generate()
  })
  const interests = ops.map(op => {
    op._id = objectID.generate()
    for (let j = 0; j < ops.length; j++) {
      op.requestor = people[j].name
      for (let k = 0; k < people.length; k++) {
        if (op.requestor !== people[k].name) {
          console.log(people[k].name, op.requestor)
          // return ({
          //   _id: objectID.generate(),
          //   person: people[k].name,
          //   opportunity: op._id,
          //   comment: `${people[k].nickname} is interested in ${op.title}`,
          //   status: interestedStatus
          // })
        }
      }
    }
  })
  console.log(interests)
})

// console.log(ops.length)

// owner cannot show interest to his own opportunity but he can volunteer to other opportunities
// create a volunteer list from the people fixture
// for (let i = 0; i <= ops.length; i++) {
//   volunteer = people[ i + 1 ]._id
// }

// ops.map((op, index) => {
//   op._id = objectID.generate()
//   op.reqestor = people[index]._id
//   console.log(op.reqestor, people[index]._id)
// })
