import { Button, Divider, Form, Icon, Input, Tooltip, Radio } from 'antd'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import RichTextEditor from '../Form/Input/RichTextEditor'
import ImageUpload from '../UploadComponent/ImageUploadComponent'
import { H3Bold, P } from '../VTheme/VTheme'
import TagInput from '../Form/Input/TagInput'

import {
  DescriptionContainer,
  FormGrid,
  InputContainer,
  MediumInputContainer,
  ShortInputContainer,
  TitleContainer
} from '../VTheme/FormStyles'
import FormItem from 'antd/lib/form/FormItem'

const { TextArea } = Input

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class ActDetailForm extends Component {
  constructor (props) {
    super(props)
    this.setDescription = this.setDescription.bind(this)
    this.setImgUrl = this.setImgUrl.bind(this)
    this.state = {
      input1Enabled: false,
      input2Enabled: true,
      radioCheck1: true,
      radioCheck2: false,
      totalVolunteerRequired: 1,
      volunteerPerStudent: 1
    }
    this.change = this.change.bind(this)
  }

  componentDidMount () {
    // Call validateFields here to disable the submit button when on a blank form.
    // empty callback supresses a default which prints to the console.
    this.props.form.validateFields(() => { })
  }
  actRadio = (event) => {
    if (event === 2) {
      this.setState({
        input1Enabled: true,
        input2Enabled: false,
        radioCheck1: false,
        radioCheck2: true
      })
    } else {
      this.setState({
        input1Enabled: false,
        input2Enabled: true,
        radioCheck2: false,
        radioCheck1: true
      })
    }
  }
  change = (event) => {
    this.setState({
      // [event.target.name]: event.target.value,
      totalVolunteerRequired: event.target.value,
      volunteerPerStudent: event.target.value
    })
  }
  setDescription (value) {
    this.props.form.setFieldsValue({ description: value })
  }
  setImgUrl = (value) => {
    this.props.form.setFieldsValue({ imgUrl: value })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const act = this.props.act
        act.time = values.time
        act.name = values.name
        act.subtitle = values.subtitle
        act.duration = values.duration
        act.resource = values.resource
        act.volunteers = this.state.totalVolunteerRequired || this.state.volunteerPerStudent
        act.description = values.description
        act.imgUrl = values.imgUrl
        act.tags = values.tags
        act.status = e.target.name === 'publish' ? 'active' : 'draft'
        // act.owner = (this.props.act.owner && this.props.op.owner._id) || this.props.me._id
        act.owner = this.props.me._id
        // TODO: [VP-305] should the owner of the activity be preserved or set to the last person who edits it?
        window.scrollTo(0, 0)
        this.props.onSubmit(this.props.act)
      } else {
        // console.log('field validation error:', err)
      }
    })
  }

  render () {
    const isTest = (process.env.NODE_ENV === 'test')

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
        <Tooltip title='Give a long description of what is needed and what people will be doing. You can paste HTML or Markdown here.'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const actResource1 = (
      <span>
        {' '}
        <FormattedMessage
          id='actResource1'
          defaultMessage='Total number of volunteers required'
          description='A text field in actDetail form'
        />
      </span>
    )
    const actResource2 = (
      <span>
        {' '}
        <FormattedMessage
          id='actResource2'
          defaultMessage='Number of volunteers per student'
          description='A text field in actDetail form'
        />
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
        <Tooltip title='Give a long description of what is needed and what people will be doing. You can paste HTML or Markdown here.'>
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

    const actTags = (
      <FormattedMessage
        id='actTags'
        defaultMessage='Tags'
        description='Descriptions of general areas the activity relates to'
      />
    )
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched
    } = this.props.form

    // Only show error after a field is touched.
    const titleError = isFieldTouched('name') && getFieldError('name')

    return (
      <div className='ActDetailForm'>
        <Form hideRequiredMark colon={false}>
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <H3Bold>Tell everyone about this Activity?</H3Bold>
              </TitleContainer>
              <P>
                Attract people to this activitiy with a snappy name, use the subtitle to layout the basic idea.
              </P>
            </DescriptionContainer>
            <InputContainer>
              <ShortInputContainer>
                <Form.Item
                  label={actTitle}
                  validateStatus={titleError ? 'error' : ''}
                  help={titleError || ''}
                >
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Title is required' }]
                  })(<Input placeholder='Title' />)}
                </Form.Item>

                <Form.Item label={actSubtitle}>
                  {getFieldDecorator('subtitle', {
                    rules: []
                  })(
                    <Input placeholder='short summary that appears on the listing.' />
                  )}
                </Form.Item>
              </ShortInputContainer>
              <Form.Item label={actDescription}>
                {getFieldDecorator('description', {
                  rules: []
                })(
                  isTest
                    ? <TextArea rows={20} placeholder='All the details about the activity, you can use HTML or Markdown here' />
                    : <RichTextEditor onChange={this.setAbout} />
                )}
              </Form.Item>
            </InputContainer>
          </FormGrid>

          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <H3Bold>
                  What topics and learning outcomes does this activity cover?
                </H3Bold>
              </TitleContainer>
              <P>
                Make this activity searchable by classifying it with subject, age group, and technology keywords.
              </P>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={actTags}>
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
                <H3Bold>What resources are required to run this activity?</H3Bold>
              </TitleContainer>
              <P>
                What is the time commitment?<br />
                How many people do you need to help?<br />
                What skills might they require?<br />
                Do you need a special space or location to work in?<br />
                Does this activity require special equipment?
              </P>
            </DescriptionContainer>
            <InputContainer>
              <ShortInputContainer>
                <Form.Item label={actCommitment}>
                  {getFieldDecorator('duration', {
                    rules: [
                      {
                        required: true,
                        message: 'Commitment level is required'
                      }
                    ]
                  })(<Input placeholder='4 hours' />)}
                </Form.Item>
                <Form.Item label={actResource}>
                  {getFieldDecorator('resource')(<Input placeholder='5 people, classroom, projector' />)}
                </Form.Item>

                <FormItem label={actResource1} >
                  <Radio onClick={() => this.actRadio(1)} name='radio1' checked={this.state.radioCheck1}>
                    {getFieldDecorator('totalVolunteerRequired')(<Input name='resourceinput1' onChange={this.change}
                      disabled={this.state.input1Enabled} placeholder='Select from 1 to 100' />)}
                  </Radio>
                </FormItem>
                <FormItem label={actResource2}>
                  <Radio onClick={() => this.actRadio(2)} name='radio2' checked={this.state.radioCheck2}>
                    {getFieldDecorator('volunteerPerStudent')(<Input name='resourceinput2' onChange={this.change}
                      disabled={this.state.input2Enabled} placeholder='Specify the number of students' />)}

                  </Radio>
                </FormItem>

              </ShortInputContainer>
            </InputContainer>
          </FormGrid>
          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <H3Bold>Add an image</H3Bold>
              </TitleContainer>
              <P>
                Activities with illustrations get more responses. If you don't have a
                photo click suggest and we can provide one based on the tags.
              </P>
              <img style={{ width: '50%', float: 'right' }} src={this.props.act.imgUrl} alt='' />
            </DescriptionContainer>
            <InputContainer>
              <MediumInputContainer>
                <Form.Item label={actImgUrl}>
                  {getFieldDecorator('imgUrl', {
                    rules: []
                  })(<Input />)}
                  <ImageUpload setImgUrl={this.setImgUrl} />
                </Form.Item>
                // TODO: [VP-304] add suggest photo button to ActDetailForm
              </MediumInputContainer>
            </InputContainer>
          </FormGrid>
          <Divider />

          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <H3Bold>Save Activity</H3Bold>
              </TitleContainer>
              <P>
                <FormattedMessage
                  id='act.SaveInstructions'
                  defaultMessage='Save as Draft will allow you to preview the activity while Publish will make it available to everyone to view.'
                  description='Instructions for save and publish on activity details form'
                />
              </P>
            </DescriptionContainer>
            <InputContainer>
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
                disabled={hasErrors(getFieldsError())}
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
                disabled={hasErrors(getFieldsError())}
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
    resource: PropTypes.string,
    volunteers: PropTypes.number,
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
  existingTags: PropTypes.arrayOf(PropTypes.shape({
    tag: PropTypes.string.isRequired,
    _id: PropTypes.string
  })).isRequired,
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
      name: Form.createFormField({ ...props.act.name, value: props.act.name }),
      subtitle: Form.createFormField({ ...props.act.subtitle, value: props.act.subtitle }),
      description: Form.createFormField({ ...props.act.description, value: props.act.description }),
      duration: Form.createFormField({ ...props.act.duration, value: props.act.duration }),
      location: Form.createFormField({ ...props.act.location, value: props.act.location }),
      imgUrl: Form.createFormField({ ...props.act.imgUrl, value: props.act.imgUrl }),
      time: Form.createFormField({ ...props.act.time, value: props.act.time }),
      resource: Form.createFormField({ ...props.act.resource, value: props.act.resource }),
      totalVolunteerRequired: Form.createFormField({ ...props.act.totalVolunteerRequired, value: props.act.totalVolunteerRequired }),
      volunteerPerStudent: Form.createFormField({ ...props.act.volunteerPerStudent, value: props.act.volunteerPerStudent }),
      status: Form.createFormField({ ...props.act.status, value: props.act.status }),
      tags: Form.createFormField({ ...props.act.tags, value: props.act.tags })
    }
  }

})(ActDetailForm)
