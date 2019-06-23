/* eslint-disable no-console */
import React, { Component } from 'react'
import { Button, Col, Divider, Form, Input, Radio, Row, DatePicker } from 'antd'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'

import ImageUpload from '../UploadComponent/ImageUploadComponent'
const { TextArea } = Input

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class OpDetailForm extends Component {
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
        const op = this.props.op
        op.date = [] // Dirty work around to not change schema
        op.date.push(values.startDate, values.endDate)
        op.title = values.title
        op.subtitle = values.subtitle
        op.duration = values.duration
        op.location = values.location
        op.description = values.description
        op.imgUrl = values.imgUrl
        op.status = values.status
        op.requestor = this.props.me._id

        this.props.onSubmit(this.props.op)
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
    const opTitle = (<FormattedMessage id='opTitle' defaultMessage='Title' description='opportunity Title label in OpDetails Form' />)
    const opSubtitle = (<FormattedMessage id='opSubtitle' defaultMessage='Subtitle' description='opportunity Subtitle label in OpDetails Form' />)
    const opCommitment = (<FormattedMessage id='opCommitment' defaultMessage='Commitment' description='opportunity Commitment label in OpDetails Form' />)
    const opDate = (<FormattedMessage id='opDate' defaultMessage='Start Date' description='opportunity Time label in OpDetails Form' />)
    const opDateEnd = (<FormattedMessage id='opDateEnd' defaultMessage='End date' description='opportunity Time label in OpDetails Form' />)
    const opLocation = (<FormattedMessage id='opLocation' defaultMessage='Location' description='opportunity Location label in OpDetails Form' />)
    const opDescription = (<FormattedMessage id='opDescription' defaultMessage='Description' description='opportunity Description label in OpDetails Form' />)
    const opImgUrl = (<FormattedMessage id='opImgUrl' defaultMessage='Image Link' description='opportunity Image URL label in OpDetails Form' />)
    const opStatus = (<FormattedMessage id='opStatus' defaultMessage='Status' description='Draft or published status' />)
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched
    } = this.props.form

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

    const dateConfig = {
      rules: [{
        type: 'object',
        // required: true,
        message: 'A date is required'
      }]
    }

    // Only show error after a field is touched.
    const titleError = isFieldTouched('title') && getFieldError('title')

    return (
      <div className='OpDetailForm'>
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
                label={opTitle}
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
              <Form.Item label={opSubtitle}>
                {getFieldDecorator('subtitle', {
                  rules: [

                  ]
                })(
                  <Input placeholder='short summary that appears on the listing.' />
                )}
              </Form.Item>
              <Form.Item label={opDescription}>
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
              <h2>2. Where and when? (optional)</h2>
              <p>If you know when you'll need help, or where - this will help
                volunteers to organise logistics and increase volunteer numbers.
              </p>
            </Col>
            <Col
              xs={{ span: 24 }}
              md={{ span: 16 }}
            >
              <Form.Item label={opCommitment}>
                {getFieldDecorator('duration', {
                  rules: [
                    { required: true, message: 'Commitment level is required' }
                  ]
                })(
                  <Input placeholder='4 hours' />
                )}
              </Form.Item>
              <Form.Item label={opLocation}>
                {getFieldDecorator('location', { rules: [] })(
                  <Input placeholder='school or somewhere else?' />
                )}
              </Form.Item>
              <Form.Item label={opDate}>
                {getFieldDecorator('startDate', dateConfig)(
                  <DatePicker showTime size='large' format='DD-MM-YYYY HH:mm:ss' style={{ width: '100%' }} />
                )}
              </Form.Item>
              <Form.Item label={opDateEnd}>
                {getFieldDecorator('endDate', dateConfig)(
                  <DatePicker showTime format='DD-MM-YYYY HH:mm:ss' style={{ width: '100%' }} />
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
              <h2>3. Illustration? (optional)</h2>
              <p>Requests with photos get more responses.
                If you don't have a photo leave blank and we will provide one
                based on the category.
              </p>
            </Col>
            <Col
              xs={{ span: 24 }}
              md={{ span: 16 }}
            >
              <Form.Item label={opImgUrl}>
                {getFieldDecorator('imgUrl', {
                  rules: []
                })(
                  <Input />
                )}
                <ImageUpload setImgUrl={this.setImgUrl} />
              </Form.Item>
              <Form.Item label={opStatus}>
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
                  id='op.cancel'
                  defaultMessage='Cancel'
                  description='Label for cancel button on opportunity details form'
                />
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                disabled={hasErrors(getFieldsError())}
                style={{ marginLeft: 8 }}
              >
                <FormattedMessage
                  id='op.save'
                  defaultMessage='Save'
                  description='Label for submit button on opportunity details form'
                />
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

OpDetailForm.propTypes = {
  op: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.string,
    duration: PropTypes.string,
    location: PropTypes.string,
    date: PropTypes.array,
    status: PropTypes.string,
    requestor: PropTypes.string
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
  name: 'opportunity_detail_form',
  onFieldsChange (props, changedFields) {
    // console.log('onFieldsChange', changedFields)
    // props.onChange(changedFields);
  },
  mapPropsToFields (props) {
    return {
      title: Form.createFormField({ ...props.op.title, value: props.op.title }),
      subtitle: Form.createFormField({ ...props.op.subtitle, value: props.op.subtitle }),
      description: Form.createFormField({ ...props.op.description, value: props.op.description }),
      duration: Form.createFormField({ ...props.op.duration, value: props.op.duration }),
      location: Form.createFormField({ ...props.op.location, value: props.op.location }),
      imgUrl: Form.createFormField({ ...props.op.imgUrl, value: props.op.imgUrl }),
      startDate: Form.createFormField({ ...props.op.startDate, value: (props.op.startDate != null) ? moment(props.op.startDate, 'YYYY-MM-DD HH:mm:ss') : null }),
      endDate: Form.createFormField({ ...props.op.endDate, value: (props.op.endDate != null) ? moment(props.op.endDate, 'YYYY-MM-DD HH:mm:ss') : null }),
      status: Form.createFormField({ ...props.op.status, value: props.op.status })
    }
  }
  // onValuesChange (_, values) {
  //   console.log('onValuesChange', values)
  // }
})(OpDetailForm)
