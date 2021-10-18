import people from '../../../server/api/person/__tests__/person.fixture'
import orgs from '../../../server/api/organisation/__tests__/organisation.fixture'
import { MemberStatus } from '../../../server/api/member/member.constants'
import objectid from 'objectid'

// setup a fixture using people, orgs and some followers
const fixture = (t) => {
  people.forEach(p => { p._id = objectid().toString() })
  const me = people[0]
  // setup list of organisations, I am owner for the first one
  orgs.forEach((org, index) => {
    org._id = objectid().toString()
  })

  // Person 0 is OrgAdmin for every organisation
  let members = orgs.map((org, index) => {
    return ({
      _id: objectid().toString(),
      person: me,
      organisation: org,
      status: MemberStatus.ORGADMIN
    })
  })

  // // Person 1 follows every organisation
  // const follower = people[1]
  // members = members.concat(orgs.map((org, index) => {
  //   return ({
  //     _id: objectid().toString(),
  //     person: follower,
  //     organisation: org,
  //     status: MemberStatus.FOLLOWER
  //   })
  // }))

  // everyone is a member of org 3
  members = members.concat(people.map((person, index) => {
    return ({
      _id: objectid().toString(),
      person: person,
      organisation: orgs[3],
      status: MemberStatus.MEMBER
    })
  }))

  // everyone except me is a follower of org 4
  members = members.concat(people
    .filter(p => p._id !== me._id)
    .map((person, index) => {
      return ({
        _id: objectid().toString(),
        person: person,
        organisation: orgs[4],
        status: MemberStatus.FOLLOWER
      })
    }))

  members = members.concat([
    {
      _id: objectid().toString(),
      person: people[0],
      organisation: orgs[5],
      validation: 'test joiner',
      status: MemberStatus.JOINER
    },
    // person 1 is member of two orgs
    // org 1 has two members
    {
      _id: objectid().toString(),
      person: people[1],
      organisation: orgs[5],
      validation: 'test VALIDATOR',
      status: MemberStatus.VALIDATOR
    },
    {
      _id: objectid().toString(),
      person: people[2],
      organisation: orgs[5],
      validation: 'test member',
      status: MemberStatus.MEMBER
    },
    {
      _id: objectid().toString(),
      person: people[3],
      organisation: orgs[5],
      validation: 'test EXMEMBER',
      status: MemberStatus.EXMEMBER
    }
  ])

  t.context = {
    me,
    people,
    orgs,
    members
  }
}

export default fixture
