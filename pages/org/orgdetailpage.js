import { useState, useEffect, useCallback } from 'react'
import { Button, message } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'
import reduxWrapper from '../../lib/redux/store'

import Loading from '../../components/Loading'
import OrgBanner from '../../components/Org/OrgBanner'
import OrgTabs from '../../components/Org/OrgTabs'
import OrgDetailForm from '../../components/Org/OrgDetailForm'
import { FullPage } from '../../components/VTheme/VTheme'

import reduxApi, { withOrgs } from '../../lib/redux/reduxApi.js'
import { MemberStatus } from '../../server/api/member/member.constants'
import { GroupTagList } from '../../server/api/tag/tag.constants'
import RegisterMemberSection from '../../components/Member/RegisterMemberSection'
import { Helmet } from 'react-helmet'
import { OrganisationRole } from '../../server/api/organisation/organisation.constants'

const blankOrg = {
  name: 'New Organisation',
  about: '',
  imgUrl: '/static/img/organisation/organisation.png',
  contactEmail: '',
  contactId: null,
  website: null,
  facebook: null,
  twitter: null,
  role: [OrganisationRole.VOLUNTEER_PROVIDER],
  groups: []
}

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

export const OrgDetailPage = ({
  members,
  me,
  organisations,
  isNew,
  dispatch,
  isAuthenticated,
  tags
}) => {
  const { asPath, query, pathname, replace, back } = useRouter()
  const initTab = () => isNew ? 'edit' : query.tab || 'about'
  const [activeTab, setActiveTab] = useState(initTab)
  const [saved, setSaved] = useState(false)
  // when path changes set the active tab. as this doesn't work in updateTab
  useEffect(() => {
    console.log('aspath', asPath)
    const qtab = asPath.match(/.*tab=(.*)/)
    qtab && setActiveTab(qtab[1])
  }, [query])

  const updateTab = (key, top) => {
    console.log('updateTab', key, top)
    if (top) window.scrollTo(0, 0)
    else { window.scrollTo(0, 400) }

    const newpath = `/orgs/${org._id}?tab=${key}`
    replace(pathname, newpath, { shallow: true })
  }
  const handleTabChange = (key) => {
    updateTab(key, key === 'edit')
  }
  const handleCancel = useCallback(
    () => {
      updateTab('about', true)
      if (isNew) { // return to previous
        back()
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
        replace(`/orgs/${org._id}`)
      }
      setSaved(true)
      updateTab('about', true)
      message.success('Saved.')
    }, [])

  if (!organisations.sync && !isNew) {
    return <Loading label='organisation' entity={organisations} />
  }

  const orgs = organisations.data
  if (orgs.length === 0 && !isNew) {
    return <OrgUnknown />
  }
  const org = isNew ? blankOrg : orgs[0]

  // Who can edit?
  const isAdmin = me && me.role.includes('admin')
  const isOrgAdmin =
    members.data.length &&
    members.data[0].status === MemberStatus.ORGADMIN
  const canManage = isAuthenticated && (isOrgAdmin || isAdmin)

  if (activeTab === 'edit') {
    return (
      <FullPage>
        <Helmet>
          <title>Edit {org.name} - Voluntarily</title>
        </Helmet>
        <OrgDetailForm
          org={org}
          isAdmin={isAdmin}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          existingGroups={tags.data}
        />
      </FullPage>)
  }

  return (
    <FullPage>
      <Helmet>
        <title>{org.name} - Voluntarily</title>
      </Helmet>

      <OrgBanner org={org}>
        {isAuthenticated && <RegisterMemberSection orgid={org._id} meid={me._id.toString()} />}
        {saved && <HomeButton />}
      </OrgBanner>
      <OrgTabs
        org={org} canManage={canManage} isAuthenticated={isAuthenticated}
        tab={activeTab} onChange={handleTabChange}
      />
    </FullPage>)
}

export const getServerSideProps = reduxWrapper.getServerSideProps(
  store => async ({ query }) => {
    // Get one Org
    console.log('OrgDetailPage GSSP', query)
    await store.dispatch(reduxApi.actions.tags.get({ name: GroupTagList }))
    const isNew = query && query.new && query.new === 'new'
    const props = {
      props: {
        isNew: !!isNew,
        orgid: null
      }
    }
    if (isNew) {
      return props
    } else if (query && query.id) {
      props.props.orgid = query.id
      await store.dispatch(reduxApi.actions.organisations.get(query))
      if (store.getState().session.isAuthenticated) {
      // get available membership of this org - either just me or all
      // const meid = store.getState().session.me._id.toString()
        await store.dispatch(
          reduxApi.actions.members.get({ orgid: query.id })
        )
      }
      return props
    }
  })

export const OrgDetailPageWithOrgs = withOrgs(OrgDetailPage)
export default OrgDetailPageWithOrgs
