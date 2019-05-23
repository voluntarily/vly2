/*
  Smart component. for the given opportunity gets a list of Interests
  and displays them in a table. actions change the state of the interested volunteers
*/
// import PropTypes from 'prop-types'
import React, { Component } from 'react'
import InterestTable from './InterestTable'

import reduxApi, { withInterests } from '../../lib/redux/reduxApi'
import Loading from '../Loading'

class InterestSection extends Component {
  state = {}
  async componentDidMount() {
    // Get all interests

    const op = this.props.op
    try {
      const interests = await this.props.dispatch(
        reduxApi.actions.interests.get({ id: '', op })
      )
      // console.log('got interests', interests, 'for', op)
    } catch (err) {
      // console.log('error in getting interests', err)
    }
  }
  render() {
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
          <InterestTable interests={this.props.interests.data} />
          {/* <code>{JSON.stringify(this.props.interests.data)}</code>  */}
        </section>
      )
    }
  }
}

export const InterestSectionTest = InterestSection
export default withInterests(InterestSection)
