import { Button, message } from 'antd'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import ActDetail from '../../components/Act/ActDetail'
import ActDetailForm from '../../components/Act/ActDetailForm'
import Loading from '../../components/Loading'
import { FullPage, Spacer } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import reduxApi, { withActs, withMembers } from '../../lib/redux/reduxApi.js'
import { Role } from '../../server/services/authorize/role'
import { MemberStatus } from '../../server/api/member/member.constants'

const blankAct = {
  name: '',
  subtitle: '',
  imgUrl: '',
  duration: '',
  equipment: [],
  description: '',
  status: 'draft',
  tags: []
}

export const ActDetailPage = (props) => {
  const [editing, setEditing] = useState(false)
  useEffect(() => {
    if (props.isNew) {
      setEditing(true)
    }
  }, [props])

  const handleCancelEdit = () => {
    setEditing(false)
    if (props.isNew) { // return to previous
      Router.back()
    }
  }

  const setEditingOfPage = (editing) => {
    setEditing(editing)
    window.scrollTo({
      top: 0
    })
  }

  // // Called when the user confirms they want to delete an act
  // const handleDelete = async act => {
  //   if (!act) return
  //   // Actual data request
  //   await props.dispatch(reduxApi.actions.activities.delete({ id: act._id }))
  //   // TODO error handling - how can this fail?
  //   message.success('Deleted. ')
  //   Router.replace('/acts')
  // }
  // const handleDeleteCancel = () => { message.error('Delete Cancelled') }

  const handleSubmit = async act => {
    if (!act) return
    // Actual data request
    let res = {}
    if (act._id) {
      props.dispatch(reduxApi.actions.activities.put({ id: act._id }, { body: JSON.stringify(act) }))
    } else {
      res = await props.dispatch(reduxApi.actions.activities.post({}, { body: JSON.stringify(act) }))
      act = res[0]
      Router.replace(`/acts/${act._id}`)
    }
    setEditing(false)
    message.success('Saved.')
  }

  const handleEditClicked = () => { setEditing(!editing) }

  const me = props.me
  const isOrgAdmin = false // TODO: is this person an admin for the org that person belongs to.
  const isAdmin = (me && me.role.includes(Role.ADMIN))
  // const isOP = (me && me.role.includes(Role.OPPORTUNITY_PROVIDER))

  // get membership list for owner
  if (me &&
      props.members.sync &&
      props.members.data.length > 0 &&
      props.members) {
    me.orgMembership = props.members.data.filter(
      m => [MemberStatus.MEMBER, MemberStatus.ORGADMIN].includes(m.status) &&
        m.organisation.category.includes('ap')
    )
  }

  let isOwner = false
  let content
  let act
  let owner
  if (props.isNew) {
    act = blankAct
    owner = me
    isOwner = true
    // set init offerOrg to first membership result
    if (me.orgMembership && me.orgMembership.length > 0) {
      act.offerOrg = {
        _id: me.orgMembership[0].organisation._id
      }
      act.tags = me.orgMembership[0].organisation.groups
    }
  } else if (!props.activities.sync) {
    content = <Loading label='activity' entity={props.activities} />
  } else {
    const acts = props.activities.data
    if (acts.length === 1) {
      act = acts[0]
      owner = act.owner
      isOwner = ((me || {})._id === (owner || {})._id)
    } else { // array must be empty
      content = <h2><FormattedMessage id='ActDetailPage.notavailable' defaultMessage='Sorry, this activity is not available' description='message on activity not found page' /></h2>
    }
  }

  // display permissions
  const canEdit = (isOwner || isOrgAdmin || isAdmin)
  const existingTags = props.tags.data

  // // button to make an opportunity from an activity
  // const createOpportunitySection = () => {
  //   return (
  //     // if not signed in then the interested button signs in first
  //     isOP &&
  //       <Button style={{ float: 'right' }} type='primary' shape='round' href={`/op/new?act=${act._id}`}>
  //         <FormattedMessage
  //           id='act.createOpportunityBtn'
  //           defaultMessage='Create new request from this Activity'
  //           description='Button to create an opportunity from an activity'
  //         />
  //       </Button>
  //   )
  // }

  if (!content) {
    if ((act && editing) || props.isNew) {
      content =
        <>
          <Helmet>
            <title>
              Voluntarily - Edit Activity
            </title>
          </Helmet>
          <ActDetailForm
            act={act}
            me={me}
            onSubmit={() => handleSubmit(act)}
            onCancel={handleCancelEdit}
            existingTags={existingTags}
          />
        </>
    } else {
      content =
        <>
          <Helmet>
            <title>
              {act ? `Voluntarily - ${act.name}` : 'Voluntarily'}
            </title>
          </Helmet>
          <ActDetail
            act={act}
            onEditClicked={handleEditClicked}
            canEdit={canEdit}
            me={props.me}
            {...props}
          />
          {canEdit &&
            <Button
              id='editActBtn' style={{ float: 'right' }}
              type='primary' shape='round'
              onClick={() => setEditingOfPage(true)}
            >
              <FormattedMessage id='act.edit' defaultMessage='Edit' description='Button to edit an activity' />
            </Button>}
          <Spacer />
        </>
    }
  }

  return (
    <FullPage>
      {content}
    </FullPage>
  )
}

ActDetailPage.getInitialProps = async ({ store, query }) => {
  const me = store.getState().session.me
  const isNew = query && query.new && query.new === 'new'
  const actExists = !!(query && query.id) // !! converts to a boolean value
  await Promise.all([
    store.dispatch(reduxApi.actions.members.get({ meid: me._id.toString() })),
    store.dispatch(reduxApi.actions.tags.get())
  ])
  if (isNew) {
    return {
      isNew,
      actid: null
    }
  } else {
    if (actExists) {
      await store.dispatch(reduxApi.actions.activities.get(query))
    }
    return {
      isNew,
      actExists,
      actid: query.id
    }
  }
}

ActDetailPage.propTypes = {
  act: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    duration: PropTypes.string,
    location: PropTypes.string,
    _id: PropTypes.string.isRequired
  }),
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
}
export const ActDetailPageWithActs = withMembers(withActs(ActDetailPage))
export default securePage(withMembers(withActs(ActDetailPage)))
