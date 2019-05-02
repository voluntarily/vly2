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

class OpListSection extends Component {
  state = {}
  async componentDidMount () {
    // Get all Ops

    console.log('getting ops for section')
    try {
      const ops = await this.props.dispatch(reduxApi.actions.opportunities.get())
      console.log('got ops', ops)
      this.setState({ ops })
    } catch (err) {
      console.log('error in getting ops', err)
    }
  }
  render () {
    if (!this.state.ops) {
      return (<section>
        <h3>search filter here</h3>
        <Loading><p>Loading opportunities...</p></Loading>

      </section>)
    } else {
      return (<section>
        <h3>search filter here</h3>
        <OpList ops={this.state.ops} />
      </section>)
    }
  }
}

OpListSection.propTypes = {
  ops: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    description: PropTypes.string,
    duration: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string.isRequired
  })), // optional as we can show an empty list and data may arrive async
  dispatch: PropTypes.func.isRequired
}

export default withOps(OpListSection)
