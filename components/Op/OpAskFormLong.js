import { Button, DatePicker, Divider, Form, Icon, Input, Tooltip } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import PageTitle from '../LandingPageComponents/PageTitle.js'
import { OpportunityStatus, OpportunityType } from '../../server/api/opportunity/opportunity.constants'
import LocationSelector from '../Form/Input/LocationSelector'
import RichTextEditor from '../Form/Input/RichTextEditor'
import TagInput from '../Form/Input/TagInput'
import OrgSelector from '../Org/OrgSelector'
import ImageUpload from '../Upload/ImageUpload'
import { DescriptionContainer, FormGrid, InputContainer, MediumInputContainer, ShortInputContainer, TitleContainer } from '../VTheme/FormStyles'
import { QuestionCircleOutlined } from '@ant-design/icons'
const { TextArea } = Input
const { RangePicker } = DatePicker

// get translated labels
const opTitle = (
  <span>
    <FormattedMessage
      id='OpAskFormLong.Title'
      defaultMessage='Title'
      description='activity Title label in OpAskForm Form'
    />
    &nbsp;
    <Tooltip title="Choose something interesting like 'Help me get setup with Video Conferencing' ">
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)
const opSubtitle = (
  <span>
    {' '}
    <FormattedMessage
      id='OpAskFormLong.Subtitle'
      defaultMessage='Subtitle'
      description='activity Subtitle label in OpAskForm Form'
    />{' '}
    <Tooltip title="Choose something interesting like 'we want to build robots' ">
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)
const opCommitment = (
  <span>
    <FormattedMessage
      id='OpAskFormLong.Commitment'
      defaultMessage='Commitment'
      description='activity Commitment label in OpAskForm Form'
    />
    &nbsp;
    <Tooltip title='How much time overall is likely to be required for the activity?'>
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)
const opLocation = (
  <span>
    {' '}
    <FormattedMessage
      id='OpAskFormLong.Location'
      defaultMessage='Location'
      description='activity Location label in OpAskForm Form'
    />
    &nbsp;
    <Tooltip title='set the region to help find local volunteers'>
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)
const opVenue = (
  <span>
    {' '}
    <FormattedMessage
      id='OpAskFormLong.Venue'
      defaultMessage='Address'
      description='Venue label in OpAskForm Form'
    />
    &nbsp;
    <Tooltip title='Enter the address where this takes place'>
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)
const opOrganisation = (
  <span>
    {' '}
    <FormattedMessage
      id='OpAskFormLong.Organisation'
      defaultMessage='Offer Group'
      description='label for Organisation offering the activity'
    />
    &nbsp;
    <Tooltip title='Which organisation is this activity for?'>
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)
const opDescription = (
  <span>
    {' '}
    <FormattedMessage
      id='OpAskFormLong.Description'
      defaultMessage='Description'
      description='activity Description label in OpAskForm Form'
    />
    &nbsp;
    <Tooltip title='Give a long description of what is needed and what people will be doing.'>
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)
const opDateRange = (
  <span>
    {' '}
    <FormattedMessage
      id='OpAskFormLong.DateRange'
      defaultMessage='Date Range'
      description='activity date range label in OpAskForm Form'
    />
    &nbsp;
    <Tooltip title='Set a date range if the activity needs more than one day.'>
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)
const opImgUrl = (
  <span>
    <FormattedMessage
      id='OpAskFormLong.ImgUrl'
      defaultMessage='Image Link'
      description='activity Image URL label in OpAskForm Form'
    />
    &nbsp;
    <Tooltip title="Choose something interesting like 'we want to build robots' ">
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)
const opTags = (
  <FormattedMessage
    id='OpAskFormLong.Tags'
    defaultMessage='Tags'
    description='Descriptions of general areas the activity relates to'
  />
)

class OpAskFormLong extends Component {
  constructor (props) {
    super(props)

    this.state = {
      dateRangeValue: null
    }
    // this.setDescriptin = this.setDescription.bind(this)
    this.setImgUrl = this.setImgUrl.bind(this)
  }

  componentDidMount () {
    // // Call validateFields here to disable the submit button when on a blank form.
    // // empty callback supresses a default which prints to the console.
    // this.props.form.validateFields(['title']);
    const op = this.props.op
    this.setState({ dateRangeValue: op.date })
  }

  setImgUrl = value => {
    this.props.form.setFieldsValue({ imgUrl: value })
  }

  handleSubmit = (draftOrPublish) => {
    this.setState({
      requiredForPublish: draftOrPublish === 'publish'
    }
    , () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const op = this.props.op
          const { dateRangeValue } = this.state
          op.date = dateRangeValue
          op.name = values.name
          op.subtitle = values.subtitle
          op.tags = values.tags
          op.duration = values.duration
          op.locations = values.locations
          op.offerOrg = values.offerOrg && values.offerOrg.key
          op.description = values.description
          op.imgUrl = values.imgUrl
          op.venue = values.venue
          op.status = draftOrPublish === 'publish'
            ? OpportunityStatus.ACTIVE
            : OpportunityStatus.DRAFT
          op.requestor =
            (this.props.op.requestor && this.props.op.requestor._id) ||
            this.props.me._id

          this.props.onSubmit(this.props.op)
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

  handleDateRangeChange = value => {
    this.changeFormValue('dateRangeValue', value)
  }

  render () {
    const op = this.props.op
    const isTest = process.env.NODE_ENV === 'test'
    const locked = op.fromActivity && op.fromActivity.locked
    const lockfields = locked ? op.fromActivity.lockfields : []
    // const lockedField = field => locked && lockfields.includes(field)
    const lockedField = field => {
      return locked && lockfields.includes(field)
    }
    const {
      getFieldDecorator
    } = this.props.form

    // Only show error after a field is touched.
    // const nameError = isFieldTouched('name') && getFieldError('name')
    const isNewOp = op._id
    const orgMembership =
      this.props.me.orgMembership &&
      this.props.me.orgMembership.map(member => member.organisation)
    const opType = op.type
    return (
      <div className='OpAskForm'>
        <PageTitle>
          <h1>
            {isNewOp ? (
              <FormattedMessage
                id='OpAskFormLong.Edit'
                description='Title for editing Ops'
                defaultMessage='Edit your activity'
              />
            ) : opType === OpportunityType.ASK ? (
              <FormattedMessage
                id='OpAskFormLong.AskForm.title.opCreateAsk'
                description='Title for creating request Ops'
                defaultMessage='Create an new request'
              />)
              : opType === OpportunityType.OFFER ? (
                <FormattedMessage
                  id='OpAskFormLong.AskForm.title.opCreateOffer'
                  description='Title for creating offering Ops'
                  defaultMessage='Create an new offering'
                />)
                : null}
          </h1>
          <h5>
            <FormattedMessage
              id='OpAskFormLong.AskForm.pagePrompt'
              description='subTitle for creating Ops'
              defaultMessage='Check and update the details below with a time frame and locality you are when you can receive help.'
            />
            {locked && (
              <p>
                <FormattedMessage
                  id='OpAskFormLong.AskForm.pageLockedPrompt'
                  description='Message if some fields are locked'
                  defaultMessage='Some fields have been disabled by the activity template.'
                />
              </p>
            )}
          </h5>
        </PageTitle>
        <Divider />
        <Form colon={false}>

          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>
                  <FormattedMessage
                    id='OpAskFormLong.AskForm.Title.label'
                    description='Section label for opask'
                    defaultMessage='What are you looking for?'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='OpAskFormLong.AskForm.Title.prompt'
                  description='Section prompt for opask'
                  defaultMessage='Before our skilled volunteers get involved, they need to know how they can help. Add a title and description that tell volunteers how they can help you.'
                />
              </p>
            </DescriptionContainer>
            <InputContainer>
              <ShortInputContainer>
                <Form.Item
                  label={opTitle}
                  name='Title'
                >
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Name is required' }]
                  })(
                    <Input
                      className='name' placeholder='name' maxLength={100}
                      disabled={lockedField('name')}
                    />)}
                </Form.Item>

                <Form.Item
                  label={opSubtitle}
                  name='Subtitle'
                >
                  {getFieldDecorator('subtitle', {
                    rules: [{ required: this.state.requiredForPublish, message: 'Subtitle is required' }]
                  })(
                    <Input
                      className='subtitle' placeholder='short summary that appears on the listing.'
                      disabled={lockedField('subtitle')}
                    />
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
                      placeholder='All the details about the request.'
                      disabled={lockedField('description')}
                    />
                  ) : (
                    <RichTextEditor />
                  )
                )}
              </Form.Item>
              {orgMembership && (
                <Form.Item label={opOrganisation}>
                  {getFieldDecorator('offerOrg', {
                    rules: [{ required: true, message: 'Please select organisation' }]
                  })(
                    <OrgSelector className='organisation' orgs={orgMembership} />
                  )}
                </Form.Item>
              )}
            </InputContainer>
          </FormGrid>
          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>
                  <FormattedMessage
                    id='OpAskFormLong.AskForm.location.label'
                    description='Section label for op location'
                    defaultMessage='Where and when?'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='OpAskFormLong.AskForm.location.prompt'
                  description='Section prompt for op location'
                  defaultMessage='More skilled volunteers will offer to help you if you know when, or where you need help.'
                />
              </p>
            </DescriptionContainer>
            <InputContainer>
              <ShortInputContainer>
                <Form.Item
                  label={opCommitment}
                  name='Commitment'
                >
                  {getFieldDecorator('duration', {
                    rules: [
                      {
                        required: this.state.requiredForPublish,
                        message: 'Commitment level is required'
                      }
                    ]
                  })(<Input className='commitment' placeholder='4 hours' />)}
                </Form.Item>
                <Form.Item
                  label={opDateRange}
                  name='Date range'
                >
                  {getFieldDecorator('dateRange')(
                    <RangePicker
                      disabledDate={current => {
                        return (
                          moment().add(-1, 'days') >= current ||
                          moment().add(1, 'year') <= current
                        )
                      }}
                      format='DD-MM-YYYY'
                      onChange={this.handleDateRangeChange}
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
              </ShortInputContainer>
              <MediumInputContainer>
                <Form.Item label={opLocation}>
                  {getFieldDecorator('locations')(
                    <LocationSelector
                      existingLocations={this.props.existingLocations}
                    />
                  )}
                </Form.Item>
                <Form.Item label={opVenue}>
                  {getFieldDecorator('venue')(<Input placeholder='Venue' />
                  )}
                </Form.Item>
              </MediumInputContainer>
            </InputContainer>
          </FormGrid>

          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>
                  <FormattedMessage
                    id='OpAskFormLong.AskForm.tags.label'
                    description='Section label for op tags'
                    defaultMessage='Do you have any specific skills or resources?'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='OpAskFormLong.AskForm.tags.prompt'
                  description='Section prompt for op tags'
                  defaultMessage='Does what you are asking for fit into any specific categories like programming, electronics, or robots? Enter them here to make it easier for volunteers to find you.'
                />
              </p>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={opTags}>
                {getFieldDecorator('tags')(<TagInput existingTags={this.props.existingTags} />)}
              </Form.Item>
            </InputContainer>
          </FormGrid>

          <Divider />

          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>
                  <FormattedMessage
                    id='OpAskFormLong.AskForm.sectionTitle.addImage'
                    defaultMessage='Add an image'
                    description='Title for photo upload section'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='OpAskFormLong.AskForm.sectionPrompt.addImage'
                  defaultMessage='Requests with photos get more responses. Upload or link to a picture that represents this activity.'
                  description='Prompt for photo upload section'
                />

              </p>
              <img
                style={{ width: '50%', float: 'right' }}
                src={op.imgUrl}
                alt='current image'
              />
            </DescriptionContainer>
            <InputContainer>
              <MediumInputContainer>
                <Form.Item label={opImgUrl}>
                  {getFieldDecorator('imgUrl', {
                    rules: [{ required: this.state.requiredForPublish, message: 'Please upload an image' }]
                  })(
                    <Input
                      disabled={lockedField('imgUrl')}
                    />)}
                  {!lockedField('imgUrl') && <ImageUpload setImgUrl={this.setImgUrl} />}
                </Form.Item>
              </MediumInputContainer>
            </InputContainer>
          </FormGrid>
          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>
                  <FormattedMessage
                    id='OpAskFormLong.AskForm.sectiontitle.ConfirmRequest'
                    defaultMessage='Confirm request'
                    description='Section title for the save and publish buttons'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='OpAskFormLong..SaveInstructions'
                  defaultMessage='Save as Draft will allow you to preview the request while Publish will make it available to everyone to view.'
                  description='Instructions for save and publish on activity details form'
                />
              </p>
            </DescriptionContainer>
            <InputContainer>
              <Button
                id='cancelOpBtn'
                type='secondary'
                htmlType='button'
                onClick={this.props.onCancel}
              >
                <FormattedMessage
                  id='OpAskFormLong..cancel'
                  defaultMessage='Cancel'
                  description='Label for cancel button on activity details form'
                />
              </Button>
              <Button
                id='saveOpBtn'
                name='save'
                onClick={() => this.handleSubmit('draft')}
                style={{ marginLeft: 8 }}
              >
                <FormattedMessage
                  id='OpAskFormLong..editSaveDraft'
                  defaultMessage='Save as draft'
                  description='Label for save as draft button on activity details form'
                />
              </Button>
              <Button
                id='publishOpBtn'
                name='publish'
                type='primary'
                onClick={() => this.handleSubmit('publish')}
                style={{ marginLeft: 8 }}
              >
                <FormattedMessage
                  id='OpAskFormLong..editPublish'
                  defaultMessage='Publish'
                  description='Label for submit button on activity details form'
                />
              </Button>
            </InputContainer>
          </FormGrid>
        </Form>
      </div>
    )
  }
}

OpAskFormLong.propTypes = {
  op: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.string,
    duration: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.string),
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
  existingLocations: PropTypes.arrayOf(PropTypes.string).isRequired
  // dispatch: PropTypes.func.isRequired,
}

export default Form.create({
  name: 'opportunity_detail_form',
  mapPropsToFields (props) {
    return {
      name: Form.createFormField({ ...props.op.name, value: props.op.name }),
      subtitle: Form.createFormField({ value: props.op.subtitle }),
      description: Form.createFormField({ value: props.op.description }),
      duration: Form.createFormField({ value: props.op.duration }),
      locations: Form.createFormField({ value: props.op.locations }),
      offerOrg: Form.createFormField({ value: { key: props.op.offerOrg ? props.op.offerOrg._id : '' } }),
      imgUrl: Form.createFormField({ value: props.op.imgUrl }),
      status: Form.createFormField({ value: props.op.status }),
      tags: Form.createFormField({ value: props.op.tags }),
      dateRange: Form.createFormField({
        value: props.op.date != null ? [moment((props.op.date)[0]), moment((props.op.date)[1])] : null
      }),
      venue: Form.createFormField({ value: props.op.venue || '' })
    }
  }

})(OpAskFormLong)
