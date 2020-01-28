import { useState, useCallback } from 'react'
import { Button, message } from 'antd'
import Link from 'next/link'
import Router from 'next/router'
import { FormattedMessage } from 'react-intl'
import Loading from '../../components/Loading'
import OrgBanner from '../../components/Org/OrgBanner'
import OrgTabs from '../../components/Org/OrgTabs'
import OrgDetailForm from '../../components/Org/OrgDetailForm'
import { FullPage } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'
import reduxApi, { withOrgs } from '../../lib/redux/reduxApi.js'
import { MemberStatus } from '../../server/api/member/member.constants'
import RegisterMemberSection from '../../components/Member/RegisterMemberSection'
import { Helmet } from 'react-helmet'

const blankOrg = {
  name: 'New Organisation',
  about: '',
  imgUrl: '/static/img/organisation/organisation.png',
  contactEmail: '',
  contactId: null,
  website: null,
  facebook: null,
  twitter: null,
  category: ['vp']
}

export const OrgEditButton = ({ onClick }) =>
  <Button
    type='primary'
    shape='round'
    onClick={onClick}
    style={{ float: 'right' }}
  >
    <FormattedMessage
      id='orgDetailPage.button.edit'
      defaultMessage='Edit'
      description='Button to edit an organisation on orgDetailPage'
    />
  </Button>

export const HomeButton = () =>
  <Button
    type='secondary'
    shape='round'
    href='/'
    style={{ float: 'right' }}
  >
    <FormattedMessage
      id='orgDetailPage.button.home'
      defaultMessage='Return Home'
      description='Button to return home after editing'
    />
  </Button>

export const OrgUnknown = () =>
  <>
    <h2>
      <FormattedMessage
        id='orgDetailPage.OrgNotFound'
        defaultMessage='Sorry, this organisation is not available'
        description='Org not found message'
      />
    </h2>
    <Link href='/orgs'>
      <Button shape='round'>
        <FormattedMessage
          id='orgDetailPage.showOrgs'
          defaultMessage='Show All'
          description='Button to show all organisations'
        />
      </Button>
    </Link>
  </>

export const OrgDetailPage = ({ members, me, organisations, isNew, dispatch, isAuthenticated }) => {
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const setEditingOfPage = (editing) => {
    setEditing(editing)
    window.scrollTo({
      top: 0
    })
  }

  const handleCancel = useCallback(
    () => {
      setEditing(false)
      if (isNew) { // return to previous
        Router.back()
      }
    },
    [isNew]
  )

  const handleSubmit = useCallback(
    async (org) => {
      let res = {}
      if (org._id) {
      // update existing organisation
        res = await dispatch(
          reduxApi.actions.organisations.put(
            { id: org._id },
            { body: JSON.stringify(org) }
          )
        )
      } else {
      // save new organisation
        res = await dispatch(
          reduxApi.actions.organisations.post({}, { body: JSON.stringify(org) })
        )
        org = res[0]
        Router.replace(`/orgs/${org._id}`)
      }
      setEditing(false)
      setSaved(true)
      message.success('Saved.')
    }, [])

  if (organisations.loading) {
    return <Loading />
  }

  const orgs = organisations.data
  if (orgs.length === 0 && !isNew) {
    return <OrgUnknown />
  }
  const org = isNew ? blankOrg : orgs[0]

  const isOrgAdmin =
    members.data.length &&
    members.data[0].status === MemberStatus.ORGADMIN
  const isAdmin = me && me.role.includes('admin')
  const canEdit = isAuthenticated && (isOrgAdmin || isAdmin)
  if (editing) {
    return (
      <FullPage>
        <OrgDetailForm
          org={org}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </FullPage>)
  }

  return (
    <FullPage>
      <Helmet>
        <title>{org.name} - Voluntarily</title>
      </Helmet>

      <OrgBanner org={org}>
        {isAuthenticated && <RegisterMemberSection orgid={org._id} meid={me._id} />}
        {saved && <HomeButton />}
        {canEdit && <OrgEditButton onClick={() => setEditingOfPage(true)} />}
      </OrgBanner>
      <OrgTabs org={org} />
    </FullPage>)
}

OrgDetailPage.getInitialProps = async ({ store, query }) => {
  // Get one Org
  const isNew = query && query.new && query.new === 'new'
  if (isNew) {
    return {
      isNew: true,
      orgid: null
    }
  } else if (query && query.id) {
    await store.dispatch(reduxApi.actions.organisations.get(query))
    if (store.getState().session.isAuthenticated) {
      // get my membership of this org
      const meid = store.getState().session.me._id.toString()
      await store.dispatch(
        reduxApi.actions.members.get({ orgid: query.id, meid: meid })
      )
    }
    return {
      isNew: false,
      orgid: query.id
    }
  }
}

export const OrgDetailPageWithOrgs = withOrgs(OrgDetailPage)
export default publicPage(OrgDetailPageWithOrgs)

/* //TODO: this commented out code will likely go in the new settings tab
          <Divider />

          <h2>
            <FormattedMessage
              id='getInvolved'
              defaultMessage='Get involved'
              description='Header for org activities'
            />
          </h2>
          <h5>Volunteer with {org.name}</h5>
          <OpListSection org={org._id} />
          <div style={{ float: 'right' }}>
            <Button shape='round'>
              <Link href='/orgs'>
                <a>
                  <FormattedMessage
                    id='showOrgs'
                    defaultMessage='Show All'
                    description='Button to show all organisations'
                  />
                </a>
              </Link>
            </Button>

            {canRemove && (
              <Popconfirm
                title='Confirm removal of this organisation.'
                onConfirm={this.handleDelete.bind(this, org)}
                onCancel={this.handleDeleteCancel.bind(this)}
                okText='Yes'
                cancelText='No'
              >
                <Button style={{ float: 'right' }} type='danger' shape='round'>
                  <FormattedMessage
                    id='deleteOrg'
                    defaultMessage='Remove Organisation'
                    description='Button to remove an Organisatino on OrgDetails page'
                  />
                </Button>
              </Popconfirm>
            )}
          </div>
*/
