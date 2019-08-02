import people from '../../../server/api/person/__tests__/person.fixture'
import orgs from '../../../server/api/organisation/__tests__/organisation.fixture'
import { MemberStatus } from '../../../server/api/member/member.constants'
import objectid from 'objectid'

// setup a fixture using people, orgs and some followers
const fixture = (t) => {
  people.map(p => { p._id = objectid().toString() })
  const me = people[0]
  // setup list of organisations, I am owner for the first one
  orgs.map((org, index) => {
    org._id = objectid().toString()
    org.orgAdmin = people[index]._id
  })

  const members = orgs
    .filter(org => org.orgAdmin !== me._id)
    .map((org, index) => {
      return ({
        _id: objectid().toString(),
        person: me._id,
        organisation: org,
        validation: `${index}: ${me.nickname} follows ${org.name}`,
        status: MemberStatus.FOLLOWER
      })
    })

  const extraMembers = [
    {
      _id: objectid().toString(),
      person: people[0],
      organisation: orgs[0],
      validation: 'test follower',
      status: MemberStatus.FOLLOWER
    },
    // person 1 is member of two orgs
    // org 1 has two members
    {
      _id: objectid().toString(),
      person: people[1],
      organisation: orgs[0],
      validation: 'test member 1',
      status: MemberStatus.JOINER
    },
    {
      _id: objectid().toString(),
      person: people[1],
      organisation: orgs[1],
      validation: 'test member 1',
      status: MemberStatus.MEMBER
    },
    {
      _id: objectid().toString(),
      person: people[3],
      organisation: orgs[1],
      validation: 'test member 3',
      status: MemberStatus.EXMEMBER
    }
  ]
  t.context = {
    me,
    people,
    orgs,
    members: members.concat(extraMembers)
  }
}

export default fixture
