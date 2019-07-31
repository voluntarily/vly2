import people from '../../../server/api/person/__tests__/person.fixture'
import orgs from '../../../server/api/organisation/__tests__/organisation.fixture'
import { MemberStatus } from '../../../server/api/member/member.constants'
const members = [
  {
    _id: '1',
    person: people[0],
    organisation: orgs[0],
    validation: 'test follower',
    status: MemberStatus.FOLLOWER
  },
  // person 1 is member of two orgs
  // org 1 has two members
  {
    _id: '2',
    person: people[1],
    organisation: orgs[0],
    validation: 'test member 1',
    status: MemberStatus.JOINER
  },
  {
    _id: '3',
    person: people[1],
    organisation: orgs[1],
    validation: 'test member 1',
    status: MemberStatus.MEMBER
  },
  {
    _id: '4',
    person: people[3],
    organisation: orgs[1],
    validation: 'test member 3',
    status: MemberStatus.EXMEMBER
  }
]

export default {
  people,
  orgs,
  members
}
