import Link from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import Loading from '../../components/Loading'
import OpBanner from '../../components/Op/OpBanner'
import OpTabs from '../../components/Op/OpTabs'
import OpUnknown from '../../components/Op/OpUnknown'
import { Stamp } from '../../components/VTheme/Stamp'
import { FullPage } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'
import reduxApi, { withArchivedOpportunities, withMembers } from '../../lib/redux/reduxApi.js'
import { FormattedMessage } from 'react-intl'
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
      <Helmet>
        <title>{op.name} Archived - Voluntarily</title>
      </Helmet>
      <OpBanner op={op}>
        <Stamp>
          <FormattedMessage
            id='ArchivedOpDetailPage.Stamp.Completed'
            defaultMessage='Completed'
            description='Stamp on banner saying completed.'
          />
        </Stamp>
        <p>
          <FormattedMessage
            id='ArchivedOpDetailPage.Completed.message'
            defaultMessage='This activity has already happened, but you can still get involved with'
            description='Message in banner activity has completed'
          />
          {' '}
          <Link href='/'>
            <a>
              <FormattedMessage
                id='ArchivedOpDetailPage.Completed.link'
                defaultMessage='similar activities here'
                description='Message in banner activity has completed link text'
              />
            </a>
          </Link>
        </p>
      </OpBanner>
      <OpTabs op={op} canManage={canManage} defaultTab={tab} onChange={handleTabChange} author={me._id} />
    </FullPage>)
}

ArchivedOpDetailPage.getInitialProps = async ({ store, query }) => {
  // console('getInitialProps: ArchivedOpDetailPage', store, query)
  const me = store.getState().session.me
  const opExists = !!(query && query.id) // !! converts to a boolean value

  if (me._id) { // get viewers membership so we can tell if they are org Admin
    // TODO: may already be in the session
    await store.dispatch(reduxApi.actions.members.get({ meid: me._id.toString() }))
  }

  if (opExists) {
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

export const OpDetailPageWithOps = withMembers(withArchivedOpportunities(ArchivedOpDetailPage))
export default publicPage(withMembers(withArchivedOpportunities(ArchivedOpDetailPage)))
