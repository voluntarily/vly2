import { Button, Divider, Form, Icon, Input, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import RichTextEditor from '../FormInputComponents/RichTextEditor'
import ImageUpload from '../UploadComponent/ImageUploadComponent'
import { TextHeadingBold, TextP } from '../VTheme/VTheme'
import OpDetailTagsEditable from '../Op/OpDetailTagsEditable'

import {
  DescriptionContainer,
  FormGrid,
  InputContainer,
  MediumInputContainer,
  ShortInputContainer,
  TitleContainer
} from '../VTheme/FormStyles'

const { TextArea } = Input

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class ActDetailForm extends Component {
  constructor (props) {
    super(props)
    this.setDescription = this.setDescription.bind(this)
    this.setImgUrl = this.setImgUrl.bind(this)
  }

  componentDidMount () {
    // Call validateFields here to disable the submit button when on a blank form.
    // empty callback supresses a default which prints to the console.
    this.props.form.validateFields(() => { })
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
        act.title = values.title
        act.subtitle = values.subtitle
        act.duration = values.duration
        act.resource = values.resource
        act.description = values.description
        act.imgUrl = values.imgUrl
        act.status = e.target.name === 'publish' ? 'active' : 'draft'
        // act.owner = (this.props.act.owner && this.props.op.owner._id) || this.props.me._id
        act.owner = this.props.me._id
        // TODO: [VP-305] should the owner of the activity be preserved or set to the last person who edits it?

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
    const titleError = isFieldTouched('title') && getFieldError('title')

    return (
      <div className='ActDetailForm'>
        <Form hideRequiredMark colon={false}>
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <TextHeadingBold>Tell everyone about this Activity?</TextHeadingBold>
              </TitleContainer>
              <TextP>
                Attract people to this activitiy with a snappy title, use the subtitle to layout the basic idea.
              </TextP>
            </DescriptionContainer>
            <InputContainer>
              <ShortInputContainer>
                <Form.Item
                  label={actTitle}
                  validateStatus={titleError ? 'error' : ''}
                  help={titleError || ''}
                >
                  {getFieldDecorator('title', {
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
                <TextHeadingBold>
                  What topics and learning outcomes does this activity cover?
                </TextHeadingBold>
              </TitleContainer>
              <TextP>
                Make this activity searchable by classifying it with subject, age group, and technology keywords.
              </TextP>
            </DescriptionContainer>
            <InputContainer>
              {/* TODO: Implement Activity Tags */}
              <Form.Item label={actTags}>
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
                <TextHeadingBold>What resources are required to run this activity?</TextHeadingBold>
              </TitleContainer>
              <TextP>
                What is the time commitment?<br />
                How many people do you need to help?<br />
                What skills might they require?<br />
                Do you need a special space or location to work in?<br />
                Does this activity require special equipment?
              </TextP>
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
              </ShortInputContainer>
              <ul>
                <li>TODO: [VP-301] list the number of volunteers required e.g. 1 adult for 5 children, or 20 people</li>
                <li>TODO: [VP-302] list any equipment required for an activity</li>
                <li>TODO: [VP-303] list any space requirements for an activity</li>
              </ul>
            </InputContainer>
          </FormGrid>
          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <TextHeadingBold>Add an image</TextHeadingBold>
              </TitleContainer>
              <TextP>
                Activities with illustrations get more responses. If you don't have a
                photo click suggest and we can provide one based on the tags.
              </TextP>
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
                <TextHeadingBold>Save Activity</TextHeadingBold>
              </TitleContainer>
              <TextP>
                <FormattedMessage
                  id='act.SaveInstructions'
                  defaultMessage='Save as Draft will allow you to preview the activity while Publish will make it available to everyone to view.'
                  description='Instructions for save and publish on activity details form'
                />
              </TextP>
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
