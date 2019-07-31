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

class MemberSection extends Component {
  async componentDidMount () {
    // Get all members
    // console.log('member section did mount')
    const orgid = this.props.orgid
    try {
      await this.props.dispatch(reduxApi.actions.members.get({ orgid: orgid }))
      // console.log('got members', members, 'for', op)
    } catch (err) {
      // console.log('error in getting members', err)
    }
  }

  async handleMembershipChange (member, action) {
    switch (action) {
      case 'invite':
      case 'add':
        member.status = MemberStatus.MEMBER
        break
      case 'remove':
        member.status = MemberStatus.EXMEMBER
        break
      case 'reject':
        member.status = MemberStatus.FOLLOWER
        break
    }
    await this.props.dispatch(reduxApi.actions.members.put({ id: member._id }, { body: JSON.stringify(member) }))
  }

  render () {
    if (!(this.props.members && this.props.members.data)) {
      return (
        <section>
          <Loading />
        </section>
      )
    } else {
      return (
        <section>
          <h2>
            <FormattedMessage
              id='memberSection.title'
              defaultMessage='Organisation Members and Followers'
              description='label for member table on org detail page'
            /></h2>

          <MemberTable
            members={this.props.members.data}
            onMembershipChange={this.handleMembershipChange.bind(this)}
          />
        </section>
      )
    }
  }
}

export const MemberSectionTest = MemberSection
export default withMembers(MemberSection)
