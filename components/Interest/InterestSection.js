/*
  Smart component. for the given opportunity gets a list of Interests
  and displays them in a table. actions change the state of the interested volunteers
*/
// import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'
import InterestTable from './InterestTable'
import reduxApi, { withInterests } from '../../lib/redux/reduxApi'
import LoadingComponent from '../Loading'
import { InterestStatus } from '../../server/api/interest/interest.constants'

const Loading = styled(LoadingComponent)`
  margin: 0 auto;
  display: block;
`

class InterestSection extends Component {
  async componentDidMount () {
    // Get all interests
    const opid = this.props.opid
    await this.props.dispatch(reduxApi.actions.interests.get({ op: opid }))
  }

  async handleInvite (interest) {
    const updatedInterest = {
      status: InterestStatus.INVITED,
      type: 'accept'
    }
    await this.props.dispatch(reduxApi.actions.interests.put({ id: interest._id }, { body: JSON.stringify(updatedInterest) }))
  }

  async handleWithdrawInvite (interest) {
    const updatedInterest = {
      status: InterestStatus.INTERESTED,
      type: 'reject'
    }
    await this.props.dispatch(reduxApi.actions.interests.put({ id: interest._id }, { body: JSON.stringify(updatedInterest) }))
  }

  async handleDecline (interest) {
    const updatedInterest = {
      status: InterestStatus.DECLINED,
      type: 'reject'
    }
    await this.props.dispatch(reduxApi.actions.interests.put({ id: interest._id }, { body: JSON.stringify(updatedInterest) }))
  }

  render () {
    if (!this.props.interests || !this.props.interests.sync) {
      return <Loading />
    } else {
      return (
        <InterestTable
          checkboxEnabled
          interests={this.props.interests.data}
          onInvite={this.handleInvite.bind(this)}
          onWithdrawInvite={this.handleWithdrawInvite.bind(this)}
          onDecline={this.handleDecline.bind(this)}
        />
      )
    }
  }
}

export const InterestSectionTest = InterestSection
export default withInterests(InterestSection)
