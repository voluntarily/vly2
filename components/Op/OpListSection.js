/*
  Smart component. Given a filter gets a list of opportunities
  and displays them in a grid. Clicking on a panel links to a
  details page.
*/
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import OpList from '../../components/Op/OpList'
import reduxApi, { withOps } from '../../lib/redux/reduxApi'
import Loading from '../../components/Loading'

// TODO: [VP-131] use redux instead of local state.
class OpListSection extends Component {
  async componentDidMount () {
    // Get all Ops
    try {
      // TODO: [VP-128] document how to set the parameters correctly
      // TODO: [VP-129] filter should be passed in here and translated into the query
      // const _example_query = { q: '{"status": "active" }' }
      await this.props.dispatch(reduxApi.actions.opportunities.get())
    } catch (err) {
      // console.log('error in getting ops', err)
    }
  }
  render () {
    if (this.props.opportunities.loading) {
      return (<section>
        {/* <h3>search filter here</h3> */}
        <Loading><p>Loading opportunities...</p></Loading>

      </section>)
    } else {
      return (<section>
 // TODO: [VP-130] take out the search filter here line in OpListSection and pass in a property instead
        <h3>search filter here</h3>
        <OpList ops={this.props.opportunities.data} />
      </section>)
    }
  }
}

OpListSection.propTypes = {
  ops: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequire,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    description: PropTypes.string,
    duration: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string.isRequired
  })), // optional as we can show an empty list and data may arrive async
  dispatch: PropTypes.func.isRequired
}

export const OpListSectionTest = OpListSection
export default withOps(OpListSection)
