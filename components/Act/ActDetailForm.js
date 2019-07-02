/* eslint-disable no-console */
import React, { Component } from 'react'
import { Button, Col, Divider, Form, Input, Radio, Row, DatePicker } from 'antd'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import ImageUpload from '../UploadComponent/ImageUploadComponent'
const { TextArea } = Input
const { RangePicker } = DatePicker

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class ActDetailForm extends Component {
  constructor (props) {
    super(props)
    this.setImgUrl = this.setImgUrl.bind(this)
  }

  componentDidMount () {
    // Call validateFields here to disable the submit button when on a blank form.
    // empty callback supresses a default which prints to the console.
    this.props.form.validateFields(() => { })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const act = this.props.act
        act.time = values.time
        act.title = values.title
        act.subtitle = values.subtitle
        act.duration = values.duration
        act.resource = values.resource
        act.description = values.description
        act.imgUrl = values.imgUrl
        act.status = values.status
        act.owner = this.props.me._id

        this.props.onSubmit(this.props.act)
      } else {
        // console.log('field validation error:', err)
      }
    })
  }

  setImgUrl = (value) => {
    this.props.form.setFieldsValue({
      imgUrl: value
    })
  }

  render () {
    // get translated labels
    const actTitle = (<FormattedMessage id='actTitle' defaultMessage='Title' description='activity Title label in ActDetails Form' />)
    const actSubtitle = (<FormattedMessage id='actSubtitle' defaultMessage='Subtitle' description='activity Subtitle label in ActDetails Form' />)
    const actCommitment = (<FormattedMessage id='actCommitment' defaultMessage='Commitment' description='activity Commitment label in ActDetails Form' />)
    const actResource = (<FormattedMessage id='actResource' defaultMessage='Resource' description='activity Resource label in ActDetails Form' />)
    const actTime = (<FormattedMessage id='actTime' defaultMessage='Time' description='activity Time label in ActDetails Form' />)
    const actDescription = (<FormattedMessage id='actDescription' defaultMessage='Description' description='activity Description label in ActDetails Form' />)
    const actImgUrl = (<FormattedMessage id='actImgUrl' defaultMessage='Image Link' description='activity Image URL label in ActDetails Form' />)
    const actStatus = (<FormattedMessage id='actStatus' defaultMessage='Status' description='Draft or published status' />)
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched
    } = this.props.form

    const timeRangeConfig = {
      rules: [ {
        type: 'array'
        // required: true
      }]
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
        md: { span: 16 }
      }
    }

    // Only show error after a field is touched.
    const titleError = isFieldTouched('title') && getFieldError('title')

    return (
      <div className='ActDetailForm'>
        <Form
          {...formItemLayout}
          onSubmit={this.handleSubmit}
          hideRequiredMark
          colon={false}
        >
          <Row>
            <Col
              xs={{ span: 24 }}
              md={{ span: 8 }}
            >
              <h2>1. What are you looking for?</h2>
              <p>Before our skilled volunteers get involved, they need to know how
                they can help. Add a title and description to your request to attract
                volunteers
              </p>
            </Col>
            <Col
              xs={{ span: 24 }}
              md={{ span: 16 }}
            >
              <Form.Item
                label={actTitle}
                validateStatus={titleError ? 'error' : ''}
                help={titleError || ''}
              >
                {getFieldDecorator('title', {
                  rules: [
                    { required: true, message: 'Title is required' }
                  ]
                })(
                  <Input placeholder='Title' />
                )}
              </Form.Item>
              <Form.Item label={actSubtitle}>
                {getFieldDecorator('subtitle', {
                  rules: [

                  ]
                })(
                  <Input placeholder='short summary that appears on the listing.' />
                )}
              </Form.Item>
              <Form.Item label={actDescription}>
                {getFieldDecorator('description', {
                  rules: [

                  ]
                })(
                  <TextArea rows={20} placeholder='All the details about the request. You can use markdown here.' />
                )}

              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col
              xs={{ span: 24 }}
              md={{ span: 8 }}
            >
              <h2>2. What resources will be required? (optional)</h2>
              <p>How much time will be required for this activity?</p>
              <p>How many people do you need to help? What skills might they require?</p>
              <p>Do you need a special space or location to work in?</p>
              <p>Does this activity require special equipment?</p>
            </Col>
            <Col
              xs={{ span: 24 }}
              md={{ span: 16 }}
            >
              <Form.Item label={actCommitment}>
                {getFieldDecorator('duration', {
                  rules: [
                    { required: true, message: 'Commitment level is required' }
                  ]
                })(
                  <Input placeholder='4 hours' />
                )}
              </Form.Item>
              <Form.Item label={actTime}>
                {getFieldDecorator('time', timeRangeConfig)(
                  <RangePicker showTime format='DD-MM-YYYY' />
                )}
              </Form.Item>
              <Form.Item label={actResource}>
                {getFieldDecorator('resource', {
                  rules: []
                })(
                  <Input placeholder='Any resources needed?' />
                )}
              </Form.Item>
              {/* TODO: [VP-206] Add activity resource requirement list. */}
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col
              xs={{ span: 24 }}
              md={{ span: 8 }}
            >
              <h2>3. Illustration? (optional)</h2>
              <p>Show off your activity
                Add a photo to illustrate your activity, you can even use animated GIF here.
              </p>
            </Col>
            <Col
              xs={{ span: 24 }}
              md={{ span: 16 }}
            >
              <Form.Item label={actImgUrl}>
                {getFieldDecorator('imgUrl', {
                  rules: [

                  ]
                })(
                  <Input />
                )}
                <ImageUpload setImgUrl={this.setImgUrl} />
              </Form.Item>
              <Form.Item label={actStatus}>
                {getFieldDecorator('status', {
                  rules: [
                    { required: true, message: 'status is required' }
                  ]
                })(
                  <Radio.Group buttonStyle='solid'>
                    <Radio.Button value='draft'>Draft</Radio.Button>
                    <Radio.Button value='active'>Active</Radio.Button>
                    <Radio.Button value='done'>Done</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col
              style={{ textAlign: 'right' }}
              xs={{ span: 24, offset: 0 }}
              md={{ span: 8, offset: 12 }}
            >
              <Button
                type='secondary'
                htmlType='button'
                onClick={this.props.onCancel}
              >
                <FormattedMessage
                  id='act.cancel'
                  defaultMessage='Cancel'
                  description='Label for cancel button on activity details form'
                />
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                disabled={hasErrors(getFieldsError())}
                style={{ marginLeft: 8 }}
              >
                <FormattedMessage
                  id='act.save'
                  defaultMessage='Save'
                  description='Label for submit button on activity details form'
                />
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

ActDetailForm.propTypes = {
  act: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.string,
    resource: PropTypes.string,
    time: PropTypes.Array,
    duration: PropTypes.string,
    status: PropTypes.string,
    owner: PropTypes.string
  }),
  me: PropTypes.shape({
    _id: PropTypes.string
  }),
  form: PropTypes.object,
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
  // dispatch: PropTypes.func.isRequired,
}

export default Form.create({
  name: 'activity_detail_form',
  onFieldsChange (props, changedFields) {
    // console.log('onFieldsChange', changedFields)
    // props.onChange(changedFields);
  },
  mapPropsToFields (props) {
    return {
      title: Form.createFormField({ ...props.act.title, value: props.act.title }),
      subtitle: Form.createFormField({ ...props.act.subtitle, value: props.act.subtitle }),
      description: Form.createFormField({ ...props.act.description, value: props.act.description }),
      duration: Form.createFormField({ ...props.act.duration, value: props.act.duration }),
      location: Form.createFormField({ ...props.act.location, value: props.act.location }),
      imgUrl: Form.createFormField({ ...props.act.imgUrl, value: props.act.imgUrl }),
      time: Form.createFormField({ ...props.act.time, value: props.act.time }),
      resource: Form.createFormField({ ...props.act.resource, value: props.act.resource }),
      status: Form.createFormField({ ...props.act.status, value: props.act.status })
    }
  }
  // onValuesChange (_, values) {
  //   console.log('onValuesChange', values)
  // }
})(ActDetailForm)
