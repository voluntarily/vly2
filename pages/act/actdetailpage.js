import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import Head from 'next/head'
import { useRouter } from 'next/router'

import ActBanner from '../../components/Act/ActBanner'
import ActTabs from '../../components/Act/ActTabs'
import ActUnknown from '../../components/Act/ActUnknown'
import ActTryBelow from '../../components/Act/ActTryBelow'
import ActDetailForm from '../../components/Act/ActDetailForm'
import Loading from '../../components/Loading'
import { FullPage, PageBannerButtons } from '../../components/VTheme/VTheme'
import { MemberStatus } from '../../server/api/member/member.constants'
import OpAdd from '../../components/Op/OpAdd'
import { Role } from '../../server/services/authorize/role.js'

import reduxApi, { withActs, withMembers } from '../../lib/redux/reduxApi.js'
import reduxWrapper from '../../lib/redux/store'

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

export const ActDetailPage = ({
  members,
  me,
  opportunities,
  isNew,
  dispatch,
  activities,
  tags
}) => {
  const { asPath, query, pathname, replace, back } = useRouter()

  const [tab, setTab] = useState(
    isNew
      ? 'edit'
      : (query && query.tab ? query.tab : 'about')
  )
  useEffect(() => {
    const qtab = asPath.match(/.*tab=(.*)/)
    qtab && setTab(qtab[1])
  }, [query])

  const updateTab = (key, top) => {
    if (top) window.scrollTo(0, 0)
    const newpath = `/acts/${act._id}?tab=${key}`
    replace(pathname, newpath, { shallow: true })
  }
  const handleTabChange = (key, e) => {
    updateTab(key, key === 'edit')
  }
  const handleCancel = () => {
    updateTab('about', true)
    if (isNew) { // return to previous
      back()
    }
  }

  const handleSubmit = useCallback(
    async act => {
      if (!act) return
      // Actual data request
      let res = {}
      if (act._id) {
        res = await dispatch(
          reduxApi.actions.activities.put(
            { id: act._id },
            { body: JSON.stringify(act) }
          )
        )
      } else {
        res = await dispatch(
          reduxApi.actions.activities.post(
            {},
            { body: JSON.stringify(act) })
        )
        act = res[0]
        replace(`/acts/${act._id}`)
      }
      updateTab('about', true)
      message.success('Saved.')
    }, [])

  // bail early if no data
  if (!activities.sync && !isNew) {
    return <Loading label='activity' entity={opportunities} />
  }
  const acts = activities.data
  if (acts.length === 0 && !isNew) {
    return <ActUnknown />
  }

  // setup the activity data
  let act
  if (isNew) {
    // new op
    act = blankAct
    act.owner = me
  } else { // existing act
    act = activities.data[0]
  }
  // Who can edit?
  const isAdmin = me && me.role.includes(Role.ADMIN)
  const isOwner =
      isNew ||
      (me && act.onwer && me._id === act.owner._id)

  let isOrgAdmin = false

  // add org membership to me so it can be used for offerOrg
  if (me && members.sync && members.data.length > 0) {
    me.orgMembership = members.data.filter(m =>
      [MemberStatus.MEMBER, MemberStatus.ORGADMIN].includes(m.status)
    )
    if (!act.offerOrg && me.orgMembership.length > 0) {
      act.offerOrg = { _id: me.orgMembership[0].organisation._id }
    }
  }
  if (act.offerOrg && me.orgMembership) {
    isOrgAdmin = me.orgMembership.find(m => {
      return (m.status === MemberStatus.ORGADMIN &&
      m.organisation._id === act.offerOrg._id).length > 0
    })
  }

  const canManage = isOwner || isAdmin || isOrgAdmin

  if (tab === 'edit') {
    return (
      <FullPage>
        <Head>
          <title>Edit {isNew ? 'Activity' : act.name} - Voluntarily</title>
        </Head>
        <ActDetailForm
          act={act}
          me={me}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          existingTags={tags.data}
        />
      </FullPage>)
  }
  return (
    <FullPage>
      <Head>
        <title>{act.name} - Voluntarily</title>
      </Head>
      <ActBanner act={act}>
        <PageBannerButtons>
          <OpAdd actid={act._id} />
        </PageBannerButtons>
        <ActTryBelow counts={act.opCounts} role={me.role} />
      </ActBanner>
      <ActTabs
        act={act} me={me} canManage={canManage} canEdit={canManage}
        tab={tab} onChange={handleTabChange} owner={me._id}
      />
    </FullPage>)
}

export const getServerSideProps = reduxWrapper.getServerSideProps(
  store => async (props) => gssp({ store, query: props.query })
)

export const gssp = async ({ store, query }) => {
  const isAuthenticated = store.getState().session.isAuthenticated
  const me = store.getState().session.me
  const isNew = !!(query && query.new && query.new === 'new')
  const actExists = !!(query && query.id) // !! converts to a boolean value

  if (isNew) {
    await Promise.all([
      isAuthenticated ? store.dispatch(reduxApi.actions.members.get({ meid: me._id.toString() })) : Promise.resolve(),
      store.dispatch(reduxApi.actions.tags.get({}))
    ])
    return {
      props: {
        isNew
      }
    }
  } else {
    if (actExists) {
      try {
        await Promise.all([
          isAuthenticated ? store.dispatch(reduxApi.actions.members.get({ meid: me._id.toString() })) : Promise.resolve(),
          store.dispatch(reduxApi.actions.tags.get({})),
          store.dispatch(reduxApi.actions.activities.get(query)),
          store.dispatch(
            reduxApi.actions.opportunities.get(
              { q: JSON.stringify({ fromActivity: query.id }) }
            )
          )
        ])
      } catch (e) {
        console.error('Error getting activity data:', e)
      }
    }
    return {
      props: {
        isNew,
        actExists
      }
    }
  }
}

export default withMembers(withActs(ActDetailPage))
