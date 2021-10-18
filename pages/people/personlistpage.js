/*
  PersonListPage - a page listing all the people returned from fetchPeople
  results in simple vertical list
  Entry - people menu item.
*/
import React from 'react'
import { Button } from 'antd'
import Link from 'next/link'
import Head from 'next/head'
import { FormattedMessage } from 'react-intl'

import PersonList from '../../components/Person/PersonList'
import { FullPage } from '../../components/VTheme/VTheme'
import reduxApi, { withPeople } from '../../lib/redux/reduxApi.js'
import reduxWrapper from '../../lib/redux/store'

export const PersonListPage = ({
  people
}) => {
  return (
    <FullPage>
      <Head>
        <title>Voluntarily - People List</title>
      </Head>
      <h1><FormattedMessage id='personListTitle' defaultMessage='People' description='H1 on Person list page' /></h1>
      <Button shape='round'>
        <Link href='/people/new'>
          <a><FormattedMessage id='people.new' defaultMessage='New Person' description='Button to create a new person' /></a>
        </Link>
      </Button>
      <br /><br />
      <PersonList people={people.data} />
    </FullPage>
  )
}

export const getServerSideProps = reduxWrapper.getServerSideProps(
  store => async (props) => gssp({ store, query: props.query })
)

// factored out for easier testing.
export const gssp = async ({ store, query }) => {
  const select = { s: 'name', p: 'name imgUrl placeOfWork job' }
  await store.dispatch(reduxApi.actions.people.get(select))
  console.log('PersonListPage GSSP')
}

export default withPeople(PersonListPage)
