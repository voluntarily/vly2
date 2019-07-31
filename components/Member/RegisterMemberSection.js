/*
  Smart component. For the given org id and person id,
  on state:
    none - follow,  create new FOLLOWER record
    follow - unfollow

  if the person is a member display leave
  if the
  If no member exists, it will allow one to be created. If one does exist, it will allow it to be updated or cancelled.
*/
import React, { Component } from 'react'
import RegisterMemberItem from './RegisterMemberItem'
import { message } from 'antd'
import MemberConfirmationCard from './MemberConfirmationCard'

import reduxApi, { withMembers } from '../../lib/redux/reduxApi'
import Loading from '../Loading'
import { MemberStatus } from '../../server/api/member/member.constants'

// Helper function to generate a blank member.
const getNewMember = (me, org) => {
  return {
    person: me,
    organisation: org
  }
}

class RegisterMemberSection extends Component {
  // When component mounts, make initial API call.
  // TODO do we need to change this to getInitialProrgs?
  async componentDidMount () {
    const org = this.props.org
    const me = this.props.meID
    try {
      // get my relationship with this organisation
      await this.props.dispatch(reduxApi.actions.members.get({ id: '', org, me }))
    } catch (err) {
      console.log('error in getting members', err)
    }
  }

  // When the button is clicked to advance the member status, make an appropriate api call.
  async handleChangeStatus (member, action) {
    // const prevStatus = member.status
    switch (action) {
      case 'follow':
        member.status = MemberStatus.FOLLOWER
        break
      case 'join':
        member.status = MemberStatus.JOINER
        break
      case 'unfollow':
        member.status = MemberStatus.NONE
        break
      case 'leave':
        member.status = MemberStatus.EXMEMBER
        break
    }

    if (member._id) {
      // console.log('Modifying member')
      await this.props.dispatch(reduxApi.actions.members.put({ id: member._id }, { body: JSON.stringify(member) }))
      message.success('Member updated')
    } else {
      await this.props.dispatch(reduxApi.actions.members.post({}, { body: JSON.stringify(member) }))
      message.success('Member added')
    }
  }

  // Render the component depending on whether we've completed the initial api call, and what information is contained in the store.
  render () {
    // If we haven't finished making the API request to the server yet...
    if (this.props.members.loading) {
      return (
        <section>
          <Loading />
        </section>)
    } else { // If we have access to the members section of the Redux store...
      // Get the member out of the store, if any.
      let member = null

      if (this.props.members.sync && this.props.members.data.length > 0) {
        member = this.props.members.data[0]
      } else { // If not, use a blank member.
        member = getNewMember(this.props.meID, this.props.org)
      }
      // console.log(member)
      return (
        <section>
          <RegisterMemberItem
            member={member}
            onChangeStatus={this.handleChangeStatus.bind(this)}
          />
          {
            (member.status === MemberStatus.MEMBER) &&
              (
                <MemberConfirmationCard organizer={this.props.org.requestor} />
              )
          }
        </section>
      )
    }
  }
}

export default withMembers(RegisterMemberSection)
