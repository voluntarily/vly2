import { useState } from 'react'
import { Button, message, Popconfirm } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import reduxWrapper from '../../lib/redux/store'

import Loading from '../../components/Loading'
import PersonDetail from '../../components/Person/PersonDetail'
import PersonDetailForm from '../../components/Person/PersonDetailForm'
import { IssueBadgeButton } from '../../components/IssueBadge/issueBadge'
import { FullPage } from '../../components/VTheme/VTheme'
import reduxApi, { withMembers, withPeople, withLocations } from '../../lib/redux/reduxApi.js'
import { MemberStatus } from '../../server/api/member/member.constants'

const blankPerson = {
  // for new people load the default template doc.
  name: '',
  nickname: '',
  about: '',
  locations: [],
  email: '',
  sendEmailNotifications: true,
  phone: '',
  pronoun: {
    subject: '',
    object: '',
    possessive: ''
  },
  imgUrl: '/static/img/person/person.png',
  website: null,
  facebook: null,
  twitter: null,
  role: ['volunteer'],
  status: 'inactive',
  tags: []
}

const PersonNotAvailable = ({ isAdmin }) =>
  <FullPage>
    <Helmet>
      <title>Person Unavailable - Voluntarily</title>
    </Helmet>
    <h2><FormattedMessage id='person.notavailable' defaultMessage='Sorry, this person is not available' description='message on person not found page' /></h2>
    {isAdmin &&
      <>
        <Button shape='round'>
          <Link href='/people'>
            <a>
              <FormattedMessage id='showPeople' defaultMessage='Show All' description='Button to show all People' />
            </a>
          </Link>
        </Button>
        <Button shape='round'>
          <Link href='/person/new'>
            <a>
              <FormattedMessage id='person.altnew' defaultMessage='New Person' description='Button to create a new person' />
            </a>
          </Link>
        </Button>
      </>}
  </FullPage>

export const PersonDetailPage = ({
  isNew,
  me,
  people,
  members,
  locations,
  tags,
  dispatch
}) => {
  const [editing, setEditing] = useState(isNew)
  const { replace, back } = useRouter()

  const handleCancelEdit = () => {
    if (isNew) { // return to previous
      return back()
    }
    setEditing(false)
  }

  // TODO: [VP-209] only show person delete button for admins
  const handleDeletePerson = async (person) => {
    await dispatch(reduxApi.actions.people.delete({ id: person._id }))
    // TODO error handling - how can this fail?
    message.success('Deleted. ')
    replace('/people')
  }

  const handleSubmit = async (person) => {
    // Actual data request
    let res = {}
    if (person._id) {
      res = await dispatch(reduxApi.actions.people.put({ id: person._id }, { body: JSON.stringify(person) }))
      setEditing(false)
    } else {
      res = await dispatch(reduxApi.actions.people.post({}, { body: JSON.stringify(person) }))
      person = res[0]
      replace(`/people/${person._id}`)
    }
    message.success('Saved.')
  }

  const handleCancelDelete = () => { message.error('Delete Cancelled') }

  if (!people.sync) {
    return <Loading label='person' entity={people} />
  }

  let person = null
  if (isNew) {
    person = blankPerson
  } else {
    const peeps = people.data
    if (peeps.length > 0) {
      person = peeps[0]
      if (members.sync && members.data.length > 0) {
        person.orgMembership = members.data.filter(m => [MemberStatus.MEMBER, MemberStatus.ORGADMIN].includes(m.status))
        person.orgFollowership = members.data.filter(m => m.status === MemberStatus.FOLLOWER)
      }
    }
  }

  if (!person) {
    return <PersonNotAvailable isAdmin />
  }
  const isAdmin = (me && me.role.includes('admin'))
  const canRemove = isAdmin
  const isOrgAdmin = false // TODO: [VP-473] is this person an admin for the org that person belongs to.
  const canEdit = (isOrgAdmin || isAdmin || (person && person._id === me._id))

  if (editing) {
    const locs = locations.data[0]
    return (
      <FullPage>
        <Helmet>
          <title>Edit {person.name} - Voluntarily</title>
        </Helmet>
        <PersonDetailForm
          person={person}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
          locations={locs}
          existingTags={tags.data}
          me={me}
        />
      </FullPage>
    )
  }

  return (
    <FullPage>
      <Helmet>
        <title>{person.nickname} - Voluntarily</title>
      </Helmet>

      <PersonDetail person={person} personEdit={() => setEditing(true)} canEdit={canEdit} />
      {canRemove &&
        <Popconfirm
          id='deletePersonConfirm' title='Confirm removal of this person.'
          onConfirm={person => handleDeletePerson(person)}
          onCancel={handleCancelDelete} okText='Yes' cancelText='No'
        >
          <Button id='deletePersonBtn' type='danger' shape='round'>
            <FormattedMessage id='person.delete' defaultMessage='Remove Person' description='Button to remove an person on PersonDetails page' />
          </Button>
        </Popconfirm>}
          &nbsp;
      {isAdmin &&
        <IssueBadgeButton person={people.data[0]} />}
    </FullPage>
  )
}

export const getServerSideProps = reduxWrapper.getServerSideProps(
  store => async (props) => gssp({ store, query: props.query })
)

// factored out for easier testing.
export const gssp = async ({ store, query }) => {
  // Get one Org
  const isNew = query && query.new && query.new === 'new'
  await store.dispatch(reduxApi.actions.locations.get({}))
  await store.dispatch(reduxApi.actions.tags.get({}))
  if (isNew) {
    return {
      props: {
        isNew: true,
        personid: null
      }
    }
  } else if (query && query.id) {
    const meid = query.id
    try {
      await store.dispatch(reduxApi.actions.people.get(query))
      await store.dispatch(reduxApi.actions.members.get({ meid }))
    } catch (err) {
      // this can return a 403 forbidden if not signed in
      console.error('Error in persondetailpage:', err)
    }

    return {
      props: {
        isNew: false,
        personid: query.id
      }
    }
  }
}

export default withMembers(withPeople(withLocations(PersonDetailPage)))
