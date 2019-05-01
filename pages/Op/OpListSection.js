/*
  Smart component. Given a filter gets a list of opportunities
  and displays them in a grid. Clicking on a panel links to a
  details page.
*/
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import OpList from '../../components/Op/OpList'
import reduxApi, { withOps } from '../../lib/redux/reduxApi.js.js'

class OpListSection extends Component {
  static async getInitialProps ({ store, query }) {
    // Get all Ops
    console.log('getting ops for section')
    try {
      const ops = await store.dispatch(reduxApi.actions.opportunities.get())
      console.log('got ops', ops)
      return { ops, query }
    } catch (err) {
      console.log('error in getting ops', err)
    }
  }
  render () {
    return (
      <section>
        <h2>Heading showing filter here</h2>
        <OpList ops={this.props.ops} />
      </section>
    )
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
  })).isRequired,
  dispatch: PropTypes.func.isRequired
}

export default withOps(OpListSection)
