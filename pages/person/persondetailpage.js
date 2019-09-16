import { Button, message, Popconfirm } from 'antd'
import Cookie from 'js-cookie'
import Link from 'next/link'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import Loading from '../../components/Loading'
import PersonDetail from '../../components/Person/PersonDetail'
import PersonDetailForm from '../../components/Person/PersonDetailForm'
import { IssueBadgeButton } from '../../components/IssueBadge/issueBadge'
import { FullPage } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import reduxApi, { withMembers, withPeople, withLocations } from '../../lib/redux/reduxApi.js'
import { MemberStatus } from '../../server/api/member/member.constants'

const blankPerson = {
  // for new people load the default template doc.
  name: '',
  nickname: '',
  about: '',
  location: '',
  email: '',
  phone: '',
  gender: '',
  pronoun: {
    'subject': '',
    'object': '',
    'possessive': ''
  },
  imgUrl: '',
  website: null,
  facebook: null,
  twitter: null,
  role: ['volunteer'],
  status: 'inactive'
}

export class PersonDetailPage extends Component {
  state = {
    editing: false
  }
  static async getInitialProps ({ store, query, req }) {
    // Get one Org
    const isNew = query && query.new && query.new === 'new'
    await store.dispatch(reduxApi.actions.locations.get())
    if (isNew) {
      return {
        isNew: true,
        personid: null
      }
    } else if (query && query.id) {
      const meid = query.id
      let cookies = req ? req.cookies : Cookie.get()
      const cookiesStr = JSON.stringify(cookies)
      query.session = store.getState().session
      try {
        await store.dispatch(reduxApi.actions.people.get(query, {
          params: cookiesStr
        }))
        await store.dispatch(reduxApi.actions.members.get({ meid }))
      } catch (err) {
        // this can return a 403 forbidden if not signed in
        console.log('Error in persondetailpage:', err)
      }

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
      Router.replace(`/people/${person._id}`)
    }
    this.setState({ editing: false })
    message.success('Saved.')
  }

  handleDeleteCancel = () => { message.error('Delete Cancelled') }

  render () {
    const isOrgAdmin = false // TODO: [VP-473] is this person an admin for the org that person belongs to.
    const isAdmin = (this.props.me && this.props.me.role.includes('admin'))
    const canEdit = (isOrgAdmin || isAdmin)
    const canRemove = isAdmin
    const showPeopleButton = isAdmin

    let content = ''
    let person = null
    if (this.props.people.loading) {
      content = <Loading />
    } else if (this.props.isNew) {
      person = blankPerson
    } else {
      const people = this.props.people.data
      if (people.length === 1) {
        person = people[0]
      }
    }

    if (this.props.members.sync && this.props.members.data.length > 0) {
      person.orgMembership = this.props.members.data.filter(m => m.status === MemberStatus.MEMBER)
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
          <>
            <Button shape='round'>
              <Link href='/person/new'><a>
                <FormattedMessage id='person.altnew' defaultMessage='New Person' description='Button to create a new person' />
              </a></Link>
            </Button>
          </>}
      </div>
    } else {
      content = this.state.editing
        ? <PersonDetailForm person={person} onSubmit={this.handleSubmit.bind(this, person)} onCancel={this.handleCancel.bind(this)} locations={this.props.locations.data} />
        : <>
          {canEdit && <Button style={{ float: 'right' }} type='secondary' shape='round' onClick={() => this.setState({ editing: true })} >
            <FormattedMessage id='person.edit' defaultMessage='Edit' description='Button to edit a person' />
          </Button>}

          <PersonDetail person={person} />

          &nbsp;
          {canRemove && <Popconfirm title='Confirm removal of this person.' onConfirm={this.handleDeletePerson} onCancel={this.cancel} okText='Yes' cancelText='No'>
            <Button type='danger' shape='round' >
              <FormattedMessage id='deletePerson' defaultMessage='Remove Person' description='Button to remove an person on PersonDetails page' />
            </Button>
          </Popconfirm>}
          {
            isAdmin && <IssueBadgeButton person={this.props.people.data[0]} />
          }

        </>
    }
    return (
      <FullPage>
        <Helmet>
          <title>Voluntarily - Person Details</title>
        </Helmet>
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
    location: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    gender: PropTypes.string,
    pronoun: PropTypes.object,
    imgUrl: PropTypes.any,
    role: PropTypes.arrayOf(PropTypes.oneOf(['admin', 'opportunityProvider', 'volunteer', 'activityProvider', 'tester'])),
    status: PropTypes.oneOf(['active', 'inactive', 'hold'])
  }),
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
}

export default securePage(withMembers(withPeople(withLocations(PersonDetailPage))))
