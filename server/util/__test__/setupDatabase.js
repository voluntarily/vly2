import ops from '../../api/opportunity/__tests__/opportunity.fixture'
import Opportunity from '../../api/opportunity/opportunity'
import people from './test.database.fixture'
import Person from '../../api/person/person'

export const personCreate = async t => {
  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${console.log(err)}`)
}

const opportunityCreate = async t => {
  ops.map((op, index) => {
    op.requestor = t.context.people[index]._id
  })
  t.context.ops = await Opportunity.create(ops).catch((err) => `Unable to create ops: ${console.log(err)}`)

  // replace the requestor id with the actual person
  t.context.ops.map((op, index) => {
    op.requestor = t.context.people[index]
  })
}

export const initDB = async t => {
  await personCreate(t)
  await opportunityCreate(t)
}

//   for (let j = 0; j < ops.length; j++) {
//     op.requestor = people[j].name
//     for (let k = 0; k < people.length; k++) {
//       if (op.requestor !== people[k].name) {
//         console.log(people[k].name, op.requestor)
//         // return ({
//         //   _id: objectID.generate(),
//         //   person: people[k].name,
//         //   opportunity: op._id,
//         //   comment: `${people[k].nickname} is interested in ${op.name}`,
//         //   status: interestedStatus
//         // })
//       }
//     }
//   }
// })
