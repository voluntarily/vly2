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

const { TextArea } = Input

// get translated labels
const opTitle = (
  <span>
    <FormattedMessage
      id='OpOfferForm.Title'
      defaultMessage='Title'
      description='activity Title label in OpOfferForm Form'
    />
    &nbsp;
    <Tooltip title="Choose something interesting like 'Help to get setup with Video Conferencing' ">
      <Icon type='question-circle-o' />
    </Tooltip>
  </span>
)

const opSubtitle = (
  <span>
    {' '}
    <FormattedMessage
      id='OpOfferForm.Subtitle'
      defaultMessage='Subtitle'
      description='activity Subtitle label in OpOfferForm Form'
    />{' '}
    <Tooltip title="Choose something interesting like 'we want to build robots' ">
      <Icon type='question-circle-o' />
    </Tooltip>
  </span>
)
const opCommitment = (
  <span>
    <FormattedMessage
      id='OpOfferForm.Commitment'
      defaultMessage='Commitment'
      description='activity Commitment label in OpOfferForm Form'
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
      id='OpOfferForm.Location'
      defaultMessage='Location'
      description='activity Location label in OpOfferForm Form'
    />
    &nbsp;
    <Tooltip title='set the region to help find local volunteers'>
      <Icon type='question-circle-o' />
    </Tooltip>
  </span>
)
const opVenue = (
  <span>
    {' '}
    <FormattedMessage
      id='OpOfferForm.Venue'
      defaultMessage='Address'
      description='Venue label in OpOfferForm Form'
    />
    &nbsp;
    <Tooltip title='Enter the address where this takes place'>
      <Icon type='question-circle-o' />
    </Tooltip>
  </span>
)
const opOrganisation = (
  <span>
    {' '}
    <FormattedMessage
      id='OpOfferForm.Organisation'
      defaultMessage='Topic'
      description='label for Organisation offering the activity'
    />
    &nbsp;
    <Tooltip title='Which topic or group does this activity belong to?'>
      <Icon type='question-circle-o' />
    </Tooltip>
  </span>
)
const opDescription = (
  <span>
    {' '}
    <FormattedMessage
      id='OpOfferForm.Description'
      defaultMessage='Description'
      description='activity Description label in OpOfferForm Form'
    />
    &nbsp;
    <Tooltip title='Give a long description of what is needed and what people will be doing.'>
      <Icon type='question-circle-o' />
    </Tooltip>
  </span>
)
const opStartDate = (
  <span>
    {' '}
    <FormattedMessage
      id='OpOfferForm.StartDate'
      defaultMessage='Start Date'
      description='activity start date label in OpOfferForm Form'
    />
    &nbsp;
    <Tooltip title='Set a start date if the activity needs to be done at a specific time'>
      <Icon type='question-circle-o' />
    </Tooltip>
  </span>
)

const opEndDate = (
  <span>
    {' '}
    <FormattedMessage
      id='OpOfferForm.EndDate'
      defaultMessage='End Date'
      description='activity end date label in OpOfferForm Form'
    />
    &nbsp;
    <Tooltip title='Set an end date if the activity needs more than one day.'>
      <Icon type='question-circle-o' />
    </Tooltip>
  </span>
)

const opImgUrl = (
  <span>
    <FormattedMessage
      id='OpOfferForm.ImgUrl'
      defaultMessage='Image Link'
      description='activity Image URL label in OpOfferForm Form'
    />
    &nbsp;
    <Tooltip title="Choose something interesting like 'we want to build robots' ">
      <Icon type='question-circle-o' />
    </Tooltip>
  </span>
)

const opTags = (
  <FormattedMessage
    id='OpOfferForm.Tags'
    defaultMessage='Tags'
    description='Descriptions of general areas the activity relates to'
  />
)

class OpOfferForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      startDateValue: null,
      endDateValue: null
    }
    // this.setDescriptin = this.setDescription.bind(this)
    this.setImgUrl = this.setImgUrl.bind(this)
  }

  componentDidMount () {
    // // Call validateFields here to disable the submit button when on a blank form.
    // // empty callback supresses a default which prints to the console.
    // this.props.form.validateFields(['title']);
    const op = this.props.op
    this.setState({ startDateValue: op.date[0] })
    this.setState({ endDateValue: op.date[1] })
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
          const { startDateValue, endDateValue } = this.state
          op.date = [] // Dirty work around to not change schema
          op.date.push(startDateValue, endDateValue)
          op.name = values.name
          op.subtitle = values.subtitle
          op.tags = values.tags
          op.duration = values.duration
          op.location = values.location
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

  handleEndDateChange = value => {
    this.changeFormValue('endDateValue', value)
  }

  handleStartDateChange = value => {
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
      <div className='OpOfferForm'>
        <PageTitle>
          <h1>
            {isNewOp ? (
              <FormattedMessage
                id='OpOfferForm.Edit'
                description='Title for editing Ops'
                defaultMessage='Edit your activity'
              />
            ) : opType === OpportunityType.ASK ? (
              <FormattedMessage
                id='OpOfferForm.OfferForm.title.opCreateAsk'
                description='Title for creating request Ops'
                defaultMessage='Create an new request'
              />)
              : opType === OpportunityType.OFFER ? (
                <FormattedMessage
                  id='OpOfferForm.OfferForm.title.opCreateOffer'
                  description='Title for creating offering Ops'
                  defaultMessage='Create an new offering'
                />)
                : null}
          </h1>
          <h5>
            <FormattedMessage
              id='OpOfferForm.OfferForm.pagePrompt'
              description='subTitle for creating Ops'
              defaultMessage='Check and update the details below with a time frame and locality you are available for.'
            />
            {locked && (
              <p>
                <FormattedMessage
                  id='OpOfferForm.OfferForm.pageLockedPrompt'
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
                    id='OpOfferForm.OfferForm.Title.label'
                    description='Section label for op offer title'
                    defaultMessage='What are you offering?'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='OpOfferForm.OfferForm.Title.prompt'
                  description='Section prompt for op offer title'
                  defaultMessage='Before people can request help, they need to know what you are providing. Add a title and description that tell people how you can help them.'
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
                    id='OpOfferForm.OfferForm.location.label'
                    description='Section label for op location'
                    defaultMessage='Where and when?'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='OpOfferForm.OfferForm.location.prompt'
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
                  label={opStartDate}
                  name='Start date'
                >
                  {getFieldDecorator('startDate')(
                    <DatePicker
                      showTime
                      disabledDate={current => {
                        return (
                          moment().add(-1, 'days') >= current ||
                          moment().add(1, 'year') <= current
                        )
                      }}
                      format='DD-MM-YYYY HH:mm:ss'
                      onChange={this.handleStartDateChange}
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
                <Form.Item
                  label={opEndDate}
                  name='End date'
                >
                  {getFieldDecorator('endDate')(
                    <DatePicker
                      showTime
                      disabledDate={this.disabledEndDate}
                      format='DD-MM-YYYY HH:mm:ss'
                      onChange={this.handleEndDateChange}
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
              </ShortInputContainer>
              <MediumInputContainer>
                <Form.Item label={opLocation}>
                  {getFieldDecorator('location')(
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
                    id='OpOfferForm.OfferForm.tags.label'
                    description='Section label for op tags'
                    defaultMessage='Do you have any specific skills or resources?'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='OpOfferForm.OfferForm.tags.prompt'
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
                    id='OpOfferForm.OfferForm.sectionTitle.addImage'
                    defaultMessage='Add an image'
                    description='Title for photo upload section'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='OpOfferForm.OfferForm.sectionPrompt.addImage'
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
                    id='OpOfferForm.OfferForm.sectiontitle.ConfirmRequest'
                    defaultMessage='Confirm request'
                    description='Section title for the save and publish buttons'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='OpOfferForm..SaveInstructions'
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
                  id='OpOfferForm..cancel'
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
                  id='OpOfferForm..editSaveDraft'
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
                  id='OpOfferForm..editPublish'
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

OpOfferForm.propTypes = {
  op: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.string,
    duration: PropTypes.string,
    location: PropTypes.string,
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

      subtitle: Form.createFormField({
        value: props.op.subtitle
      }),
      description: Form.createFormField({
        value: props.op.description
      }),
      duration: Form.createFormField({
        value: props.op.duration
      }),
      location: Form.createFormField({
        value: props.op.location
      }),
      offerOrg: Form.createFormField({
        value: { key: props.op.offerOrg ? props.op.offerOrg._id : '' }
      }),
      imgUrl: Form.createFormField({
        value: props.op.imgUrl
      }),
      status: Form.createFormField({
        value: props.op.status
      }),
      tags: Form.createFormField({
        value: props.op.tags
      }),
      startDate: Form.createFormField({
        value: props.op.startDate != null ? moment(props.op.startDate) : null
      }),
      endDate: Form.createFormField({
        value: props.op.endDate != null ? moment(props.op.endDate) : null
      }),
      venue: Form.createFormField({
        value: props.op.venue || ''
      })
    }
  }

})(OpOfferForm)
