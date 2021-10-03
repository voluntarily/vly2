import { Button, Dropdown, Menu, Modal } from 'antd'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { Component } from 'react'
import Head from 'next/head'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import SectionTitle from '../../components/LandingPageComponents/SectionSubtitle'
import DatePickerType from '../../components/Op/DatePickerType.constant'
import OpListSection from '../../components/Op/OpListSection'
import FilterContainer from '../../components/Search/FilterContainer'
import HeaderSearch from '../../components/Search/HeaderSearch'
import LocationFilter from '../../components/Search/LocationFilter'
import TypeFilter from '../../components/Search/TypeFilter'
import { FullPage, Spacer } from '../../components/VTheme/VTheme'

import reduxApi, { withLocations } from '../../lib/redux/reduxApi'
import DatePickerComponent, { formatDateBaseOn } from './DatePickerComponent'
import OpOrderby from '../../components/Op/OpOrderby'
// const TitleString = {NumberResults} + "results for " + {SearchQuery}
const { Item } = Menu

const SearchPageContainer = styled.div`
  margin-top: 14rem;
  @media screen and (min-width: 768px) and (max-width: 1280px) {
    margin-top: 12rem;
  }

  @media screen and (max-width: 767px) {
    margin-top: 12rem;
  }
`

const LOCATION_FILTER_NAME = 'location'
const DATE_FILTER_NAME = 'date'
const TYPE_FILTER_NAME = 'type'
const opTypeValue = ['All', 'Offer', 'Ask']

function filterVisibilityName (filterName) {
  return `${filterName}FilterVisible`
}

function filterValueName (filterName) {
  return `${filterName}FilterValue`
}

export class SearchPage extends Component {
  state = {
    search: null,
    datePickerType: DatePickerType.IndividualDate,
    showDatePickerModal: false,
    filter: {
      date: []
    },
    locationFilterVisible: false,
    typeFilterVisible: false,
    opOrderBy: 'date'
  }

  constructor (props) {
    super(props)
    this.state.search = props.search
    this.handleSort = this.handleSort.bind(this)
  }

  static getDerivedStateFromProps ({ search }) {
    return {
      search
    }
  }

  static async getInitialProps ({ store, query: { search } }) {
    await store.dispatch(reduxApi.actions.locations.get({}))
    return {
      search
    }
  }

  handleFilterOpened = (filterName) => {
    this.setState({ [filterVisibilityName(filterName)]: true })
  }

  handleClose = (filterName) => {
    this.setState({ [filterVisibilityName(filterName)]: false })
  }

  handleFilterApplied = (filterName, value) => {
    this.setState({ [filterValueName(filterName)]: value })
  }

  handleFilterRemoved = (filterName) => {
    this.setState({ [filterValueName(filterName)]: null })
  }

  handleOpenDatePickerModal = () => {
    this.setState({ showDatePickerModal: !this.state.showDatePickerModal })
  }

  handleSearch = search => {
    if (!search) {
      return false
    }

    Router.push({
      pathname: '/search',
      query: {
        search
      }
    })

    this.setState({ search })
  }

  handleDateChange = change => {
    // When user clear date picker value it the date value in the state will becom null which is not an array anymore.
    // By checking if the data changed is null then we instead make it an empty array
    if (change) {
      this.setState({
        filter: {
          ...this.state.filter,
          date: Array.isArray(change) ? change : [change]
        }
      })
    } else this.setState({ filter: { ...this.state.filter, date: [] } })
  }

  changePickerType = type => {
    this.setState({ datePickerType: type })
  }

  formateDateValue = () => {
    if (this.state.filter.date.length === 0) return 'Date'
    return formatDateBaseOn(this.state.datePickerType, this.state.filter.date)
  }

  handleSort = (value) => {
    this.setState({
      opOrderBy: value
    })
  }

  render () {
    const { search } = this.state
    const dateLabel = this.formateDateValue()
    const existingLocations = this.props.locations.data

    const DatePickerOption = (
      <Menu>
        <Item
          onClick={() => this.changePickerType(DatePickerType.IndividualDate)}
        >
          <p>Date</p>
        </Item>
        <Item onClick={() => this.changePickerType(DatePickerType.WeekRange)}>
          <p>Week Picker</p>
        </Item>
        <Item onClick={() => this.changePickerType(DatePickerType.MonthRange)}>
          <p> Month Picker </p>
        </Item>
        <Item onClick={() => this.changePickerType(DatePickerType.DateRange)}>
          <p> Date Range </p>
        </Item>
      </Menu>
    )

    return (
      <div>
        <HeaderSearch
          search={search}
          onSearch={this.handleSearch}
          dateLabel={dateLabel}
          locations={existingLocations}
          onFilterOpened={this.handleFilterOpened}
          filterNames={[DATE_FILTER_NAME, LOCATION_FILTER_NAME, TYPE_FILTER_NAME]}
        />
        <FullPage>
          <Head>
            <title>Voluntarily - Search Results</title>
          </Head>
          <SearchPageContainer>
            <SectionTitle
              title={
                <FormattedMessage
                  defaultMessage={'Search results for "{search}"'}
                  values={{ search }}
                  id='search.title'
                />
              }
            />
            <OpOrderby onChange={this.handleSort} />
            <FilterContainer
              onClose={this.handleClose}
              filterName={LOCATION_FILTER_NAME}
              onFilterApplied={this.handleFilterApplied}
              onFilterRemoved={this.handleFilterRemoved}
              isShowing={this.state[filterVisibilityName(LOCATION_FILTER_NAME)]}
            >
              <LocationFilter locations={existingLocations} />
            </FilterContainer>
            <FilterContainer
              onClose={this.handleClose}
              filterName={TYPE_FILTER_NAME}
              onFilterApplied={this.handleFilterApplied}
              onFilterRemoved={this.handleFilterRemoved}
              isShowing={this.state[filterVisibilityName(TYPE_FILTER_NAME)]}
            >
              <TypeFilter opTypes={opTypeValue} />
            </FilterContainer>
            {/* TODO: VP-445 modify date picker to use filter container (like with location). This will
             help reduce the complexity of this page component */}
            <Modal
              title='Pick date'
              visible={this.state[filterVisibilityName(DATE_FILTER_NAME)]}
              onCancel={() =>
                this.setState({
                  [filterVisibilityName(DATE_FILTER_NAME)]: false
                })}
              onOk={() =>
                this.setState({
                  [filterVisibilityName(DATE_FILTER_NAME)]: true
                })}
            >
              <Dropdown overlay={DatePickerOption} placement='bottomCenter'>
                <Button>
                  {this.state.datePickerType === ''
                    ? 'Date'
                    : this.state.datePickerType}
                </Button>
              </Dropdown>
              <DatePickerComponent
                datePickerType={this.state.datePickerType}
                onDateChange={this.handleDateChange}
                dateValue={this.state.filter.date}
              />
            </Modal>
            <Spacer />
            <OpListSection
              search={search}
              filter={this.state.filter}
              dateFilterType={this.state.datePickerType}
              location={this.state[filterValueName(LOCATION_FILTER_NAME)]}
              opType={this.state[filterValueName(TYPE_FILTER_NAME)]}
              orderby={this.state.opOrderBy}
            />
          </SearchPageContainer>
        </FullPage>
      </div>
    )
  }
}

SearchPage.propTypes = {
  search: PropTypes.string,
  ops: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      subtitle: PropTypes.string,
      imgUrl: PropTypes.any,
      description: PropTypes.string,
      duration: PropTypes.string,
      status: PropTypes.string,
      _id: PropTypes.string
    })
  )
}

export default withLocations(SearchPage)
