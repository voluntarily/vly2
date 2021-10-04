/*
  Smart component. Given a filter gets a list of opportunities
  and displays them in a grid. Clicking on a panel links to a
  details page.

  WARNING: this component loads its own data and therefore updates the store.opportunities array.
  if you have more than one on a page they will cancel each other out. In this case the parent
  should obtain all the necessary data and use OpList to display the array.
*/
import React, { useEffect, useState } from 'react'
import OpList from '../../components/Op/OpList'
import reduxApi, { withOps } from '../../lib/redux/reduxApi'
import moment from 'moment'
import Loading from '../../components/Loading'
import DatePickerType from './DatePickerType.constant'

const OpListSection = ({
  search,
  filter,
  dateFilterType,
  location,
  org,
  opType,
  orderby,
  query,
  opportunities,
  // tags,locations, activities,
  dispatch
}) => {
  // update search as filters change
  useEffect(async () => {
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
      return dispatch(reduxApi.actions.opportunities.get(filters))
    } catch (err) {
      console.error('error in getting ops', err)
    }
  }, [search, location, query])

  const hasValue = (value) => { return value != null }

  const applyDateFilter = (filter) => {
    if (!filter) {
      return opportunities.data
    }
    if (filter.date.length === 0) return opportunities.data
    const momentLists = filter.date.map(element => moment(element))
    if (opportunities.sync) {
      const filteredData = opportunities.data.filter(element => isDateFilterBetween(momentLists, element.date))
      return filteredData
    }
  }

  /**
   * This method use in organization detail page
   * to filter opportunities offered by specific organization
   */
  const applyOrganizationFilter = (opData, org) => {
    if (!org) {
      return opData
    } else {
      if (opportunities.sync) {
        const filteredData = opData.filter(m => (m.offerOrg) && (m.offerOrg._id === org))
        return filteredData
      }
    }
  }

  const sortOrder = (orderValue) => {
    const dataOp = opportunities.data
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

  const isDateFilterBetween = (filterdate, opDateArray) => {
    if (!hasValue(filterdate)) return true // The reason is that if the date filter value is empty all of the ops found is correct for display
    const startDateOpportunities = moment(opDateArray[0])
    switch (dateFilterType) {
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

  const opDataFilteredByDate = applyDateFilter(filter)
  const opFilteredByOrg = applyOrganizationFilter(opDataFilteredByDate, org)
  const opData = opType == null || opType === 'All' ? opFilteredByOrg : opFilteredByOrg.filter(op => op.type === opType.toLowerCase())
  if (!opportunities.sync) {
    return (
      <section>
        <Loading label='Opportunities' entity={opportunities} />
      </section>)
  } else {
    return (
      <section>
        <OpList ops={opData} orderby={sortOrder(orderby)} />
      </section>)
  }
}

export const OpListSectionTest = OpListSection
export default withOps(OpListSection)
