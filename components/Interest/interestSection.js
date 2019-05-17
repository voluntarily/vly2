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
  async componentDidMount () {
    // Get all interests

    try {
      const interests = await this.props.dispatch(reduxApi.actions.interests.get())
      console.log('got interests', interests)
      this.setState({ interests })
    } catch (err) {
      console.log('error in getting interests', err)
    }
  }
  render () {
    if (!this.state.interests) {
      return (<section>
        <Loading><p>Loading interests...</p></Loading>

      </section>)
    } else {
      return (<section>
        <InterestTable interests={this.state.interests} />
        <code>{JSON.stringify(this.state.interests)}</code> 
      </section>)
    }
  }
}



export const InterestSectionTest = InterestSection
export default withInterests(InterestSection)
