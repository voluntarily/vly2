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

const Loading = styled(LoadingComponent)`
  margin: 0 auto;
  display: block;
`

class InterestSection extends Component {
  async componentDidMount () {
    // Get all interests
    const opid = this.props.opid
    try {
      await this.props.dispatch(reduxApi.actions.interests.get({ id: '', op: opid }))
    } catch (err) {
      // console.log('error in getting interests', err)
    }
  }

  async handleInvite (interest) {
    interest.status = 'invited'
    await this.props.dispatch(reduxApi.actions.interests.put({ id: interest._id }, { body: JSON.stringify(interest) }))
  }

  async handleWithdrawInvite (interest) {
    interest.status = 'interested'
    await this.props.dispatch(reduxApi.actions.interests.put({ id: interest._id }, { body: JSON.stringify(interest) }))
  }

  async handleDecline (interest) {
    interest.status = 'declined'
    await this.props.dispatch(reduxApi.actions.interests.put({ id: interest._id }, { body: JSON.stringify(interest) }))
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
