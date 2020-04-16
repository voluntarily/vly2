import OpListSmall from '../Op/OpListSmall'
import React from 'react'
import { useSelector } from 'react-redux'
import ReduxLoading from '../Loading'
import { OpSectionGrid, Spacer } from '../VTheme/VTheme'
import { OpTypeCount, OpTypeNoResults } from '../Op/OpType'
import { Button, Alert } from 'antd'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { OpAddAskBtn, OpAddOfferBtn } from '../Op/OpAdd'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
const { ASK, OFFER } = OpportunityType

export const ActOpsPanel = ({ act, type, limit }) => {
  const opportunities = useSelector(state => state.opportunities.data)

  const loadingState = useSelector(state => ({
    sync: state.opportunities.sync,
    syncing: state.opportunities.syncing,
    loading: state.opportunities.loading,
    error: state.opportunities.error
  }))

  console.log('opportunities', opportunities);

  if (loadingState.loading || (!loadingState.sync && !loadingState.error) || loadingState.error) {
    return <ReduxLoading entity={loadingState} label='opportunities' />
  }

  if (opportunities.length === 0) {
    // return <Alert message={<OpTypeNoResults type={type} />} type='info' showIcon />
  }

  // TODO - sort the results by number of interested people
  let ops = opportunities.filter(op => op.type === type)
  const showMore = limit && ops.length > limit
  if (showMore) ops = ops.slice(0, limit)
  return (
    <>
      <OpSectionGrid>
        <h2>
          <div id='left_column'>
            <h2>
              {/* TODO: handle no people offering  */}
              <OpTypeCount counts={act.opCounts} type={type}> </OpTypeCount>
            </h2>
          </div>
        </h2>
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
          <Spacer />
          {type === ASK &&
            <>
              <p style={{ marginBottom: '1rem' }}>
                <FormattedMessage
                  id='ActOpsPanel.prompt.OpAddAskBtn'
                  defaultMessage="Can't see anyone who can help you?"
                />
              </p>
              <OpAddAskBtn actid={act._id} />
            </>}
          {type === OFFER &&
            <>
              <p style={{ marginBottom: '1rem' }}>
                <FormattedMessage
                  id='ActOpsPanel.prompt.OpAddOfferBtn'
                  defaultMessage="Can't see anyone needing your help?"
                />
              </p>
              <OpAddOfferBtn actid={act._id} />
            </>}
        </div>
      </OpSectionGrid>
    </>
  )
}
