import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useState } from 'react'
import Head from 'next/head'
import Loading from '../../components/Loading'
import OpBanner from '../../components/Op/OpBanner'
import OpTabs from '../../components/Op/OpTabs'
import OpUnknown from '../../components/Op/OpUnknown'
import OpArchivedHeader from '../../components/Op/OpArchivedHeader'
import { FullPage } from '../../components/VTheme/VTheme'

import reduxApi, { withArchivedOpportunities, withMembers } from '../../lib/redux/reduxApi.js'
const { Role } = require('../../server/services/authorize/role')

export const ArchivedOpDetailPage = ({
  me,
  archivedOpportunities
}) => {
  const router = useRouter()
  const [tab, setTab] = useState(router.query.tab)

  const updateTab = (key, top) => {
    setTab(key)
    if (top) window.scrollTo(0, 0)
    const newpath = `/archivedops/${op._id}?tab=${key}`
    router.replace(router.pathname, newpath, { shallow: true })
  }
  const handleTabChange = (key, e) => {
    updateTab(key, key === 'edit')
  }

  // bail early if no data
  if (!archivedOpportunities.sync) {
    return <Loading label='Archived Opportunities' entity={archivedOpportunities} />
  }
  const ops = archivedOpportunities.data
  if (ops.length === 0) {
    return <OpUnknown />
  }

  // setup the opportunity data
  const op = {
    ...archivedOpportunities.data[0],
    startDate: archivedOpportunities.data[0].date[0],
    endDate: archivedOpportunities.data[0].date[1]
  }

  // Who can see manage tab?
  const isOwner = me && op.requestor && me._id === op.requestor._id
  const isOrgAdmin = me.role.includes(Role.ORG_ADMIN) && op.offerOrg && me.orgAdminFor.includes(op.offerOrg._id)
  const isAdmin = me && me.role.includes(Role.ADMIN)
  const canManage = isOwner || isOrgAdmin || isAdmin

  return (
    <FullPage>
      <Head>
        <title>{op.name} Archived - Voluntarily</title>
      </Head>
      <OpArchivedHeader status={op.status} />
      <OpBanner op={op}>
        {/* <OpStatusStamp status={op.status} /> */}
      </OpBanner>
      <OpTabs op={op} canManage={canManage} defaultTab={tab} onChange={handleTabChange} author={me._id} />
    </FullPage>)
}

ArchivedOpDetailPage.getInitialProps = async ({ store, query }) => {
  // console('getInitialProps: ArchivedOpDetailPage', store, query)
  const me = store.getState().session.me
  const opExists = !!(query && query.id) // !! converts to a boolean value

  if (me._id) { // get viewers membership so we can tell if they are org Admin
    await store.dispatch(reduxApi.actions.members.get({ meid: me._id.toString() }))
  }

  if (opExists) { // get the archived op for this page
    await store.dispatch(reduxApi.actions.archivedOpportunities.get(query))
  }
}

ArchivedOpDetailPage.propTypes = {
  op: PropTypes.shape({
    name: PropTypes.string.isRequired,
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

export const ArchivedOpDetailPageWithArchivedOps = withMembers(withArchivedOpportunities(ArchivedOpDetailPage))
export default withMembers(withArchivedOpportunities(ArchivedOpDetailPage))
