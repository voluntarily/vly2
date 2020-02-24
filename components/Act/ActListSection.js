/*
  Smart component. Given a filter gets a list of activities
  and displays them in a grid. Clicking on a panel links to a
  details page.
*/
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ActList from '../Act/ActList'
import reduxApi, { withActs } from '../../lib/redux/reduxApi'
import Loading from '../Loading'

// TODO: [VP-131] use redux instead of local state.
class ActListSection extends Component {
  async loadData (search) {
    // Get all Acts
    try {
      // TODO: [VP-128] document how to set the parameters correctly
      // TODO: [VP-129] filter should be passed in here and translated into the query

      const filters = {}

      if (search) {
        filters.search = search
      }

      return await this.props.dispatch(reduxApi.actions.activities.get(filters))
    } catch (err) {
      // console.error('error in getting acts', err)
    }
  }

  async componentDidUpdate (prevProps) {
    if (prevProps.search !== this.props.search) {
      await this.loadData(this.props.search)
    }
  }

  async componentDidMount () {
    await this.loadData(this.props.search)
  }

  render () {
    if (!this.props.activities.sync) {
      return <Loading label='activities' entity={this.props.activities} />
    }

    // TODO: [VP-130] take out the search filter here line in ActListSection and pass in a property instead
    return (
      <section>
        <ActList acts={this.props.activities.data} />
      </section>)
  }
}

ActListSection.propTypes = {
  acts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequire,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    description: PropTypes.string,
    duration: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string.isRequired
  })), // optional as we can show an empty list and data may arrive async
  dispatch: PropTypes.func.isRequired,
  search: PropTypes.string
}

export const ActListSectionTest = ActListSection
export default withActs(ActListSection)
