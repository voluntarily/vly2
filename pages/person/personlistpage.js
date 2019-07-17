/*
  PersonListPage - a page listing all the people returned from fetchPeople
  results in simple vertical list
  Entry - people menu item.
*/
import React, { Component } from 'react'
import { Button } from 'antd'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { FullPage } from '../../hocs/publicPage'
import securePage from '../../hocs/securePage'
import reduxApi, { withPeople } from '../../lib/redux/reduxApi.js'
import PersonList from '../../components/Person/PersonList'

class PersonListPage extends Component {
  static async getInitialProps ({ store }) {
    // Get all People
    try {
      console.log('Redux store has info about session value when get init props in person list page', store.getState().session.isAuthenticated)
      // console.log('The actions for people api is ', reduxApi.actions.people)
      await store.dispatch(reduxApi.actions.people.get()) // Could be the cause of loosing session

    } catch (err) {
      console.log('error in getting people', err)
    }
  }

  render () {
    const people = this.props.people.data
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
export const PersonListPageTest = PersonListPage
export default securePage(withPeople(PersonListPage))
