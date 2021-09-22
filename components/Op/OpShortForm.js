import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Divider } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { OpportunityStatus } from '../../server/api/opportunity/opportunity.constants'
import OpFormDate from './OpFormDate'
import OpFormDescription from './OpFormDescription'
import OpFormPublishBtns from './OpFormDoneBtns'
import OpFormLocation from './OpFormLocation'
import OpFormTitle from './OpFormTitle'

class OpShortForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      startDateValue: null,
      endDateValue: null
    }
  }

  componentDidMount () {
    // // Call validateFields here to disable the submit button when on a blank form.
    // // empty callback supresses a default which prints to the console.
    // this.props.form.validateFields(['title']);
    const op = this.props.op
    this.setState({ startDateValue: op.date[0] })
    this.setState({ endDateValue: op.date[1] })
  }

  handleSubmit = (draftOrPublish) => {
    this.setState({
      requiredForPublish: draftOrPublish === 'publish'
    }
    , () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const op = this.props.op
          const { startDateValue, endDateValue } = this.state
          op.date = [] // Dirty work around to not change schema
          op.date.push(startDateValue, endDateValue)
          // op.name = values.name
          op.subtitle = values.subtitle
          // op.tags = values.tags

          const duration = moment.duration()
          duration.add(Number(values.durationHours), 'hours')
          duration.add(Number(values.durationMinutes), 'minutes')
          op.duration = duration.toISOString()

          op.locations = [...new Set([values.city, values.region])]
          delete op.location
          op.address = {
            street: values.street,
            suburb: values.suburb,
            city: values.city,
            postcode: values.postcode,
            region: values.region
          }
          op.offerOrg = values.offerOrg && values.offerOrg.key
          op.description = values.description
          // op.imgUrl = values.imgUrl
          // op.venue = values.venue
          op.status = draftOrPublish === 'publish'
            ? OpportunityStatus.ACTIVE
            : OpportunityStatus.DRAFT

          this.props.onSubmit(op)
        } else {
          window.scrollTo(0, 0)
          console.error('field validation error:', err)
        }
      })
    })
  }

  changeFormValue = (state, value) => {
    this.setState({
      [state]: value
    })
  }

  handleStartDateChange = value => {
    this.changeFormValue('startDateValue', value)
  }

  render () {
    const op = this.props.op

    const {
      getFieldDecorator,
      setFieldsValue
    } = this.props.form

    // Only show error after a field is touched.
    // const nameError = isFieldTouched('name') && getFieldError('name')
    const orgMembership =
      this.props.me.orgMembership &&
      this.props.me.orgMembership.map(member => member.organisation)
    return (
      <div className='OpShortForm'>
        <OpFormTitle type={op.type} title={op.name} onBack={this.props.onCancel} />
        <Divider />
        <Form colon={false}>
          <OpFormDescription getFieldDecorator={getFieldDecorator} type={op.type} />
          <Divider />
          <OpFormLocation getFieldDecorator={getFieldDecorator} setFieldsValue={setFieldsValue} type={op.type} orgMembership={orgMembership} addressFinderKey={this.props.locations.addressFinderKey} />
          <Divider />
          <OpFormDate getFieldDecorator={getFieldDecorator} type={op.type} onChange={this.handleStartDateChange} />
          {/* <OpFormTags getFieldDecorator={getFieldDecorator} existingTags={this.props.existingTags} /> */}
          <Divider />

          <OpFormPublishBtns getFieldDecorator={getFieldDecorator} type={op.type} onSubmit={this.handleSubmit} onCancel={this.props.onCancel} />
        </Form>
      </div>
    )
  }
}

OpShortForm.propTypes = {
  op: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.string,
    duration: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.string),
    address: PropTypes.shape({
      street: PropTypes.string,
      suburb: PropTypes.string,
      city: PropTypes.string,
      postcode: PropTypes.string,
      region: PropTypes.string
    }),
    offerOrg: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string
      })
    ]),
    date: PropTypes.array,
    status: PropTypes.string,
    // requestor: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    organisationVenue: PropTypes.string

  }),
  me: PropTypes.shape({
    _id: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.string),
    orgMembership: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string
      })
    )
  }),
  form: PropTypes.object,
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  existingTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  locations: PropTypes.shape({
    addressFinderKey: PropTypes.string.isRequired
  })
  // dispatch: PropTypes.func.isRequired,
}

export default Form.create({
  name: 'opportunity_detail_form',
  mapPropsToFields ({ op }) {
    if (!op.locations) { op.locations = [op.location] }

    const isoDuration = moment.duration(op.duration)
    const totalHours = Math.floor(isoDuration.asHours())

    return {
      // name: Form.createFormField({ ...op.name, value: op.name }),
      subtitle: Form.createFormField({ value: op.subtitle }),
      description: Form.createFormField({ value: op.description }),
      durationHours: Form.createFormField({ value: totalHours }),
      durationMinutes: Form.createFormField({ value: isoDuration.minutes() }),
      street: Form.createFormField({ value: op.address && op.address.street }),
      suburb: Form.createFormField({ value: op.address && op.address.suburb }),
      city: Form.createFormField({ value: op.address && op.address.city }),
      postcode: Form.createFormField({ value: op.address && op.address.postcode }),
      region: Form.createFormField({ value: op.address && op.address.region }),
      offerOrg: Form.createFormField({ value: { key: op.offerOrg ? op.offerOrg._id : '' } }),
      // imgUrl: Form.createFormField({ value: op.imgUrl }),
      // status: Form.createFormField({ value: op.status }),
      // tags: Form.createFormField({ value: op.tags }),
      startDate: Form.createFormField({
        value: op.startDate != null ? moment(op.startDate) : null
      })
      // endDate: Form.createFormField({
      //   value: op.endDate != null ? moment(op.endDate) : null
      // }),
      // venue: Form.createFormField({ value: op.venue || '' })
    }
  }

})(OpShortForm)
