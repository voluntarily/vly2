/* eslint-disable no-console */
import React, { Component } from 'react'
import { Button, Col, Divider, Form, Input, Radio, Row, DatePicker, Tooltip, Icon } from 'antd'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import styled from 'styled-components'
import ImageUpload from '../UploadComponent/ImageUploadComponent'
import { TextHeadingBold, TextP, Spacer } from '../VTheme/VTheme'
import OpDetailTagsEditable from './OpDetailTagsEditable'
import OpDetailLocation from './OpDetailLocation'
const { TextArea } = Input

// custom form components go here

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 40fr 60fr;

  @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
    /* iPhone X */
    grid-template-columns: calc(100vw - 2rem);
  }
`

const DescriptionContainer = styled.div`
  margin-right: 2rem;

  @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
    /* iPhone X */
    margin: initial;
  }
` // end descriptionContainer

const TitleContainer = styled.div`
  margin-bottom: 0.5rem;
` // end titleContainer

const InputContainer = styled.div`
  height: auto;
  margin-left: 2rem;
  margin-bottom: 2rem;
  @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
    /* iPhone X */
    margin: 1rem 0 0 0;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    /*  ##Device = Most of the Smartphones Mobiles (Portrait) ##Screen = B/w 320px to 479px */
    margin: 1rem 0 0 0;
  }
` // end inputContainer

const ShortInputContainer = styled.div`
  width: 25rem;
  @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
    /* iPhone X */
    width: auto;
  }

  @media (min-width: 320px) and (max-width: 480px) {
    /*  ##Device = Most of the Smartphones Mobiles (Portrait) ##Screen = B/w 320px to 479px */
    width: auto;
  }
`

const MediumInputContainer = styled.div`
  width: 35rem;
  @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
    /* iPhone X */
    width: auto;
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    /* #Device = Tablets, Ipads (portrait) #Screen = B/w 768px to 1024px */
    width: 25rem;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    /*  ##Device = Most of the Smartphones Mobiles (Portrait) ##Screen = B/w 320px to 479px */
    width: auto;
  }
`

// end custom form components

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class OpDetailForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      startDateValue: null,
      endDateValue: null,
      endOpen: false
    }
    this.setImgUrl = this.setImgUrl.bind(this)
  }

  componentDidMount () {
    // Call validateFields here to disable the submit button when on a blank form.
    // empty callback supresses a default which prints to the console.
    this.props.form.validateFields(() => { })
    this.setState({ startDateValue: this.props.op.date[0] })
    this.setState({ endDateValue: this.props.op.date[1] })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const op = this.props.op
        const { startDateValue, endDateValue } = this.state
        op.date = [] // Dirty work around to not change schema
        op.date.push(startDateValue, endDateValue)
        op.title = values.title
        op.subtitle = values.subtitle
        op.tags = values.tags
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

  changeFormValue = (state, value) => {
    this.setState({
      [ state ]: value
    })
  }

  onEndDateChange = value => {
    this.changeFormValue('endDateValue', value)
  }

  onStartDateChange = value => {
    this.changeFormValue('startDateValue', value)
  }

  disabledStartDate = startDateValue => {
    const { endDateValue } = this.state
    if (this.isEitherFirstOrSecondValueNull(startDateValue, endDateValue)) {
      return false
    }
    return startDateValue.valueOf() > endDateValue.valueOf()
  }

  disabledEndDate = endDateValue => {
    const { startDateValue } = this.state
    if (this.isEitherFirstOrSecondValueNull(startDateValue, endDateValue)) {
      return false
    }
    return endDateValue.valueOf() <= startDateValue.valueOf()
  }

  isEitherFirstOrSecondValueNull = (firstValue, secondValue) => {
    return !firstValue || !secondValue
  }

  setImgUrl = (value) => {
    this.props.form.setFieldsValue({
      imgUrl: value
    })
  }

  render () {
    // get translated labels
    const opTitle = (
      <span>
        <FormattedMessage
          id='opTitle'
          defaultMessage='Title'
          description='opportunity Title label in OpDetails Form'
        />
        &nbsp;
        <Tooltip title="Choose something interesting like 'we want to build robots' ">
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const opSubtitle = (
      <span>
        {' '}
        <FormattedMessage
          id='opSubtitle'
          defaultMessage='Subtitle'
          description='opportunity Subtitle label in OpDetails Form'
        />{' '}
        <Tooltip title="Choose something interesting like 'we want to build robots' ">
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const opCommitment = (
      <span>
        <FormattedMessage
          id='opCommitment'
          defaultMessage='Commitment'
          description='opportunity Commitment label in OpDetails Form'
        />
        &nbsp;
        <Tooltip title="Choose something interesting like 'we want to build robots' ">
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const opLocation = (
      <span>
        {' '}
        <FormattedMessage
          id='opLocation'
          defaultMessage='Location'
          description='opportunity Location label in OpDetails Form'
        />
        &nbsp;
        <Tooltip title="Choose something interesting like 'we want to build robots' ">
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const opDescription = (
      <span>
        {' '}
        <FormattedMessage
          id='opDescription'
          defaultMessage='Description'
          description='opportunity Description label in OpDetails Form'
        />
        &nbsp;
        <Tooltip title="Choose something interesting like 'we want to build robots' ">
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const opStartDate = (
      <span>
        {' '}
        <FormattedMessage
          id='opStartDate'
          defaultMessage='Start Date'
          description='opportunity start date label in OpDetails Form'
        />
        &nbsp;
        <Tooltip title='Choose your start date '>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )

    const opEndDate = (
      <span>
        {' '}
        <FormattedMessage
          id='opEndDate'
          defaultMessage='End Date'
          description='opportunity end date label in OpDetails Form'
        />
        &nbsp;
        <Tooltip title='Choose your end date '>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )

    const opImgUrl = (
      <span>
        <FormattedMessage
          id='opImgUrl'
          defaultMessage='Image Link'
          description='opportunity Image URL label in OpDetails Form'
        />
        &nbsp;
        <Tooltip title="Choose something interesting like 'we want to build robots' ">
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const opStatus = (
      <span>
        <FormattedMessage
          id='opStatus'
          defaultMessage='Status'
          description='Draft or published status'
        />
        &nbsp;
        <Tooltip title="Choose something interesting like 'we want to build robots' ">
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const opTags = (
      <FormattedMessage
        id='opTags'
        defaultMessage='Tags'
        description='Descriptions of general areas the opportunity relates to'
      />
    )

    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form

    // Only show error after a field is touched.
    const titleError = isFieldTouched('title') && getFieldError('title')

    return (
      <div className='OpDetailForm'>
        <Form onSubmit={this.handleSubmit} hideRequiredMark colon={false}>
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <TextHeadingBold>What are you looking for?</TextHeadingBold>
              </TitleContainer>
              <TextP>
                Before our skilled volunteers get involved, they need to know
                how they can help. Add a title and description that tell
                volunteers how they can help you.
              </TextP>
            </DescriptionContainer>
            <InputContainer>
              <ShortInputContainer>
                <Form.Item
                  label={opTitle}
                  validateStatus={titleError ? 'error' : ''}
                  help={titleError || ''}
                >
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: 'Title is required' }]
                  })(<Input placeholder='Title' />)}
                </Form.Item>

                <Form.Item label={opSubtitle}>
                  {getFieldDecorator('subtitle', {
                    rules: []
                  })(
                    <Input placeholder='short summary that appears on the listing.' />
                  )}
                </Form.Item>
              </ShortInputContainer>
              <Form.Item label={opDescription}>
                {getFieldDecorator('description', {
                  rules: []
                })(
                  <TextArea
                    rows={6}
                    placeholder='All the details about the request. You can use markdown here.'
                  />
                )}
              </Form.Item>
            </InputContainer>
          </FormGrid>

          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <TextHeadingBold>
                  Do you need any specific skills?
                </TextHeadingBold>
              </TitleContainer>
              <TextP>
                Does what you're asking for fit into any specific categories
                like programming, electronics, or robots? Enter them here to
                make it easier for volunteers to find you.
              </TextP>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={opTags}>
                {getFieldDecorator('tags', {
                  initialValue: [],
                  rules: []
                })(
                  <OpDetailTagsEditable
                    existingTags={this.props.existingTags}
                  />
                )}
              </Form.Item>
            </InputContainer>
          </FormGrid>
          <Divider />

          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <TextHeadingBold>Where and when? (Optional)</TextHeadingBold>
              </TitleContainer>
              <TextP>
                If you know when or where you need help, it makes it easier to
                find volunteers.
              </TextP>
            </DescriptionContainer>
            <InputContainer>
              <ShortInputContainer>
                <Form.Item label={opCommitment}>
                  {getFieldDecorator('duration', {
                    rules: [
                      {
                        required: false,
                        message: 'Commitment level is required'
                      }
                    ]
                  })(<Input placeholder='4 hours' />)}
                </Form.Item>
                <Form.Item label={opStartDate}>
                  {getFieldDecorator('startDate', {})(
                    <DatePicker showTime
                      disabledDate={this.disabledStartDate}
                      format='DD-MM-YYYY HH:mm:ss'
                      onChange={this.onStartDateChange}
                      style={{ width: '100%' }} />
                  )}
                </Form.Item>
                <Form.Item label={opEndDate}>
                  {getFieldDecorator('endDate', {})(
                    <DatePicker showTime
                      disabledDate={this.disabledEndDate}
                      format='DD-MM-YYYY HH:mm:ss'
                      onChange={this.onEndDateChange}
                      style={{ width: '100%' }} />
                  )}
                </Form.Item>
              </ShortInputContainer>
              <MediumInputContainer>
                <Form.Item label={opLocation}>
                  {getFieldDecorator('location', {
                    rules: [
                      {
                        required: true,
                        message: 'A region must be provided'
                      }
                    ]
                  })(<OpDetailLocation />)}
                </Form.Item>
              </MediumInputContainer>
            </InputContainer>
          </FormGrid>

          <Divider />

          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <TextHeadingBold>Add an image (Optional)</TextHeadingBold>
              </TitleContainer>
              <TextP>
                Requests with photos get more responses. If you don't have a
                photo leave blank and we will provide one based on the category.
              </TextP>
            </DescriptionContainer>
            <InputContainer>
              <MediumInputContainer>
                <Form.Item label={opImgUrl}>
                  {getFieldDecorator('imgUrl', {
                    rules: []
                  })(<Input />)}
                  <ImageUpload setImgUrl={this.setImgUrl} />
                </Form.Item>
              </MediumInputContainer>
            </InputContainer>
          </FormGrid>
          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <TextHeadingBold>Confirm request</TextHeadingBold>
              </TitleContainer>
              <TextP>Users can see active requests</TextP>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={opStatus}>
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: 'status is required' }]
                })(
                  <Radio.Group buttonStyle='solid'>
                    <Radio.Button value='draft'>Draft</Radio.Button>
                    <Radio.Button value='active'>Active</Radio.Button>
                    <Radio.Button value='done'>Done</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
              <Spacer />
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
            </InputContainer>
          </FormGrid>

          <Row>
            <Col
              style={{ textAlign: 'right' }}
              xs={{ span: 24, offset: 0 }}
              md={{ span: 8, offset: 12 }}
            />
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
    requestor: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string)
  }),
  me: PropTypes.shape({
    _id: PropTypes.string
  }),
  form: PropTypes.object,
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  existingTags: PropTypes.arrayOf(PropTypes.string).isRequired
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

      subtitle: Form.createFormField({
        ...props.op.subtitle,
        value: props.op.subtitle
      }),
      description: Form.createFormField({
        ...props.op.description,
        value: props.op.description
      }),
      duration: Form.createFormField({
        ...props.op.duration,
        value: props.op.duration
      }),
      location: Form.createFormField({
        ...props.op.location,
        value: props.op.location
      }),
      imgUrl: Form.createFormField({
        ...props.op.imgUrl,
        value: props.op.imgUrl
      }),
      status: Form.createFormField({
        ...props.op.status,
        value: props.op.status
      }),
      tags: Form.createFormField({
        ...props.op.tags,
        value: props.op.tags
      }),
      startDate: Form.createFormField({
        ...props.op.startDate,
        value: (props.op.startDate != null) ? moment(props.op.startDate) : null
      }),
      endDate: Form.createFormField({
        ...props.op.endDate,
        value: (props.op.endDate != null) ? moment(props.op.endDate) : null
      })
    }
  }
  // onValuesChange (_, values) {
  //   console.log('onValuesChange', values)
  // }
})(OpDetailForm)
