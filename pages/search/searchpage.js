import publicPage, { FullPage } from '../../hocs/publicPage'
import TitleSection from '../../components/LandingPageComponents/TitleSectionSub'
import BigSearch from '../../components/VTheme/BigSearch'
import { Spacer } from '../../components/VTheme/VTheme'
import OpListSection from '../../components/Op/OpListSection'
import { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Dropdown, Menu, Button } from 'antd'
import Router from 'next/router'
import { FormattedMessage } from 'react-intl'
import DatePickerComponent from './DatePickerComponent'
import DatePickerType from '../../components/Op/DatePickerType.constant'

// const TitleString = {NumberResults} + "results for " + {SearchQuery}
const { Item } = Menu

export class SearchPage extends Component {
  state = {
    search: null,
    datePickerType: DatePickerType.IndividualDate,
    showDatePickerModal: false,
    filter: {
      date: []
    }
  }

  constructor (props) {
    super(props)
    this.state.search = props.search
  }

  static getDerivedStateFromProps ({ search }) {
    return {
      search
    }
  }

  static async getInitialProps ({ query: { search } }) {
    return {
      search
    }
  }

  handleOpenDatePickperModal = () => {
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
    if (change) this.setState({ filter: { ...this.state.filter, date: change } })
    else this.setState({ filter: { ...this.state.fitler, date: [] } })
  }

  changePickerType = type => {
    this.setState({ datePickerType: type })
  }

  render () {
    const { search } = this.state

    const DatePickerOption = (
      <Menu>
        <Item onClick={() => this.changePickerType(DatePickerType.IndividualDate)}>
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
      <FullPage>
        <TitleSection title={<FormattedMessage defaultMessage={`Search results for "{search}"`} values={{ search }} id='search.title' />} />
        <BigSearch search={search} onSearch={this.handleSearch} onClickDateFilter={this.handleOpenDatePickperModal} />
        <Modal title='Pick date' visible={this.state.showDatePickerModal}
          onCancel={() => this.setState({ showDatePickerModal: !this.state.showDatePickerModal })}
          onOk={() => this.setState({ showDatePickerModal: !this.state.showDatePickerModal })}>
          <Dropdown overlay={DatePickerOption} placement='bottomCenter'>
            <Button>{ this.state.datePickerType === '' ? 'Date' : this.state.datePickerType}</Button>
          </Dropdown>
          <DatePickerComponent datePickerType={this.state.datePickerType} onDateChange={this.handleDateChange} dateValue={this.state.filter.date} />
        </Modal>
        <Spacer />
        <OpListSection search={search} filter={this.state.filter} dateFilterType={this.state.datePickerType} />
      </FullPage>
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
  //  showAddOp: PropTypes.bool.isRequired,
  // dispatch: PropTypes.func.isRequired
}

export default publicPage(SearchPage)
