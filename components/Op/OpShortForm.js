import { Form, Divider } from 'antd'
import moment from 'moment'
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
  // const [publish, setPublish] = useState(true)
  const initialValues = op

  const isoDuration = moment.duration(op.duration)
  initialValues.durationHours = Math.floor(isoDuration.asHours())
  initialValues.durationMinutes = isoDuration.minutes()
  initialValues.startDate = op.date[0] && moment(op.date[0])
  initialValues.endDate = op.date[1] && moment(op.date[1])

  const onFinish = (values) => {
    // console.log('onFinish', values)
    values.locations = [...new Set(values.locations)]

    // compose a correct op from the fields.
    const duration = moment.duration()
    duration.add(Number(values.durationHours), 'hours')
    duration.add(Number(values.durationMinutes), 'minutes')
    op = {
      ...op,
      ...values,
      offerOrg: values.offerOrg && values.offerOrg.key,
      duration: duration?.toISOString(),
      // in this version of the form we only have start date
      date: [values.startDate?.toISOString()]

    }

    // remove items we used for fields but don't want to send to database
    delete op.durationHours
    delete op.durationMinutes
    delete op.startDate
    delete op.endDate

    // in the short form the are no draft versions - always active
    // op.status = publish
    //   ? OpportunityStatus.ACTIVE
    //   : OpportunityStatus.DRAFT

    onSubmit(op)
  }

  const orgMembership =
    me?.orgMembership &&
    me.orgMembership.map(member => member.organisation)

  return (
    <div className='OpShortForm'>
      <OpFormTitle type={op.type} title={op.name} onBack={onCancel} />

      <Form
        form={form}
        name='op_short_form'
        layout='vertical'
        initialValues={initialValues}
        onFinish={onFinish}
        size='large'
        scrollToFirstError
      >
        <Divider />
        <OpFormDescription type={op.type} />
        <Divider />
        <OpFormLocation form={form} type={op.type} orgMembership={orgMembership} addressFinderKey={locations.addressFinderKey} />
        <Divider />
        <OpFormDate type={op.type} />

        <Divider />

        <OpFormPublishBtns type={op.type} onCancel={onCancel} />
        {/* <OpFormPublishBtns type={op.type} onCancel={onCancel} canSaveDraft onSaveDraft={() => setPublish(false)} /> */}
      </Form>
    </div>
  )
}

// export const PersonDetailFormWithAddressFinder = withAddressFinder(OpShortForm)
// export default connect(store => ({ me: store.session.me }))(PersonDetailFormWithAddressFinder)

export default OpShortForm
