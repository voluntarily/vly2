import React, { useState, useEffect } from 'react'
import { Button, Form, Divider } from 'antd'
import moment from 'moment'
import { OpportunityStatus } from '../../server/api/opportunity/opportunity.constants'
import OpFormDate from './OpFormDate'
import OpFormDescription from './OpFormDescription'
import OpFormPublishBtns from './OpFormDoneBtns'
import OpFormLocation from './OpFormLocation'
import OpFormTitle from './OpFormTitle'

export const OpShortForm = ({
  op,
  me,
  onSubmit,
  onCancel,
  locations
}) => {
  const [form] = Form.useForm()
  const [dateRange, setDateRange] = useState({
    startDateValue: null,
    endDateValue: null
  })

  // componentDidMount () {
  //   // // Call validateFields here to disable the submit button when on a blank form.
  //   // // empty callback supresses a default which prints to the console.
  //   // form.validateFields(['title']);
  //   this.setState({ startDateValue: op.date[0] })
  //   this.setState({ endDateValue: op.date[1] })
  // }
  const onFinish = (values) => {
    values.locations = [...new Set(values.locations)]

    const duration = moment.duration()
    duration.add(Number(values.durationHours), 'hours')
    duration.add(Number(values.durationMinutes), 'minutes')
    op.duration = duration.toISOString()

    op = {
      ...op,
      ...values,
      offerOrg: values.offerOrg && values.offerOrg.key
    }

    // op.status = draftOrPublish === 'publish'
    //   ? OpportunityStatus.ACTIVE
    //   : OpportunityStatus.DRAFT

    onSubmit(op)

    // const op = op
    // const { startDateValue, endDateValue } = this.state
    // op.date = [] // Dirty work around to not change schema
    // op.date.push(startDateValue, endDateValue)
    // // op.name = values.name
  }

  const orgMembership =
    me.orgMembership &&
    me.orgMembership.map(member => member.organisation)

  return (
    <div className='OpShortForm'>
      <OpFormTitle type={op.type} title={op.name} onBack={onCancel} />

      <Form
        form={form}
        name='op_short_form'
        layout='vertical'
        initialValues={op}
        onFinish={onFinish}
        size='large'
      >
        <Divider />
        <OpFormDescription type={op.type} />
        <Divider />
        <OpFormLocation form={form} type={op.type} orgMembership={orgMembership} addressFinderKey={locations.addressFinderKey} />
        <Divider />
        {/* <OpFormDate type={op.type} onChange={handleStartDateChange} />

        <Divider /> */}

        {/* <OpFormPublishBtns type={op.type} onCancel={onCancel} /> */}
        <Button
          type='primary'
          htmlType='submit'
          style={{ marginLeft: 8 }}
        >
          Save
        </Button>
      </Form>
    </div>
  )
}

// export const PersonDetailFormWithAddressFinder = withAddressFinder(OpShortForm)
// export default connect(store => ({ me: store.session.me }))(PersonDetailFormWithAddressFinder)

export default OpShortForm
