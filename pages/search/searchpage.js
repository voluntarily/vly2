import publicPage, { FullPage } from '../../hocs/publicPage'
import TitleSection from '../../components/LandingPageComponents/TitleSectionSub'
import BigSearch from '../../components/Search/BigSearch'
import { Spacer } from '../../components/VTheme/VTheme'
import OpListSection from '../../components/Op/OpListSection'
import reduxApi, { withLocations } from '../../lib/redux/reduxApi'
import { Component } from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import { FormattedMessage } from 'react-intl'

// const TitleString = {NumberResults} + "results for " + {SearchQuery}

export class SearchPage extends Component {
  state = {
    search: null,
    filterValue: null
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

  static async getInitialProps ({ store, query: { search } }) {
    await store.dispatch(reduxApi.actions.locations.get())
    return {
      search
    }
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

  locFilterChanged = location => {
    this.setState({ filterValue: location })
  }

  render () {
    const { search, filterValue } = this.state

    const existingLocations = this.props.locations.data

    return (
      <FullPage>
        <TitleSection title={<FormattedMessage defaultMessage={`Search results for "{search}"`} values={{ search }} id='search.title' />} />
        <BigSearch
          search={search}
          onSearch={this.handleSearch}
          locations={existingLocations}
          onFilterChange={this.locFilterChanged}
        />
        <Spacer />
        <OpListSection search={search} location={filterValue} />
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

export default publicPage(withLocations(SearchPage))
