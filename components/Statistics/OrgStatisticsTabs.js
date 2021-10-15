import React, { useEffect } from 'react'
import { Tabs } from 'antd'
import VTabs from '../VTheme/VTabs'
import { withOrgs } from '../../lib/redux/reduxApi.js'
import ReduxLoading from '../Loading'
import StatisticsPanel from './StatisticsPanel'
import { useSelector, useDispatch } from 'react-redux'

const OrgStatisticsTabs = ({ organisationsActions, organisations, timeframe }) => {
  const orgAdminFor = useSelector((state) => state.session.me.orgAdminFor)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      organisationsActions.get({
        q: JSON.stringify({ _id: { $in: orgAdminFor } })
      })
    )
  }, [orgAdminFor, dispatch, organisationsActions])

  if (!organisations || !organisations.sync) {
    return <ReduxLoading entity={organisations} label='organisations' />
  }

  const orgs = organisations.data || []

  return (
    <VTabs size='large'>
      {orgs.map((org) => (
        <Tabs.TabPane tab={org.name} key={org._id}>
          <StatisticsPanel orgId={org._id} timeframe={timeframe} />
        </Tabs.TabPane>
      ))}
    </VTabs>
  )
}

export default withOrgs(OrgStatisticsTabs)
