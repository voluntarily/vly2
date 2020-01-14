import { useCallback } from 'react'
import { Button, Divider, message, Popconfirm } from 'antd'
import Router from 'next/router'
import { FormattedMessage } from 'react-intl'
import { ControlGrid } from '../VTheme/VTheme'
import reduxApi, { withOps } from '../../lib/redux/reduxApi.js'
import { OpportunityStatus } from '../../server/api/opportunity/opportunity.constants'

export const OpCloseOpportunity = ({ op, dispatch }) => {
  const handleCompleteOpportunity = useCallback(
    async () => {
      await dispatch(
        reduxApi.actions.opportunities.put(
          { id: op._id },
          { body: JSON.stringify({ status: OpportunityStatus.COMPLETED }) }
        )
      )
      message.success('Opportunity Confirmed')
      Router.replace(`/archivedops/${op._id}`)
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
      Router.replace('/home')
      // MAYBE: publish topic for completed op
    }, [])

  return (
    <section>
      <h2>
        <FormattedMessage
          id='OpCloseOpportunity.title'
          defaultMessage='Danger Zone'
          description='warning about the buttons to close an op'
        />
      </h2>
      <h4>
        <FormattedMessage
          id='OpCloseOpportunity.warning'
          defaultMessage='These buttons will permanently end your activity - be careful!'
          description='warning about the buttons to close an op'
        />
      </h4>
      <ControlGrid>
        <h5><strong>Finish this activity</strong><br />Only use this button once your activity is complete</h5>
        <Popconfirm id='completedOpPopConfirm' title='Confirm completion of this opportunity.' onConfirm={handleCompleteOpportunity} okText='Yes' cancelText='No'>
          <Button type='primary' shape='round' size='large'>
            <FormattedMessage id='completedOp' defaultMessage='Completed' description='Button to confirm opportunity is completed on OpDetails page' />
          </Button>
        </Popconfirm>
      </ControlGrid>
      <Divider />
      <ControlGrid>
        <h5><strong>Cancel this activity</strong><br />This will end the activity and stop volunteers from seeing it</h5>
        <Popconfirm id='cancelOpPopConfirm' title='Confirm cancel of this opportunity.' onConfirm={handleCancelOpportunity} okText='Yes' cancelText='No'>
          <Button type='danger' shape='round' size='large'>
            <FormattedMessage id='cancelOp' defaultMessage='Cancel Request' description='Button to cancel an opportunity on OpDetails page' />
          </Button>
        </Popconfirm>
      </ControlGrid>
    </section>
  )
}

export default withOps(OpCloseOpportunity)
