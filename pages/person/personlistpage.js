/*
  PersonListPage - a page listing all the people returned from fetchPeople
  results in simple vertical list
  Entry - people menu item.
*/
import { Button } from 'antd'
import Link from 'next/link'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import PersonList from '../../components/Person/PersonList'
import { FullPage } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import reduxApi, { withPeople } from '../../lib/redux/reduxApi.js'

class PersonListPage extends Component {
  static async getInitialProps ({ store }) {
    // Get all People
    try {
      await store.dispatch(reduxApi.actions.people.get())
    } catch (err) {
      console.error('error in getting people', err)
    }
  }

  render () {
    const people = this.props.people.data
    return (
      <FullPage>
        <Helmet>
          <title>Voluntarily - People List</title>
        </Helmet>
        <h1><FormattedMessage id='personListTitle' defaultMessage='People' description='H1 on Person list page' /></h1>
        <Button shape='round'>
          <Link href='/person/new'>
            <a><FormattedMessage id='people.new' defaultMessage='New Person' description='Button to create a new person' /></a>
          </Link>
        </Button>
        <br /><br />
        <PersonList people={people} />
      </FullPage>
    )
  }
}
export const PersonListPageTest = PersonListPage
export default securePage(withPeople(PersonListPage))
