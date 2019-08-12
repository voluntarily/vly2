/*
  Smart component. for the given organisation gets a list of Members
  and displays them in a table. actions change the state of the membered volunteers
*/
// import PropTypes from 'prop-types'
import React, { Component } from 'react'
import MemberTable from './MemberTable'
import { FormattedMessage } from 'react-intl'
import reduxApi, { withMembers } from '../../lib/redux/reduxApi'
import Loading from '../Loading'
import { MemberStatus } from '../../server/api/member/member.constants'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const SubSection = styled.section`
  margin-bottom: 2.0rem;
`

class MemberSection extends Component {
  componentDidMount () {
    // Get all members and followers of the organisation
    const orgid = this.props.orgid
    this.props.dispatch(reduxApi.actions.members.get({ orgid: orgid }))
  }

  async handleMembershipChange (member, action) {
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
    await this.props.dispatch(reduxApi.actions.members.put({ id: member._id }, { body: JSON.stringify(member) }))
  }

  render () {
    if (this.props.members.loading) {
      return <Loading />
    }
    if (!this.props.members.sync) {
      return <Loading />
    }
    const meid = this.props.me._id
    // check if I am in the members list
    // TODO: [VP-440] members ability I am orgadmin then I get all members list, else I get just my own membership status
    let myMembership = this.props.members.data.find(m => m.person._id === meid)
    myMembership.isMe = true

    // group membership status
    const memberOrAdmin = m => [MemberStatus.MEMBER, MemberStatus.ORGADMIN].includes(m.status)
    const joinerOrValidator = m => [MemberStatus.VALIDATOR, MemberStatus.JOINER].includes(m.status)
    const follower = m => [MemberStatus.FOLLOWER].includes(m.status)
    const nonMember = m => !myMembership || [MemberStatus.NONE, MemberStatus.EXMEMBER].includes(m.status)

    // OrgAdmins see Member Table
    let orgAdminSection = ''
    if (myMembership.status === MemberStatus.ORGADMIN) {
      const members = this.props.members.data.filter(memberOrAdmin)
      const followers = this.props.members.data.filter(follower)
      const joiners = this.props.members.data.filter(joinerOrValidator)
      orgAdminSection =
        <div>
          <SubSection>
            <h2><FormattedMessage
              id='memberSection.JoinersTitle'
              defaultMessage='Organisation Joiners'
              description='label for joiner table on org detail page'
            /></h2>

            <MemberTable
              members={joiners}
              onMembershipChange={this.handleMembershipChange.bind(this)}
            />
          </SubSection>
          <SubSection>
            <h2><FormattedMessage
              id='memberSection.MembersTitle'
              defaultMessage='Organisation Members'
              description='label for member table on org detail page'
            /></h2>

            <MemberTable
              members={members}
              onMembershipChange={this.handleMembershipChange.bind(this)}
            />
          </SubSection>

          <SubSection>
            <h2><FormattedMessage
              id='memberSection.followersTitle'
              defaultMessage='Organisation Followers'
              description='label for follower table on org detail page'
            /></h2>

            <MemberTable
              members={followers}
              onMembershipChange={this.handleMembershipChange.bind(this)}
            />
          </SubSection>
        </div>
    }

    let joinerInfoSection = ''
    if (joinerOrValidator(myMembership)) {
      joinerInfoSection =
        <section>
          <h2><FormattedMessage
            id='memberSection.joinerInfoSection'
            defaultMessage='Information for new members'
            description='label for follower table on org detail page'
          /></h2>
          <p>
            {/* // TODO: [VP-442] org info for joiners in data record and in MemberSection */}
            Placeholder - information for people joining this organisation.
            should come from the organisation record.
          </p>
        </section>
    }

    // full Members see instructions
    let memberInfoSection = ''
    if (memberOrAdmin(myMembership)) {
      memberInfoSection =
        <section>
          <h2><FormattedMessage
            id='memberSection.memberInfoTitle'
            defaultMessage='Information for members'
            description='label for org info for members detail page'
          /></h2>
          <p>
            {/* // TODO: [VP-443] org info for members in data record and in MemberSection */}
            Placeholder - information for people belonging to this organisation.
            should come from the organisation record.
          </p>
        </section>
    }

    // full Members see instructions
    let followerInfoSection = ''
    if (follower(myMembership)) {
      followerInfoSection =
        <section>
          <h2><FormattedMessage
            id='memberSection.followerInfoTitle'
            defaultMessage='Information for followers'
            description='label for org info for followers detail page'
          /></h2>
          <p>
            {/* // TODO: [VP-443] org info for members in data record and in MemberSection */}
            Placeholder - information for people belonging to this organisation.
            should come from the organisation record.
          </p>
        </section>
    }

    let nonMemberInfoSection = ''
    if (nonMember(myMembership)) {
      nonMemberInfoSection =
        <section>
          <h2><FormattedMessage
            id='memberSection.notMember'
            defaultMessage='About Joining'
            description='message to non members on the org members tab'
          /></h2>

          <p>
            {/* // TODO: [VP-444] org info for non members in data record and in MemberSection */}
            Placeholder - information for people not members of this organisation.
            should come from the organisation record.
          </p>
        </section>
    }
    return (
      <div>
        {orgAdminSection}
        {followerInfoSection}
        {memberInfoSection}
        {joinerInfoSection}
        {nonMemberInfoSection}
      </div>
    )
  }
}

MemberSection.propTypes = {
  me: PropTypes.object,
  members: PropTypes.object
}

// Warning me will be {} if not signed in and role will be undefined.
const mapStateToProps = store => ({
  me: store.session.me
})

const MemberSectionWithMe = connect(
  mapStateToProps
)(MemberSection)

export default withMembers(MemberSectionWithMe)
