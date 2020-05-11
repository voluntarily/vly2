/*
  Smart component. for the given organisation gets a list of Members
  and displays them in a table. actions change the state of the membered volunteers
*/
// import PropTypes from 'prop-types'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import styled from 'styled-components'
import reduxApi, { withMembers } from '../../lib/redux/reduxApi'
import { MemberStatus } from '../../server/api/member/member.constants'
import { Role } from '../../server/services/authorize/role.js'
import Html from '../VTheme/Html'
import InviteMembers from './InviteMembers'
import MemberExport from './MemberExport'
import MemberTable from './MemberTable'

const SubSection = styled.section`
  margin-bottom: 2.0rem;
  text-align: left;
`

const MemberSection = ({ org, me, members, isAdmin, dispatch }) => {
  const handleMembershipChange = async (member, action) => {
    switch (action) {
      case 'add':
        member.status = MemberStatus.MEMBER
        break
      case 'remove':
        member.status = MemberStatus.EXMEMBER
        break
      case 'reject':
        member.status = MemberStatus.FOLLOWER
        break
      case 'makeadmin':
        member.status = MemberStatus.ORGADMIN
        break
    }
    await dispatch(reduxApi.actions.members.put({ id: member._id }, { body: JSON.stringify(member) }))
  }

  if (me.role.includes(Role.ANON)) {
    return '' // blank page for anon users
  }
  const meid = me._id.toString()
  if (!org.info) { org.info = {} }
  // check if I am in the members list
  // TODO: [VP-440] members ability I am orgadmin then I get all members list, else I get just my own membership status
  let myMembership = members.data.find(m => m.person && m.person._id === meid)
  if (!myMembership) {
    myMembership = {
      status: MemberStatus.NONE
    }
  }

  // group membership status
  const memberOrOrgAdmin = m => [MemberStatus.MEMBER, MemberStatus.ORGADMIN].includes(m.status)
  const joinerOrValidator = m => [MemberStatus.VALIDATOR, MemberStatus.JOINER].includes(m.status)
  const follower = m => [MemberStatus.FOLLOWER].includes(m.status)
  const nonMember = m => [MemberStatus.NONE, MemberStatus.EXMEMBER].includes(m.status)

  // OrgAdmins see Member Table
  let orgAdminSection = ''
  if ((myMembership.status === MemberStatus.ORGADMIN) || isAdmin) {
    const realMembers = members.data.filter(memberOrOrgAdmin)
    const followers = members.data.filter(follower)
    const joiners = members.data.filter(joinerOrValidator)
    orgAdminSection =
      <div>
        <SubSection>
          <InviteMembers org={org} />
        </SubSection>
        <SubSection>
          <h2>
            <FormattedMessage
              id='memberSection.JoinersTitle'
              defaultMessage='Organisation Joiners'
              description='label for joiner table on org detail page'
            />
          </h2>

          <MemberTable
            members={joiners}
            onMembershipChange={handleMembershipChange}
            meid={meid}
          />
        </SubSection>
        <SubSection>
          <h2>
            <FormattedMessage
              id='memberSection.MembersTitle'
              defaultMessage='Organisation Members'
              description='label for member table on org detail page'
            />
          </h2>

          <MemberTable
            members={realMembers}
            onMembershipChange={handleMembershipChange}
            meid={meid}
          />
        </SubSection>

        <SubSection>
          <h2>
            <FormattedMessage
              id='memberSection.followersTitle'
              defaultMessage='Organisation Followers'
              description='label for follower table on org detail page'
            />
          </h2>

          <MemberTable
            members={followers}
            onMembershipChange={handleMembershipChange}
            meid={meid}
          />
        </SubSection>
      </div>
  }

  let joinerInfoSection = ''
  if (joinerOrValidator(myMembership)) {
    joinerInfoSection =
      <section>
        <h2>
          <FormattedMessage
            id='memberSection.joinerInfoSection'
            defaultMessage='Information for new members'
            description='label for follower table on org detail page'
          />
        </h2>
        <Html children={org.info.joiners || ''} />
      </section>
  }

  // full Members see instructions
  let memberInfoSection = ''
  if (memberOrOrgAdmin(myMembership)) {
    memberInfoSection =
      <section>
        <h2>
          <FormattedMessage
            id='memberSection.memberInfoTitle'
            defaultMessage='Information for members'
            description='label for org info for members detail page'
          />
        </h2>
        <Html children={org.info.members || ''} />
      </section>
  }

  // full Members see instructions
  let followerInfoSection = ''
  if (follower(myMembership)) {
    followerInfoSection =
      <section>
        <h2>
          <FormattedMessage
            id='memberSection.followerInfoTitle'
            defaultMessage='Information for followers'
            description='label for org info for followers detail page'
          />
        </h2>
        <Html children={org.info.followers || ''} />
      </section>
  }

  let nonMemberInfoSection = ''
  if (nonMember(myMembership)) {
    nonMemberInfoSection =
      <section>
        <h2>
          <FormattedMessage
            id='memberSection.notMember'
            defaultMessage='About Joining'
            description='message to non members on the org members tab'
          />
        </h2>
        <Html children={org.info.outsiders || ''} />
      </section>
  }

  let memberExportSection = ''
  if (myMembership.status === MemberStatus.ORGADMIN || isAdmin) {
    memberExportSection =
      <section>
        <MemberExport members={members.data} />
      </section>
  }

  return (
    <div>
      {orgAdminSection}
      {followerInfoSection}
      {memberExportSection}
      {memberInfoSection}
      {joinerInfoSection}
      {nonMemberInfoSection}
    </div>
  )
}

MemberSection.propTypes = {
  me: PropTypes.object,
  members: PropTypes.object
}

// Warning me will be {} if not signed in and role will be undefined.
const mapStateToProps = store => ({
  me: store.session.me,
  isAdmin: store.session.me.role && store.session.me.role.includes('admin')
})

const MemberSectionWithMe = connect(
  mapStateToProps
)(MemberSection)

export default withMembers(MemberSectionWithMe)
