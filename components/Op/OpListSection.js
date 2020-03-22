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

class OpListSection extends Component {
  loadData (search, location, query) {
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
      return this.props.dispatch(reduxApi.actions.opportunities.get(filters))
    } catch (err) {
      console.error('error in getting ops', err)
    }
  }

  applyDateFilter = (filter) => {
    if (!filter) {
      return this.props.opportunities.data
    }
    if (filter.date.length === 0) return this.props.opportunities.data
    const momentLists = filter.date.map(element => moment(element))
    if (this.props.opportunities.sync) {
      const filteredData = this.props.opportunities.data.filter(element => this.isDateFilterBetween(momentLists, element.date))
      return filteredData
    }
  }

  /**
   * This method use in organization detail page
   * to filter opportunities offered by specific organization
   */
  appltOrganizationFilter = (opData, org) => {
    if (!org) {
      return opData
    } else {
      if (this.props.opportunities.sync) {
        const filteredData = opData.filter(m => (m.offerOrg) && (m.offerOrg._id === org))
        return filteredData
      }
    }
  }

  sortOrder = (orderValue) => {
    const dataOp = this.props.opportunities.data
    if (orderValue === 'name') {
      return (dataOp.sort((a, b) => a.name.localeCompare(b.name)))
    } else if (orderValue === 'date') {
      dataOp.sort((a, b) => {
        const dateA = a.date && a.date[0]
        const dateB = b.date && b.date[1]
        if (!dateA && dateB) {
          return 1
        } else if (dateA && !dateB) {
          return -1
        } else if (dateA === dateB) {
          return 0
        } else {
          return (dateA > dateB) ? 1 : (dateB > dateA ? -1 : 0)
        }
      })
      // return (dataOp.sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate()))
    } else if (orderValue === 'commitment') {
      dataOp.sort((a, b) => {
        if (a.duration && a.duration !== '') {
          return (a.duration.localeCompare(b.duration))
        } else {
          return ''
        }
      })
    }
    // TODO: [VP-698] Location based sorting for the opportunities
  }

  isDateFilterBetween = (filterdate, opDateArray) => {
    const { hasValue } = this
    if (!hasValue(filterdate)) return true // The reason is that if the date filter value is empty all of the ops found is correct for display
    const startDateOpportunities = moment(opDateArray[0])
    switch (this.props.dateFilterType) {
      case DatePickerType.IndividualDate:
        return filterdate[0].isSame(startDateOpportunities, 'day') // This only compare the start date to the filter. Not included things like end date of the opportunity
      case DatePickerType.MonthRange:
        return filterdate[0].isSame(startDateOpportunities, 'month')
      case DatePickerType.WeekRange:
        // The reason why checking is that if any of the opportunity that is open end then is a valid search result
        // We only check for opportunity that has a specific date range only
        if (hasValue(opDateArray[1]) && hasValue(opDateArray[0])) {
          const weekOfStartDate = startDateOpportunities.week()
          const weekOfEndDate = moment(opDateArray[1]).week()
          const weekOfDateFilter = filterdate[0].week()
          return (weekOfDateFilter === weekOfStartDate) && (weekOfEndDate === weekOfDateFilter)
        }
        return true
      case DatePickerType.DateRange:

        // React will force an update. Since the user has not chose the end filterdate of the date filter yet which this will throw undefined error
        // The reason for this is because when the user change state from specific date,month or week to date range
        if (filterdate.length !== 2) return true
        if (hasValue(opDateArray[1] && hasValue(opDateArray[0]))) {
          const startDateFilterBetweenOpportunity = filterdate[0].isSame(startDateOpportunities, 'date')
          const endDateFilterBetweenOpportunity = filterdate[1].isBetween(startDateOpportunities, moment(opDateArray[1]), 'date')
          return startDateFilterBetweenOpportunity && endDateFilterBetweenOpportunity
        }
        return true // Valid filter result for any open ended opportunity
      default:
        return startDateOpportunities.isBetween(filterdate[0], filterdate[1])
    }
  }

  hasValue = (value) => { return value != null }

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
    const opDataFilteredByDate = this.applyDateFilter(this.props.filter)
    const opFilteredByOrg = this.appltOrganizationFilter(opDataFilteredByDate, this.props.org)
    const opData = this.props.opType == null || this.props.opType === 'All' ? opFilteredByOrg : opFilteredByOrg.filter(op => op.type === this.props.opType.toLowerCase())
    if (!this.props.opportunities.sync) {
      return (
        <section>
          <Loading label='Opportunities' entity={this.props.opportunities} />
        </section>)
    } else {
      return (
        <section>
          <OpList ops={opData} orderby={this.sortOrder(this.props.orderby)} />
        </section>)
    }
  }
}

OpListSection.propTypes = {
  ops: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequire,
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
  location: PropTypes.string,
  org: PropTypes.string,
  filter: PropTypes.object
}

export const OpListSectionTest = OpListSection
export default withOps(OpListSection)
