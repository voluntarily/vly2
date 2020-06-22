import { useCallback } from 'react'
import { Button, Divider, message, Popconfirm } from 'antd'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'
import { ControlGrid, OpSectionGrid } from '../VTheme/VTheme'
import reduxApi, { withOps } from '../../lib/redux/reduxApi.js'
import { OpportunityStatus } from '../../server/api/opportunity/opportunity.constants'

export const OpCloseOpportunity = ({ op, dispatch }) => {
  const router = useRouter()
  const handleCompleteOpportunity = useCallback(
    async () => {
      await dispatch(
        reduxApi.actions.opportunities.put(
          { id: op._id },
          { body: JSON.stringify({ status: OpportunityStatus.COMPLETED }) }
        )
      )
      message.success('Opportunity Confirmed')
      router.replace(`/archivedops/${op._id}?tab=manage`)
      // MAYBE: publish topic for completed op
    }, [])

  const handleCancelOpportunity = useCallback(
    async () => {
      await dispatch(
        reduxApi.actions.opportunities.put(
          { id: op._id },
          { body: JSON.stringify({ status: OpportunityStatus.CANCELLED }) }
        )
      )
      message.success('Request Cancelled')
      router.replace('/home')
      // MAYBE: publish topic for completed op
    }, [])

  return (
    <OpSectionGrid>
      <h2>
        <FormattedMessage
          id='OpCloseOpportunity.title'
          defaultMessage='End Activity'
          description='warning about the buttons to close an op'
        />
      </h2>
      <div>
        <h4>
          <FormattedMessage
            id='OpCloseOpportunity.warning'
            defaultMessage='These buttons will permanently end your activity - be careful!'
            description='warning about the buttons to close an op'
          />
        </h4>

        <ControlGrid>
          <h3><strong>Finish this activity</strong><br />Only use this button once your activity is complete</h3>
          <Popconfirm id='completedOpPopConfirm' title='Confirm completion of this opportunity.' onConfirm={handleCompleteOpportunity} okText='Yes' cancelText='No'>
            <Button type='primary' shape='round' size='large'>
              <FormattedMessage id='completedOp' defaultMessage='Completed' description='Button to confirm opportunity is completed on OpDetails page' />
            </Button>
          </Popconfirm>
        </ControlGrid>
        <Divider />
        <ControlGrid>
          <h3><strong>Cancel this activity</strong><br />This will end the activity and stop volunteers from seeing it</h3>
          <Popconfirm id='cancelOpPopConfirm' title='Confirm cancel of this opportunity.' onConfirm={handleCancelOpportunity} okText='Yes' cancelText='No'>
            <Button type='danger' shape='round' size='large'>
              <FormattedMessage id='cancelOp' defaultMessage='Cancel Request' description='Button to cancel an opportunity on OpDetails page' />
            </Button>
          </Popconfirm>
        </ControlGrid>
      </div>
    </OpSectionGrid>
  )
}

export default withOps(OpCloseOpportunity)
