/*
  Smart component. For the given org id and person id,
  on state:
    none - follow,  create new FOLLOWER record
    follow - unfollow

  if the person is a member display leave
  if the
  If no member exists, it will allow one to be created. If one does exist, it will allow it to be updated or cancelled.
*/
import { message } from 'antd'
import styled from 'styled-components'
import reduxApi, { withMembers } from '../../lib/redux/reduxApi'
import { MemberStatus } from '../../server/api/member/member.constants'
import RegisterMemberItem from './RegisterMemberItem'

// Helper function to generate a blank member.
const getNewMember = (me, org) => {
  return {
    person: me,
    organisation: org,
    validation: ''
  }
}
const RegisterButtonBox = styled.section`
  display: inline-block;
  margin-top: 1rem;
  button {
    margin-right: 1rem;
  }

  p {
    margin: 0.5rem 0;
  }

  input {
    max-width: unset;
    width: auto;
  }
  @media screen and (max-width: 767px) {
    width: calc(100vw - 2rem);
    margin-bottom: 2rem;
  }
`

const RegisterMemberSection = ({ meid, orgid, members, dispatch }) => {
  // When the button is clicked to advance the member status, make an appropriate api call.
  const handleChangeStatus = async (member, action) => {
    // const prevStatus = member.status
    switch (action) {
      case 'follow':
        member.status = MemberStatus.FOLLOWER
        break
      case 'join':
        member.status = MemberStatus.JOINER
        break
      case 'validate':
        member.status = MemberStatus.VALIDATOR
        break
      case 'unjoin':
        member.status = MemberStatus.FOLLOWER
        break
      case 'unfollow':
        member.status = MemberStatus.NONE
        break
      case 'leave':
        member.status = MemberStatus.EXMEMBER
        break
    }

    if (member._id) {
      await dispatch(reduxApi.actions.members.put({ id: member._id }, { body: JSON.stringify(member) }))
      message.success('Updated')
    } else {
      await dispatch(reduxApi.actions.members.post({}, { body: JSON.stringify(member) }))
      message.success('Added')
    }
  }

  // If we have access to the members section of the Redux store...
  // Get the member out of the store, if any.
  let member = null

  if (members.data.length > 0) {
    const matches = members.data.filter(m => m.person && m.person._id === meid)
    member = matches.length && matches[0]
  }
  if (!member) {
    member = getNewMember(meid, orgid)
  }
  return (
    <RegisterButtonBox>
      <RegisterMemberItem
        member={member}
        onChangeStatus={handleChangeStatus}
      />
    </RegisterButtonBox>
  )
}

export default withMembers(RegisterMemberSection)
