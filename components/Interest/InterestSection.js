/*
  Smart component. for the given opportunity gets a list of Interests
  and displays them in a table. actions change the state of the interested volunteers
*/
// import PropTypes from 'prop-types'
import React, { Component } from 'react'
import InterestTable from './InterestTable'
import { FormattedMessage } from 'react-intl'

import reduxApi, { withInterests } from '../../lib/redux/reduxApi'
import Loading from '../Loading'

class InterestSection extends Component {
  async componentDidMount () {
    // Get all interests
    console.log('interest section did mount')
    const opid = this.props.opid
    try {
      await this.props.dispatch(reduxApi.actions.interests.get({ id: '', opid }))
      // console.log('got interests', interests, 'for', op)
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
    if (!(this.props.interests && this.props.interests.data)) {
      return (
        <section>
          <Loading>
            <p>Loading interested volunteers...</p>
          </Loading>
        </section>
      )
    } else {
      return (
        <section>
          <h2>
            <FormattedMessage
              id='interestSection.title'
              defaultMessage='Interested Volunteers'
              description='label for interest table on op detail page'
            /></h2>

          <InterestTable
            interests={this.props.interests.data}
            onInvite={this.handleInvite.bind(this)}
            onWithdrawInvite={this.handleWithdrawInvite.bind(this)}
            onDecline={this.handleDecline.bind(this)} />
        </section>
      )
    }
  }
}

export const InterestSectionTest = InterestSection
export default withInterests(InterestSection)
