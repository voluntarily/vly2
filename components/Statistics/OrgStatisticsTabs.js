import React, { useEffect } from 'react'
import { Tabs } from 'antd'
import VTabs from '../VTheme/VTabs'
import { connect } from 'react-redux'
import { withOrgs } from '../../lib/redux/reduxApi.js'

import ReduxLoading from '../Loading'

const OrgStatisticsTabs = (props) => {
  useEffect(() => {
    props.dispatch(
      props.organisationsActions.get({
        q: JSON.stringify({ _id: { $in: props.orgAdminFor } })
      })
    )
  }, [props.orgAdminFor])

  if (!props.organisations.sync) {
    return <ReduxLoading entity={props.organisations} label='organisations' />
  }

  const orgs = props.organisations.data

  return (
    <VTabs size='large'>
      {orgs &&
        orgs.map((org) => (
          <Tabs.TabPane tab={org.name} key={org._id}>
            TODO: add dashboard component
          </Tabs.TabPane>
        ))}
    </VTabs>
  )
}

const mapStateToProps = (store) => ({
  orgAdminFor: store.session.me.orgAdminFor
})

export default connect(mapStateToProps)(withOrgs(OrgStatisticsTabs))
