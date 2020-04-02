import OpListSmall from '../Op/OpListSmall'
import React from 'react'
import { useSelector } from 'react-redux'
import ReduxLoading from '../Loading'
import { ActivityContainer, Spacer } from '../VTheme/VTheme'
import { OpTypeTitle, OpTypeNoResults } from '../Op/OpType'
import { Alert } from 'antd'
export const ActOpsPanel = ({ actId, type }) => {
  const opportunities = useSelector(state => state.opportunities.data)

  const loadingState = useSelector(state => ({
    sync: state.opportunities.sync,
    syncing: state.opportunities.syncing,
    loading: state.opportunities.loading,
    error: state.opportunities.error
  }))

  if (loadingState.loading || (!loadingState.sync && !loadingState.error) || loadingState.error) {
    return <ReduxLoading entity={loadingState} label='opportunities' />
  }

  if (opportunities.length === 0) {
    return <Alert message={<OpTypeNoResults type={type} />} type='info' showIcon />
  }

  return <><Spacer /><ActivityContainer><h2> <OpTypeTitle type={type} /></h2><OpListSmall ops={opportunities.filter(op => op.type === type)} /></ActivityContainer></>
}
