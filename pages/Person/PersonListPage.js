/*
  PersonListPage - a page listing all the people returned from fetchPeople
  results in simple vertical list
  Entry - people menu item.
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import publicPage, { FullPage } from '../../hocs/publicPage'
// import securePage from '../../hocs/securePage'
import reduxApi, { withPeople } from '../../lib/redux/reduxApi.js'
import PersonList from '../../components/Person/PersonList'

class PersonListPage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get all People
    console.log('getting people')
    try {
      const people = await store.dispatch(reduxApi.actions.people.get())
      console.log('got people', people)
      return { people, query }
    } catch (err) {
      console.log('error in getting people', err)
    }
  }

  render () {
    const { people } = this.props
    return (
      <FullPage>
        <h1><FormattedMessage id='personListTitle' defaultMessage='People' description='H1 on Person list page' /></h1>
        <Button shape='round'><Link href='/person/new'><a>
          <FormattedMessage id='people.new' defaultMessage='New Person' description='Button to create a new person' />
        </a></Link></Button>
        <br /><br />
        <PersonList people={people} />
      </FullPage>
    )
  }
}

PersonListPage.propTypes = {
  people: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired
  })).isRequired

}

PersonListPage.contextTypes = {
  router: PropTypes.object
}

export default publicPage(withPeople(PersonListPage))
