import { Button, Divider, Form, Icon, Input, Tooltip, Radio, Switch } from 'antd'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import RichTextEditor from '../Form/Input/RichTextEditor'
import ImageUpload from '../Upload/ImageUpload'
import FileUpload from '../File/FileUpload'
import TagInput from '../Form/Input/TagInput'
import OrgSelector from '../Org/OrgSelector'
import { DynamicFieldSet } from '../DynamicFieldSet/DynamicFieldSet'
import slug from 'limax'
import { ActivityFields, ActivityStatus } from '../../server/api/activity/activity.constants'

import {
  DescriptionContainer,
  FormGrid,
  InputContainer,
  MediumInputContainer,
  ShortInputContainer,
  TitleContainer
} from '../VTheme/FormStyles'
import PageTitle from '../LandingPageComponents/PageTitle'

const { TextArea } = Input

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

const isTest = process.env.NODE_ENV === 'test'

class ActDetailForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      input1Disabled: true,
      input2Disabled: true,
      option1: false,
      option2: false,
      totalVolunteerRequired: 1,
      volunteerPerStudent: 1
    }

    this.setImgUrl = this.setImgUrl.bind(this)
    // this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    // Call validateFields here to disable the submit button when on a blank form.
    // empty callback supresses a default which prints to the console.
    this.props.form.validateFields(() => {})
    if (this.props.act.volunteers === 0) {
      this.actRadio('option1')
    } else if (this.props.act.volunteers < 1) {
      this.actRadio('option2')
    } else {
      this.actRadio('option1')
    }
  }

  actRadio = event => {
    if (event === 'option1') {
      this.setState({
        input1Disabled: false,
        input2Disabled: true,
        option1: true,
        option2: false
      })
    } else {
      this.setState({
        input2Disabled: false,
        input1Disabled: true,
        option1: false,
        option2: true
      })
    }
  }

  handleChange = event => {
    const textname = event.target.name
    if (textname === 'resourceinput1') {
      this.setState({
        totalVolunteerRequired: event.target.value
      })
    } else {
      this.setState({
        volunteerPerStudent: event.target.value
      })
    }
  }

  setImgUrl = value => {
    this.props.form.setFieldsValue({ imgUrl: value })
  }

  onDocumentsChanged (documents) {
    this.props.form.setFieldsValue({
      documents: documents.map(document => ({
        filename: document.data.name,
        location: document.location
      }))
    })
  }

  onUploadingStatusChanged (isUploading) {
    this.setState({
      documentsUploading: isUploading
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const act = this.props.act // copy any non form values like _id
        act.time = values.time
        act.name = values.name
        act.slug = slug(act.name)
        act.subtitle = values.subtitle
        act.duration = values.duration
        act.resource = values.resource
        act.volunteers = !this.state.input1Disabled
          ? this.state.totalVolunteerRequired
          : 1 / this.state.volunteerPerStudent
        act.space = values.space
        act.equipment = values.equipment
        act.description = values.description
        act.offerOrg = values.offerOrg && values.offerOrg.key
        act.imgUrl = values.imgUrl === '' ? undefined : values.imgUrl
        act.documents = values.documents
        act.tags = values.tags
        act.locked = values.locked
        act.status = e.target.name === 'publish' ? ActivityStatus.ACTIVE : ActivityStatus.DRAFT
        // act.owner = (this.props.act.owner && this.props.op.owner._id) || this.props.me._id
        act.owner = this.props.me._id
        // TODO: [VP-305] should the owner of the activity be preserved or set to the last person who edits it?
        window.scrollTo(0, 0)
        this.props.onSubmit(this.props.act)
      }
    })
  }

  render () {
    // get translated labels
    const actTitle = (
      <span>
        <FormattedMessage
          id='actTitle'
          defaultMessage='Title'
          description='opportunity Title label in ActDetail Form'
        />
        &nbsp;
        <Tooltip title="Choose something interesting like 'we want to build robots' ">
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const actSubtitle = (
      <span>
        {' '}
        <FormattedMessage
          id='actSubtitle'
          defaultMessage='Subtitle'
          description='activity Subtitle label in ActDetail Form'
        />{' '}
        <Tooltip title="Choose something interesting like 'we want to build robots' ">
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const actCommitment = (
      <span>
        <FormattedMessage
          id='actCommitment'
          defaultMessage='Commitment'
          description='activity Commitment label in ActDetail Form'
        />
        &nbsp;
        <Tooltip title='How much time overall is likely to be required for the activity?'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )

    const actResource = (
      <span>
        {' '}
        <FormattedMessage
          id='actResource'
          defaultMessage='Resource'
          description='activity resource label in ActDetail Form'
        />
        &nbsp;
        <Tooltip title='Give a long description of what is needed and what people will be doing.'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const actEquipment = (
      <span>
        <FormattedMessage
          id='actEquipment'
          defaultMessage='Equipment'
          description='activity equipment label in ActDetail Form'
        />
        &nbsp;
        <Tooltip title='Make a list of any equipment or materials needed for this activity.'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const actSpace = (
      <span>
        {' '}
        <FormattedMessage
          id='actSpace'
          defaultMessage='Space Requirement'
          description='activity space label in ActDetail Form'
        />
        &nbsp;
        <Tooltip title='How much space is required to run an activity? Indoor or Outdoor activity?'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const actDescription = (
      <span>
        {' '}
        <FormattedMessage
          id='actDescription'
          defaultMessage='Description'
          description='activity description label in ActDetail Form'
        />
        &nbsp;
        <Tooltip title='Give a long description of what is needed and what people will be doing.'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const actImgUrl = (
      <span>
        <FormattedMessage
          id='actImgUrl'
          defaultMessage='Image Link'
          description='activity Image URL label in ActDetailForm'
        />
        &nbsp;
        <Tooltip title='Choose a picture that illustrates the activity, you can upload a picture or link to something on the Internet, Animated Gifs too.'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const actDocuments = (
      <span>
        <FormattedMessage
          id='actDocuments'
          defaultMessage='Documents'
          description='activity documents label in ActDetailForm'
        />
        &nbsp;
        <Tooltip title='Upload up to 5 pdf files that you would like to attach to this activity. These will be display on the activity for volunteers to read.'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const actOrganisation = (
      <span>
        {' '}
        <FormattedMessage
          id='actOrganisation'
          defaultMessage='Activity Organisation'
          description='label for Organisation offering the activity'
        />
        &nbsp;
        <Tooltip title='Which organisation is this activity for?'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const actTags = (
      <FormattedMessage
        id='actTags'
        defaultMessage='Tags'
        description='Descriptions of general areas the activity relates to'
      />
    )
    const actLock = (
      <span>
        {' '}
        <FormattedMessage
          id='actLock'
          defaultMessage='Lock Editable Fields'
          description='activity lock label in ActDetail Form'
        />
        &nbsp;
        <Tooltip title='Enable lock to prevent people from changing the title and image when the base a request on this activity'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form

    // Only show error after a field is touched.
    const titleError = isFieldTouched('name') && getFieldError('name')

    const durationError =
      isFieldTouched('duration') && getFieldError('duration')
    const orgMembership =
      this.props.me.orgMembership &&
      this.props.me.orgMembership.map(member => member.organisation)
    return (
      <div className='ActDetailForm'>
        <PageTitle>
          <h1>
            <FormattedMessage
              defaultMessage='Create an Activity'
              id='actDetailForm.Title.New'
              description='actdetailform title'
            />
          </h1>
          <h5>
            <FormattedMessage
              defaultMessage='Create a template that teachers can use to bring in volunteers'
              id='actDetailForm.Subtitle'
              description='actdetailform subtitle'
            />
          </h5>
        </PageTitle>
        <Form colon={false}>
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>
                  <FormattedMessage
                    defaultMessage='About this Activity'
                    id='actDetailForm.AboutSection.subtitle'
                    description='first section subtitle on actdetailform that asks for title and about details'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  defaultMessage='Attract people to this activity with a snappy name, use the subtitle to layout the basic idea.'
                  id='actDetailForm.AboutSection.instructions'
                  description='first section instructions on actdetailform that asks for title and about details'
                />
              </p>
            </DescriptionContainer>
            <InputContainer>
              <ShortInputContainer>
                <Form.Item
                  label={actTitle}
                  validateStatus={titleError ? 'error' : ''}
                  help={titleError || ''}
                >
                  {getFieldDecorator(ActivityFields.NAME, {
                    rules: [{ required: true, message: 'Title is required' }]
                  })(<Input placeholder='Title' maxLength='100' required />)}
                </Form.Item>

                <Form.Item label={actSubtitle}>
                  {getFieldDecorator(ActivityFields.SUBTITLE, {
                    rules: []
                  })(
                    <Input placeholder='short summary that appears on the listing.' />
                  )}
                </Form.Item>
              </ShortInputContainer>
              <Form.Item label={actDescription}>
                {getFieldDecorator(ActivityFields.DESCRIPTION, {
                  rules: []
                })(
                  isTest ? (
                    <TextArea
                      rows={20}
                      placeholder='All the details about the activity, you can use HTML here'
                    />
                  ) : (
                    <RichTextEditor />
                  )
                )}
              </Form.Item>
              {orgMembership && (
                <Form.Item label={actOrganisation}>
                  {getFieldDecorator(ActivityFields.OFFERORG)(
                    <OrgSelector orgs={orgMembership} />
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
                    defaultMessage='Topics'
                    id='actDetailForm.TagsSection.subtitle'
                    description='Tag section subtitle on actdetailform that asks for topics and outcomes'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  defaultMessage='Make this activity searchable by classifying it with subject, age group, and technology keywords.'
                  id='actDetailForm.TagsSection.instructions'
                  description='Tag section instructions on actdetailform that asks for title and about details'
                />
              </p>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={actTags}>
                {getFieldDecorator(ActivityFields.TAGS, {
                  initialValue: [],
                  rules: []
                })(<TagInput existingTags={this.props.existingTags} />)}
              </Form.Item>
            </InputContainer>
          </FormGrid>
          <Divider />

          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>
                  <FormattedMessage
                    defaultMessage='Requirements'
                    id='actDetailForm.ResourceSection.subtitle'
                    description='section subtitle on actdetail form for resources'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  defaultMessage='What is the time commitment?
                    How many people do you need to help?
                    What skills might they require?
                    Do you need a special space or location to work in?
                    Does this activity require special equipment?'
                  id='actDetailForm.ResourceSection.instructions'
                  description='section instructions on actdetail form for resources'
                />
              </p>
            </DescriptionContainer>
            <InputContainer>
              <ShortInputContainer>
                <Form.Item
                  label={actCommitment}
                  validateStatus={durationError ? 'error' : ''}
                  help={durationError || ''}
                >
                  {getFieldDecorator(ActivityFields.DURATION, {
                    rules: [
                      {
                        required: true,
                        message: 'Commitment level is required'
                      }
                    ]
                  })(<Input placeholder='4 hours' required />)}
                </Form.Item>
                <Form.Item label={actResource}>
                  {getFieldDecorator(ActivityFields.RESOURCE)(
                    <Input placeholder='5 people, classroom, projector' />
                  )}
                </Form.Item>
                <Form.Item>
                  <Radio
                    name='volunteer'
                    value='option1'
                    checked={this.state.option1}
                    onClick={this.actRadio.bind(this, 'option1')}
                  >
                    <FormattedMessage
                      id='act.detail.volunteercount'
                      defaultMessage='Total number of volunteers required'
                      description='label for field volunteer numbers required'
                    />
                  </Radio>
                  {getFieldDecorator('totalVolunteerRequired')(
                    <Input
                      name='resourceinput1'
                      onChange={this.handleChange}
                      disabled={this.state.input1Disabled}
                      placeholder='Select from 1 to 100'
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  <Radio
                    name='volunteer'
                    value='option2'
                    checked={this.state.option2}
                    onClick={this.actRadio.bind(this, 'option2')}
                  >
                    <FormattedMessage
                      id='act.detailform.volunteerratio'
                      defaultMessage='Number of students per volunteer'
                      description='label for field number of students per volunteer'
                    />
                  </Radio>
                  {getFieldDecorator('volunteerPerStudent')(
                    <Input
                      name='resourceinput2'
                      onChange={this.handleChange}
                      disabled={this.state.input2Disabled}
                      placeholder='Specify the number of students'
                    />
                  )}
                </Form.Item>
                <Form.Item label={actSpace}>
                  {getFieldDecorator(ActivityFields.SPACE)(
                    <Input name='space' placeholder='40 sqm' />
                  )}
                </Form.Item>
              </ShortInputContainer>
            </InputContainer>
          </FormGrid>

          <Divider />

          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>
                  <FormattedMessage
                    id='actDetailForm.addEquipment.title'
                    defaultMessage='Do you need any equipment or materials for this activity? (Optional)'
                    description='subtitle for add equipment section in act detail form'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='actDetailForm.addEquipment.instructions'
                  defaultMessage='Let volunteers and businesses know what you need to make the opportunity happen.'
                  description='instructions to add equipment in act detail form'
                />
              </p>
            </DescriptionContainer>
            <InputContainer>
              <MediumInputContainer>
                <Form.Item label={actEquipment}>
                  <DynamicFieldSet
                    form={this.props.form}
                    field='equipment'
                    placeholder='Equipment description'
                    validationMessage={
                      <FormattedMessage
                        id='actDetailForm.addEquipment.validationMessage'
                        defaultMessage='Add an equipment or remove field'
                      />
                    }
                    addItemText='Add equipment'
                  />
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
                    id='actDetailForm.addImageSection.title'
                    defaultMessage='Add an image'
                    description='subtitle for add image section in act detail form'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='actDetailForm.addImageSection.instructions'
                  defaultMessage="Activities with illustrations get more responses. If you don't have a photo click suggest and we can provide one based on the tags."
                  description='instructions for add image section in actdetail form'
                />
              </p>
              <img
                style={{ width: '50%', float: 'right' }}
                src={this.props.act.imgUrl}
                alt=''
              />
            </DescriptionContainer>
            <InputContainer>
              <MediumInputContainer>
                <Form.Item label={actImgUrl}>
                  {getFieldDecorator(ActivityFields.IMG_URL, {
                    rules: []
                  })(<Input />)}
                  <ImageUpload setImgUrl={this.setImgUrl} />
                </Form.Item>
                {/* // TODO: [VP-304] add suggest photo button to ActDetailForm */}
              </MediumInputContainer>
            </InputContainer>
          </FormGrid>
          <Divider />

          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>
                  <FormattedMessage
                    id='actDetailForm.addDocumentsSection.title'
                    defaultMessage='Documents'
                    description='subtitle for the documents section in act detail form'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='actDetailForm.addDocumentsSection.instructions'
                  defaultMessage='Upload any PDF documents relativant to the activity that you would like volunteers to refer to (such as a Health and Safety pdf)'
                  description='instructions for instructions section in actdetail form'
                />
              </p>
            </DescriptionContainer>
            <InputContainer>
              <MediumInputContainer>
                <Form.Item label={actDocuments}>
                  {getFieldDecorator(ActivityFields.DOCUMENTS)(
                    <FileUpload
                      maxNumberOfFiles={5}
                      allowedFileTypes={['.pdf']}
                      files={this.props.act.documents}
                      onFilesChanged={this.onDocumentsChanged.bind(this)}
                      onUploadingStatusChanged={this.onUploadingStatusChanged.bind(this)}
                    />)}
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
                    id='actDetailForm.SaveActivityButton'
                    defaultMessage='Save Activity'
                    description='Subtitle for save activity section on ActDetailForm'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='act.SaveInstructions'
                  defaultMessage='Save as draft will allow you to preview the activity while Publish will make it available to everyone to view.'
                  description='Instructions for save and publish on activity details form'
                />
              </p>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={actLock}>
                {getFieldDecorator(ActivityFields.LOCKED, {
                  valuePropName: 'checked'
                })(
                  <Switch
                    checkedChildren={<Icon type='check' />}
                    unCheckedChildren={<Icon type='close' />}
                  />)}
              </Form.Item>

              <Button
                id='cancelActBtn'
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
                id='saveActBtn'
                name='save'
                // htmlType='submit'
                onClick={this.handleSubmit}
                disabled={hasErrors(getFieldsError()) || this.state.documentsUploading}
                style={{ marginLeft: 8 }}
              >
                <FormattedMessage
                  id='act.editSaveDraft'
                  defaultMessage='Save as draft'
                  description='Label for save as draft button on activity details form'
                />
              </Button>
              <Button
                id='publishActBtn'
                name='publish'
                type='primary'
                // htmlType='submit'
                onClick={this.handleSubmit}
                disabled={hasErrors(getFieldsError()) || this.state.documentsUploading}
                style={{ marginLeft: 8 }}
              >
                <FormattedMessage
                  id='act.editPublish'
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

ActDetailForm.propTypes = {
  act: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.string,
    documents: PropTypes.array,
    resource: PropTypes.string,
    volunteers: PropTypes.number,
    space: PropTypes.string,
    equipment: PropTypes.Array,
    time: PropTypes.Array,
    duration: PropTypes.string,
    status: PropTypes.string,
    owner: PropTypes.string,
    offerOrg: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string
      })
    ])
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
  existingTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
  // dispatch: PropTypes.func.isRequired,
}

export default Form.create({
  name: 'activity_detail_form',
  mapPropsToFields ({ act }) {
    let totalVolunteerRequired
    let volunteerPerStudent
    if (act.volunteers === 0) {
      totalVolunteerRequired = 0
    } else if (act.volunteers >= 1) {
      totalVolunteerRequired = act.volunteers
    } else if (act.volunteers < 1) {
      volunteerPerStudent = Math.round(1 / act.volunteers)
    }
    return {
      name: Form.createFormField({ value: act.name }),
      subtitle: Form.createFormField({ value: act.subtitle }),
      description: Form.createFormField({ value: act.description }),
      offerOrg: Form.createFormField({ value: { key: act.offerOrg ? act.offerOrg._id : '' } }),
      duration: Form.createFormField({ value: act.duration }),
      location: Form.createFormField({ value: act.location }),
      imgUrl: Form.createFormField({ value: act.imgUrl }),
      documents: Form.createFormField({ value: act.documents }),
      time: Form.createFormField({ ...act.time, value: act.time }),
      resource: Form.createFormField({ value: act.resource }),
      status: Form.createFormField({ value: act.status }),
      tags: Form.createFormField({ value: act.tags }),
      totalVolunteerRequired: Form.createFormField({ value: totalVolunteerRequired }),
      volunteerPerStudent: Form.createFormField({ value: volunteerPerStudent }),
      space: Form.createFormField({ value: act.space }),
      equipment: Form.createFormField({ value: act.equipment }),
      locked: Form.createFormField({ value: act.locked })
    }
  }
})(ActDetailForm)
