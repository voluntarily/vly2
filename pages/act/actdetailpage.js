import { message } from 'antd'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useState, useCallback } from 'react'
import { Helmet } from 'react-helmet'
import ActBanner from '../../components/Act/ActBanner'
import ActTabs from '../../components/Act/ActTabs'
import ActUnknown from '../../components/Act/ActUnknown'
import ActDetailForm from '../../components/Act/ActDetailForm'
import Loading from '../../components/Loading'
import { FullPage, PageBannerButtons } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'
import reduxApi, { withActs, withMembers } from '../../lib/redux/reduxApi.js'
import { MemberStatus } from '../../server/api/member/member.constants'
import OpAdd from '../../components/Op/OpAdd'
import { Role } from '../../server/services/authorize/role.js'

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
  const router = useRouter()
  const [tab, setTab] = useState(isNew ? 'edit' : router.query.tab)

  const updateTab = (key, top) => {
    setTab(key)
    if (top) window.scrollTo(0, 0)
    //  else { window.scrollTo(0, 400) }
    const newpath = `/acts/${act._id}?tab=${key}`
    router.replace(router.pathname, newpath, { shallow: true })
  }
  const handleTabChange = (key, e) => {
    updateTab(key, key === 'edit')
  }
  const handleCancel = useCallback(
    () => {
      updateTab('about', true)
      if (isNew) { // return to previous
        router.back()
      }
    },
    [isNew]
  )

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
        router.replace(`/acts/${act._id}`)
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
        <Helmet>
          <title>Edit {isNew ? 'Activity' : act.name} - Voluntarily</title>
        </Helmet>
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
      <Helmet>
        <title>{act.name} - Voluntarily</title>
      </Helmet>
      <ActBanner act={act}>
        <PageBannerButtons>
          <OpAdd actid={act._id} />
        </PageBannerButtons>
      </ActBanner>
      <ActTabs act={act} canManage={canManage} canEdit={canManage} defaultTab={tab} onChange={handleTabChange} owner={me._id} />
    </FullPage>)
}

ActDetailPage.getInitialProps = async ({ store, query }) => {
  const me = store.getState().session.me
  const isNew = query && query.new && query.new === 'new'
  const actExists = !!(query && query.id) // !! converts to a boolean value

  if (isNew) {
    await Promise.all([
      store.dispatch(reduxApi.actions.members.get({ meid: me._id.toString() })),
      store.dispatch(reduxApi.actions.tags.get())
    ])
    return {
      isNew
    }
  } else {
    if (actExists) {
      await Promise.all([
        store.dispatch(reduxApi.actions.members.get({ meid: me._id.toString() })),
        store.dispatch(reduxApi.actions.tags.get()),
        store.dispatch(reduxApi.actions.activities.get(query)),
        store.dispatch(
          reduxApi.actions.opportunities.get(
            { q: JSON.stringify({ fromActivity: query.id }) }
          )
        )
      ])
    }
    return {
      isNew,
      actExists
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
export default publicPage(withMembers(withActs(ActDetailPage)))
