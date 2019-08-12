import { Button, DatePicker, Divider, Form, Icon, Input, Tooltip } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import RichTextEditor from '../Form/Input/RichTextEditor'
import ImageUpload from '../UploadComponent/ImageUploadComponent'
import { TextHeadingBold, TextP } from '../VTheme/VTheme'
import { OpportunityStatus } from '../../server/api/opportunity/opportunity.constants'
import TagInput from '../Form/Input/TagInput'
import LocationSelector from '../Form/Input/LocationSelector'
import {
  DescriptionContainer,
  FormGrid,
  InputContainer,
  MediumInputContainer,
  ShortInputContainer,
  TitleContainer
} from '../VTheme/FormStyles'
import PageTitle from '../../components/LandingPageComponents/PageTitle.js'
const { TextArea } = Input

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
    this.setDescription = this.setDescription.bind(this)
    this.setImgUrl = this.setImgUrl.bind(this)
  }

  componentDidMount () {
    // Call validateFields here to disable the submit button when on a blank form.
    // empty callback supresses a default which prints to the console.
    this.props.form.validateFields()
    this.setState({ startDateValue: this.props.op.date[0] })
    this.setState({ endDateValue: this.props.op.date[1] })
  }

  setDescription (value) {
    this.props.form.setFieldsValue({ description: value })
  }
  setImgUrl = value => {
    this.props.form.setFieldsValue({ imgUrl: value })
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

        op.status =
          e.target.name === 'publish'
            ? OpportunityStatus.ACTIVE
            : OpportunityStatus.DRAFT
        op.requestor =
          (this.props.op.requestor && this.props.op.requestor._id) ||
          this.props.me._id

        this.props.onSubmit(this.props.op)
      } else {
        // console.log('field validation error:', err)
      }
    })
  }

  changeFormValue = (state, value) => {
    this.setState({
      [state]: value
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

  render () {
    const isTest = process.env.NODE_ENV === 'test'

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
        <Tooltip title='How much time overall is likely to be required for the activity?'>
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
        <Tooltip title='set the region to help find local volunteers'>
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
        <Tooltip title='Give a long description of what is needed and what people will be doing. You can paste HTML or Markdown here.'>
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
    const isNewOp = this.props.op._id
    return (
      <div className='OpDetailForm'>
        <PageTitle>
          <h1>
            {isNewOp ? (
              <FormattedMessage
                id='opEdit'
                description='Title for editing Ops'
              />
            ) : (
              <FormattedMessage
                id='opCreate'
                description='Title for creating Ops'
              />
            )}{' '}
            a request
          </h1>
          <p>
            <FormattedMessage
              id='opdetail.pagesubtitle'
              description='subTitle for creating Ops'
              defaultMessage='Ask volunteers for assistance with anything related to tech - there
                are (get number) of volunteers looking for opportunities to help out'
            />
          </p>
        </PageTitle>
        <Divider />
        <Form hideRequiredMark colon={false}>
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
                  isTest ? (
                    <TextArea
                      rows={20}
                      placeholder='All the details about the request. You can use markdown here.'
                    />
                  ) : (
                    <RichTextEditor onChange={this.setAbout} />
                  )
                )}
              </Form.Item>
            </InputContainer>
          </FormGrid>

          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <TextHeadingBold>
                  Do you need any specific skills? (optional)
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
                  <TagInput
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
                <TextHeadingBold>Where and when? (optional)</TextHeadingBold>
              </TitleContainer>
              <TextP>
                More skilled volunteers will offer to help you if you know when,
                or where you need help.
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
                    <DatePicker
                      showTime
                      disabledDate={(current) => {
                        return moment().add(-1, 'days') >= current ||
                             moment().add(1, 'year') <= current
                      }}
                      format='DD-MM-YYYY HH:mm:ss'
                      onChange={this.onStartDateChange}
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
                <Form.Item label={opEndDate}>
                  {getFieldDecorator('endDate', {})(
                    <DatePicker
                      showTime
                      disabledDate={this.disabledEndDate}
                      format='DD-MM-YYYY HH:mm:ss'
                      onChange={this.onEndDateChange}
                      style={{ width: '100%' }}
                    />
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
                  })(
                    <LocationSelector
                      existingLocations={this.props.existingLocations}
                    />
                  )}
                </Form.Item>
              </MediumInputContainer>
            </InputContainer>
          </FormGrid>

          <Divider />

          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <TextHeadingBold>Add an image (optional)</TextHeadingBold>
              </TitleContainer>
              <TextP>
                Requests with photos get more responses. If you don't have a
                photo leave blank and we will provide one based on the category.
              </TextP>
              <img
                style={{ width: '50%', float: 'right' }}
                src={this.props.op.imgUrl}
                alt='current image'
              />
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
              <TextP>
                <FormattedMessage
                  id='op.SaveInstructions'
                  defaultMessage='Save as Draft will allow you to preview the request while Publish will make it available to everyone to view.'
                  description='Instructions for save and publish on opportunity details form'
                />
              </TextP>
            </DescriptionContainer>
            <InputContainer>
              <Button
                id='cancelOpBtn'
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
                id='saveOpBtn'
                name='save'
                // htmlType='submit'
                onClick={this.handleSubmit}
                disabled={hasErrors(getFieldsError())}
                style={{ marginLeft: 8 }}
              >
                <FormattedMessage
                  id='op.editSaveDraft'
                  defaultMessage='Save as draft'
                  description='Label for save as draft button on opportunity details form'
                />
              </Button>
              <Button
                id='publishOpBtn'
                name='publish'
                type='primary'
                // htmlType='submit'
                onClick={this.handleSubmit}
                disabled={hasErrors(getFieldsError())}
                style={{ marginLeft: 8 }}
              >
                <FormattedMessage
                  id='op.editPublish'
                  defaultMessage='Publish'
                  description='Label for submit button on opportunity details form'
                />
              </Button>
            </InputContainer>
          </FormGrid>

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

    // requestor: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        tag: PropTypes.string.isRequired,
        _id: PropTypes.string
      })
    )
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
  existingTags: PropTypes.arrayOf(PropTypes.shape({
    tag: PropTypes.string.isRequired,
    _id: PropTypes.string
  })).isRequired,
  existingLocations: PropTypes.arrayOf(PropTypes.string).isRequired
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
        value: props.op.startDate != null ? moment(props.op.startDate) : null
      }),
      endDate: Form.createFormField({
        ...props.op.endDate,
        value: props.op.endDate != null ? moment(props.op.endDate) : null
      })
    }
  }
  // onValuesChange (_, values) {
  //   console.log('onValuesChange', values)
  // }
})(OpDetailForm)
