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
import moment from 'moment'
import Loading from '../../components/Loading'
import DatePickerType from './DatePickerType.constant'

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

  applyDateFilter = (filter) => {
    if (filter.date.length === 0) return this.props.opportunities.data
    const momentObject = moment(filter.date[0])
    if (!this.props.opportunities.isloading) {
      if (filter.date.length === 0) return this.props.opportunities.data
      const filteredData = this.props.opportunities.data.filter(element => this.isDateFilterBetween(momentObject, element.date))
      return filteredData
    }
    return this.props.opportunities.data
  }

  isDateFilterBetween = (date, opDateArray) => {
    if (date == null) return true
    const startDateOpportunities = moment(opDateArray[0])
    switch (this.props.dateFilterType) {
      case DatePickerType.IndividualDate:
        return date.isSame(startDateOpportunities, 'day') // This only compare the start date to the filter. Not included things like end date of the opportunity
      case DatePickerType.MonthRange:
        return moment(date).isSame(opDateArray[0], 'month')
      case DatePickerType.WeekRange:
        // The reason why checking is that if any of the opportunity that is open end then is a valid search result
        // We only check for opportunity that has a specific date range only
        if (this.opportunityHasEndDate(opDateArray[1]) && this.opportunityHasStartDate(opDateArray[0])) {
          const weekOfStartDate = startDateOpportunities.week()
          const weekOfEndDate = moment(opDateArray[1]).week()
          const weekOfDateFilter = date.week()
          return (weekOfDateFilter === weekOfStartDate) && (weekOfEndDate === weekOfDateFilter)
        }
        return true
      case DatePickerType.DateRange:
        return true
      default:
        return true
    }
  }

  opportunityHasEndDate = (endDate) => { return endDate != null }

  opportunityHasStartDate = (startDate) => startDate != null

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
    const opData = this.applyDateFilter(this.props.filter)
    if (this.props.opportunities.loading) {
      return (<section>
        <Loading><p>Loading opportunities...</p></Loading>

      </section>)
    } else {
      return (<section>
        <OpList ops={opData} />
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
