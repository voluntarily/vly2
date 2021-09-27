// import Link from 'next/link'
import { Divider } from 'antd'
import Head from 'next/head'
import MemberItem from '../../../components/Member/MemberItem'
import MemberSection from '../../../components/Member/MemberSection'
import MemberTable from '../../../components/Member/MemberTable'
import RegisterMemberItem from '../../../components/Member/RegisterMemberItem'
import { FullPage } from '../../../components/VTheme/VTheme'

import { MemberStatus } from '../../../server/api/member/member.constants'
import orgs from '../../../server/api/organisation/__tests__/organisation.fixture'
import people from '../../../server/api/person/__tests__/person.fixture'

// Initial members added into test db
const members = [
  {
    person: people[0],
    organisation: orgs[0],
    validation: 'test follower',
    status: MemberStatus.FOLLOWER
  },
  // person 1 is member of two orgs
  // org 1 has two members
  {
    person: people[1],
    organisation: orgs[0],
    validation: 'test member 1',
    status: MemberStatus.JOINER
  },
  {
    person: people[1],
    organisation: orgs[1],
    validation: 'test member 1',
    status: MemberStatus.MEMBER
  },
  {
    person: people[3],
    organisation: orgs[1],
    validation: 'test member 3',
    status: MemberStatus.EXMEMBER
  }
]
const orgid = '1'
const handleMembershipChange = (member, action) => {
  console.error(member.person.nickname, action)
}
const TestMemberPage = ({ ...props }) => (
  <FullPage>
    <Head>
      <title>Voluntarily Test Members</title>
    </Head>

    <h1>People Members in a Specific Organisation </h1>
    <p>organisation = {orgid}</p>
    <MemberSection orgid={orgid} />
    <Divider />

    <h1>Single Member Item</h1>
    <MemberItem style={{ width: '300px' }} member={members[0]} />
    <Divider />

    <h1>Longer Member Table</h1>
    <MemberTable style={{ width: '300px' }} members={members} onMembershipChange={handleMembershipChange} />
    {/* <code>{JSON.stringify(members)}</code>  */}

    <h1>Register Member Buttons</h1>
    {members.map((member, index) =>
      <div key={index}>
        <MemberItem member={member} />
        <RegisterMemberItem member={member} /><br />
      </div>
    )}

  </FullPage>
)
export default TestMemberPage
