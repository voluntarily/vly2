import { Button, Divider } from 'antd'
import Link from 'next/link'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
import ReduxLoading from '../Loading'
import { OpAddAskBtn, OpAddOfferBtn } from '../Op/OpAdd'
import OpListSmall from '../Op/OpListSmall'
import { OpTypeCount } from '../Op/OpType'
import { OpSectionGrid } from '../VTheme/VTheme'
const { ASK, OFFER } = OpportunityType

export const ActOpsPanel = ({ act, type, limit }) => {
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

  // if (opportunities.length === 0) {
  //   return <Alert message={<OpTypeNoResults type={type} />} type='info' showIcon />
  // }

  // TODO - sort the results by number of interested people
  let ops = opportunities.filter(op => op.type === type)
  const showMore = limit && ops.length > limit
  if (showMore) ops = ops.slice(0, limit)
  return (
    <>
      <OpSectionGrid>
        <div id='left_column'>
          <h2>
            <OpTypeCount counts={act.opCounts} type={type} />
            <FormattedMessage
              id='ActOpsPanel.prompt.with'
              defaultMessage=' with'
            /> {act.name}
          </h2>
          {type === OFFER &&
            <>
              <p style={{ marginBottom: '1rem' }}>
                <FormattedMessage
                  id='ActOpsPanel.prompt.OpAddAskBtn'
                  defaultMessage='Offer to help people in your community'
                />
              </p>
              <OpAddOfferBtn actid={act._id} />
            </>}
          {type === ASK &&
            <>
              <p style={{ marginBottom: '1rem' }}>
                <FormattedMessage
                  id='ActOpsPanel.prompt.OpAddOfferBtn'
                  defaultMessage='Need help? Hit the button below '
                />
              </p>
              <OpAddAskBtn actid={act._id} />
            </>}
        </div>
        <div>
          <OpListSmall ops={ops} />
          {showMore &&
            <Link href={`/acts/${act._id}?tab=${type}`}>
              <Button shape='round' size='large' style={{ marginTop: '1rem', float: 'right' }}>
                <FormattedMessage
                  id='ActOpsPanel.button.showAll'
                  defaultMessage='See all'
                />
              </Button>
            </Link>}
        </div>
      </OpSectionGrid>
      <Divider />
    </>
  )
}
