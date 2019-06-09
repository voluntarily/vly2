/*
  Page to create or update a person
  if cuid = 0 then create a new person
  else get the person by cuid and edit their profile
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { message } from 'antd'
import { FormattedMessage } from 'react-intl'

import reduxApi, { withPeople } from '../../lib/redux/reduxApi.js'
import PersonDetailForm from '../../components/Person/PersonDetailForm'
import { FullPage } from '../../hocs/publicPage'
import securePage from '../../hocs/securePage'
import Router from 'next/router'

export class PersonUpdatePage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get one Person
    // console.log('PersonUpdatePage, Get props', query)
    if (query && query.id) {
      const people = await store.dispatch(reduxApi.actions.people.get(query))
      // console.log('got person for id', query, people)
      return { people, query }
    }
  }

  handleCancel = () => {
    Router.back()
  }

  async handleAdd (person) {
    if (!person) return
    // Actual data request
    let res = {}
    if (person._id) {
      res = await this.props.dispatch(reduxApi.actions.people.put({ id: person._id }, { body: JSON.stringify(person) }))
    } else {
      res = await this.props.dispatch(reduxApi.actions.people.post({}, { body: JSON.stringify(person) }))
    }
    person = res[0]
    message.success('Saved.')
    // go  to details page
    if (person && person._id) Router.push(`/people/${person._id}`)
  }

  render () {
    const person = (this.props.query && this.props.query.id
      ? this.props.people.data[0]
      : {
        // for new people load the default template doc.
        name: '',
        nickname: '',
        about: '',
        email: '',
        phone: '',
        gender: '',
        avatar: '',
        role: ['volunteer'],
        status: 'inactive'
      })
    return (
      <FullPage>
        <h1>
          <FormattedMessage
            defaultMessage='Profile for '
            id='person.pageheading' />
          {person.nickname}
        </h1>
        <small><FormattedMessage
          defaultMessage='Tell us something about yourself.'
          id='PersonEditPrompt' />
        </small>
        <PersonDetailForm person={person} onSubmit={this.handleAdd.bind(this, person)} onCancel={this.handleCancel} />
      </FullPage>
    )
  }
}

PersonUpdatePage.propTypes = {
  person: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    nickname: PropTypes.string,
    about: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    gender: PropTypes.string,
    avatar: PropTypes.any,
    role: PropTypes.arrayOf(PropTypes.oneOf(['admin', 'opportunityProvider', 'volunteer', 'activityProvider', 'tester'])),
    status: PropTypes.oneOf(['active', 'inactive', 'hold'])
  }),
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
}
export default securePage(withPeople(PersonUpdatePage))
