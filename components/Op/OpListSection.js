/*
  Smart component. Given a filter gets a list of opportunities
  and displays them in a grid. Clicking on a panel links to a
  details page.

  WARNING: this component loads its own data and therefore updates the store.opportunities array.
  if you have more than one on a page they will cancel each other out. In this case the parent
  should obtain all the necessary data and use OpList to display the array.
*/
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import OpList from '../../components/Op/OpList'
import reduxApi, { withOps } from '../../lib/redux/reduxApi'
import Loading from '../../components/Loading'

// TODO: [VP-131] use redux instead of local state.
class OpListSection extends Component {
  async loadData (search, location, query) {
    // Get all Ops
    try {
      const filters = {}

      if (search) {
        filters.search = search
      }
      if (location) {
        filters.location = location
      }
      if (query) {
        filters.q = query
      }

      return await this.props.dispatch(reduxApi.actions.opportunities.get(filters))
    } catch (err) {
      // console.log('error in getting ops', err)
    }
  }

  async componentDidUpdate (prevProps) {
    if (prevProps.search !== this.props.search ||
      prevProps.location !== this.props.location ||
      prevProps.query !== this.props.query) {
      await this.loadData(this.props.search, this.props.location, this.props.query)
    }
  }

  async componentDidMount () {
    await this.loadData(this.props.search, this.props.location, this.props.query)
  }

  render () {
    if (this.props.opportunities.loading) {
      return (<section>
        <Loading><p>Loading opportunities...</p></Loading>

      </section>)
    } else {
      return (<section>
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
  dispatch: PropTypes.func.isRequired,
  query: PropTypes.string,
  search: PropTypes.string,
  location: PropTypes.string
}

export const OpListSectionTest = OpListSection
export default withOps(OpListSection)
