import { Component } from 'react'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { Button, Divider, Popconfirm, message } from 'antd'
import reduxApi, { withOps } from '../../lib/redux/reduxApi.js'
import publicPage, { FullPage } from '../../hocs/publicPage'
import Router from 'next/router'
import PersonDetail from '../../components/Person/PersonDetail'
import PropTypes from 'prop-types'

export class PersonDetailPage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get one Person
    // console.log('PersonDetailPage, GetProps', query)
    try {
      const people = await store.dispatch(reduxApi.actions.people.get(query))
      // console.log('got person for id', query, people)
      return { people, query }
    } catch (err) {
      console.log('error in getting people', err)
    }
  }

  async handleDelete (person) {
    if (!person) return
    // Actual data request
    await this.props.dispatch(reduxApi.actions.people.delete({ id: person._id }))
    // TODO error handling - how can this fail?
    message.success('Deleted. ')
    Router.replace(`/people`)
  }

  cancel = () => { message.error('Delete Cancelled') }

  render () {
    let content
    if (this.props.people && this.props.people.length === 1) {
      const person = this.props.people[0]
      content =
        (<div>
          <PersonDetail person={person} />
          <Divider />
          <a href={`mailto:${person.email}`}>
            <Button type='primary' shape='round' >
              <FormattedMessage id='contactPerson' defaultMessage='Contact person' description='Button href show interest in an person on PersonDetails page' />
            </Button>
          </a>
          &nbsp;
          <Link href={`/people/${person._id}/edit`} >
            <Button type='secondary' shape='round' >
              <FormattedMessage id='editPerson' defaultMessage='Edit' description='Button to edit an person on PersonDetails page' />
            </Button>
          </Link>`
          &nbsp;
          <Popconfirm title='Confirm removal of this person.' onConfirm={this.handleDeletePerson} onCancel={this.cancel} okText='Yes' cancelText='No'>
            <Button type='danger' shape='round' >
              <FormattedMessage id='deletePerson' defaultMessage='Remove Request' description='Button to remove an person on PersonDetails page' />
            </Button>
          </Popconfirm>
          &nbsp;
          <Button shape='round' onClick={this.handleVerifyEmail} >
            <FormattedMessage id='verifyEmail' defaultMessage='Verify email' description='Button to send an email verification to the person on PersonDetails page' />
          </Button>
          <br /><small>visible buttons here depend on user role</small>
        </div>)
    } else {
      content =
        (<div>
          <h2>Sorry this Person is no longer available</h2>
          <Link href={'/people'} ><a>Search for some more</a></Link>
          <p>or </p>
          <Link href={'/people/new'} ><a>create a new person</a></Link>
          {/* <Link href={'/ops/0/edit'} >create a new person</Link> */}
          {/* <PersonDetailForm /> */}
        </div>)
    }
    return (<FullPage>{content}</FullPage>)
  }
}

PersonDetailPage.propTypes = {
  person: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    moniker: PropTypes.string,
    about: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    gender: PropTypes.string,
    avatar: PropTypes.any,
    role: PropTypes.arrayOf(PropTypes.oneOf(['admin', 'op-provider', 'volunteer', 'content-provider', 'tester'])),
    status: PropTypes.oneOf(['active', 'inactive', 'hold'])
  }),
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
}

export default publicPage(withOps(PersonDetailPage))
