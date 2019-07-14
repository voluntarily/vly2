import { Button, message, Popconfirm } from 'antd'
import Link from 'next/link'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import PersonDetail from '../../components/Person/PersonDetail'
import PersonDetailForm from '../../components/Person/PersonDetailForm'
import { FullPage } from '../../hocs/publicPage'
import securePage from '../../hocs/securePage'
import reduxApi, { withPeople } from '../../lib/redux/reduxApi.js'
import Loading from '../../components/Loading'

const blankPerson = {
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
}

export class PersonDetailPage extends Component {
  state = {
    editing: false
  }
  static async getInitialProps ({ store, query }) {
    // Get one Org
    const isNew = query && query.new && query.new === 'new'
    if (isNew) {
      return {
        isNew: true,
        personid: null
      }
    } else if (query && query.id) {
      await store.dispatch(reduxApi.actions.people.get(query))
      return {
        isNew: false,
        personid: query.id
      }
    }
  }

  componentDidMount () {
    if (this.props.isNew) {
      this.setState({ editing: true })
    }
  }

  handleCancel = () => {
    this.setState({ editing: false })
    if (this.props.isNew) { // return to previous
      Router.back()
    }
  }

  // TODO: [VP-209] only show person delete button for admins
  async handleDelete (person) {
    if (!person) return
    await this.props.dispatch(reduxApi.actions.people.delete({ id: person._id }))
    // TODO error handling - how can this fail?
    message.success('Deleted. ')
    Router.replace(`/people`)
  }

  async handleSubmit (person) {
    if (!person) return
    // Actual data request
    let res = {}
    if (person._id) {
      res = await this.props.dispatch(reduxApi.actions.people.put({ id: person._id }, { body: JSON.stringify(person) }))
    } else {
      res = await this.props.dispatch(reduxApi.actions.people.post({}, { body: JSON.stringify(person) }))
      person = res[0]
      console.log(person)
      Router.replace(`/people/${person._id}`)
    }
    this.setState({ editing: false })
    message.success('Saved.')
  }

  handleDeleteCancel = () => { message.error('Delete Cancelled') }

  render () {
    const isOrgAdmin = false // TODO: is this person an admin for the org that person belongs to.
    const isAdmin = (this.props.me && this.props.me.role.includes('admin'))
    const canEdit = (isOrgAdmin || isAdmin)
    const canRemove = isAdmin
    const showPeopleButton = isAdmin

    let content = ''
    let person = null
    if (this.props.people.loading) {
      content = <Loading><p>Loading details...</p></Loading>
    } else if (this.props.isNew) {
      person = blankPerson
    } else {
      const people = this.props.people.data
      if (people.length === 1) {
        person = people[0]
      }
    }

    if (!person) {
      content = <div>
        <h2><FormattedMessage id='person.notavailable' defaultMessage='Sorry, this person is not available' description='message on person not found page' /></h2>
        {showPeopleButton &&
          <Button shape='round'>
            <Link href='/people'><a>
              <FormattedMessage id='showPeople' defaultMessage='Show All' description='Button to show all People' />
            </a></Link>
          </Button>}
        {isAdmin &&
          <Button shape='round'>
            <Link href='/person/new'><a>
              <FormattedMessage id='person.altnew' defaultMessage='New Person' description='Button to create a new person' />
            </a></Link>
          </Button>}
      </div>
    } else {
      content = this.state.editing
        ? <div>
          <PersonDetailForm person={person} onSubmit={this.handleSubmit.bind(this, person)} onCancel={this.handleCancel.bind(this)} />
        </div>
        : <div>
          { canEdit && <Button style={{ float: 'right' }} type='primary' shape='round' onClick={() => this.setState({ editing: true })} >
            <FormattedMessage id='person.edit' defaultMessage='Edit' description='Button to edit a person' />
          </Button>}

          <PersonDetail person={person} />

          &nbsp;
          { canRemove && <Popconfirm title='Confirm removal of this person.' onConfirm={this.handleDeletePerson} onCancel={this.cancel} okText='Yes' cancelText='No'>
            <Button type='danger' shape='round' >
              <FormattedMessage id='deletePerson' defaultMessage='Remove Person' description='Button to remove an person on PersonDetails page' />
            </Button>
          </Popconfirm>}

        </div>
    }
    return (
      <FullPage>
        <h1><FormattedMessage defaultMessage='Person' id='person.detail.title' /></h1>
        {content}
      </FullPage>
    )
  }
}

PersonDetailPage.propTypes = {
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

export default securePage(withPeople(PersonDetailPage))
