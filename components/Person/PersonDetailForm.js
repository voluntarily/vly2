import {
  Button,
  Checkbox,
  Divider,
  Form,
  Icon,
  Input,
  Radio,
  Tooltip
} from 'antd'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import PageTitle from '../../components/LandingPageComponents/PageTitle.js'
import LocationSelector from '../Form/Input/LocationSelector'
import RichTextEditor from '../Form/Input/RichTextEditor'
import TagInput from '../Form/Input/TagInput'
import ImageUpload from '../UploadComponent/ImageUploadComponent'
import {
  DescriptionContainer,
  FormGrid,
  InputContainer,
  ShortInputContainer,
  TitleContainer
} from '../VTheme/FormStyles'
import { H3Bold, P } from '../VTheme/VTheme'

const { TextArea } = Input

// TODO - only the owner and admins should be able to edit the person record.
function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class PersonDetailForm extends Component {
  constructor (props) {
    super(props)
    this.setAbout = this.setAbout.bind(this)
    this.setImgUrl = this.setImgUrl.bind(this)
  }
  componentDidMount () {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }
  setAbout (value) {
    this.props.form.setFieldsValue({ about: value })
  }

  setImgUrl = value => {
    this.props.form.setFieldsValue({ imgUrl: value })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const person = this.props.person
        person.name = values.name
        person.nickname = values.nickname
        person.email = values.email
        person.phone = values.phone
        person.pronoun = values.pronoun
        person.about = values.about
        person.location = values.location
        person.tags = values.tags
        person.imgUrl = values.imgUrl
        person.website = values.website
        person.twitter = values.twitter
        person.facebook = values.facebook
        person.role = values.role
        person.status = values.status
        this.props.onSubmit(this.props.person)
      }
    })
  }

  render () {
    // get translated labels
    const personName = (
      <FormattedMessage
        id='personName'
        defaultMessage='Full Name'
        description='person full name label in PersonDetails Form'
      />
    )
    const personnickname = (
      <FormattedMessage
        id='personnickname'
        defaultMessage='Nickname'
        description='person nickname label in personDetails Form'
      />
    )

    const personPronoun = (
      <FormattedMessage
        id='personPronoun'
        defaultMessage='Pronoun'
        description='person pronoun label in personDetails Form'
      />
    )
    const personEmail = (
      <FormattedMessage
        id='personEmail'
        defaultMessage='Email'
        description='person email label in personDetails Form'
      />
    )
    const personPhone = (
      <FormattedMessage
        id='personPhone'
        defaultMessage='Phone'
        description='person phone label in personDetails Form'
      />
    )
    const personAbout = (
      <FormattedMessage
        id='personAbout'
        defaultMessage='About you'
        description='person about label in personDetails Form'
      />
    )
    const personWebSite = (
      <FormattedMessage
        id='personWebsite'
        defaultMessage='Website'
        description='person website label in personDetails Form'
      />
    )
    const personFacebook = (
      <FormattedMessage
        id='personFacebook'
        defaultMessage='Facebook'
        description='person facebook label in personDetails Form'
      />
    )
    const personTwitter = (
      <FormattedMessage
        id='personTwitter'
        defaultMessage='Twitter'
        description='person twitter label in personDetails Form'
      />
    )
    const personAvatar = (
      <FormattedMessage
        id='personAvatar'
        defaultMessage='Image Link'
        description='person Image URL label in personDetails Form'
      />
    )

    const personRole = (
      <FormattedMessage
        id='personRole'
        defaultMessage='Role'
        description='person Role label in personDetails page'
      />
    )
    const personStatus = (
      <FormattedMessage
        id='personStatus'
        defaultMessage='Availability'
        description='active or retired status'
      />
    )
    const personLocation = (
      <span>
        {' '}
        <FormattedMessage
          id='personLocation'
          defaultMessage='Where are you based'
          description='Person Location label in PersonDetails Form'
        />
        &nbsp;
        <Tooltip title='Set your location to help find local opportunities'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )

    const personTags = (
      <FormattedMessage
        id='personTags'
        defaultMessage='Tags'
        description='Descriptions of general areas the person has skills in'
      />
    )

    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form

    const roleOptions = [
      { label: 'Admin', value: 'admin' },
      { label: 'Requestor', value: 'opportunityProvider' },
      { label: 'Volunteer', value: 'volunteer' },
      { label: 'Content provider', value: 'activityProvider' },
      { label: 'Tester', value: 'tester' }
    ]

    // Only show error after a field is touched.
    const nameError = isFieldTouched('name') && getFieldError('name')
    const isTest = process.env.NODE_ENV === 'test'

    return (
      <div className='PersonDetailForm'>
        <PageTitle>
          <h2>Edit your profile</h2>
        </PageTitle>
        <Divider />
        <Form onSubmit={this.handleSubmit} hideRequiredMark colon={false}>
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <H3Bold>About you</H3Bold>
              </TitleContainer>
              <P>How do we get in touch?</P>
            </DescriptionContainer>
            <InputContainer>
              <ShortInputContainer>
                <Form.Item
                  label={personName}
                  validateStatus={nameError ? 'error' : ''}
                  help={nameError || ''}
                >
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Name is required' }]
                  })(
                    <Input placeholder='e.g. Salvador Felipe Jacinto Dalí y Domenech.' />
                  )}
                </Form.Item>
              </ShortInputContainer>
              <ShortInputContainer>
                <Form.Item label={personnickname}>
                  {getFieldDecorator('nickname', {
                    rules: []
                  })(<Input placeholder='e.g Dali' />)}
                </Form.Item>
              </ShortInputContainer>
              <ShortInputContainer>
                <Form.Item label={personPronoun}>
                  {getFieldDecorator('pronoun', {
                    rules: []
                  })(<Input placeholder='e.g. she/her, he/him, they/them' />)}
                </Form.Item>
              </ShortInputContainer>
              <Form.Item label={personWebSite}>
                {getFieldDecorator('website', {
                  rules: [
                    {
                      pattern: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
                      message: 'Enter valid URL'
                    }
                  ]
                })(<Input placeholder='Website' />)}
              </Form.Item>
              <Form.Item label={personFacebook}>
                {getFieldDecorator('facebook', {
                  rules: []
                })(<Input addonBefore='https://www.facebook.com/' />)}
              </Form.Item>
              <Form.Item label={personTwitter}>
                {getFieldDecorator('twitter', {})(<Input addonBefore='@' />)}
              </Form.Item>
              <Form.Item label={personAbout}>
                {getFieldDecorator('about', {
                  rules: []
                })(
                  isTest ? (
                    <TextArea
                      rows={20}
                      placeholder='You can use markdown here.'
                    />
                  ) : (
                    <RichTextEditor onChange={this.setAbout} />
                  )
                )}
              </Form.Item>
              <Form.Item label={personLocation}>
                {getFieldDecorator('location', {
                  rules: []
                })(
                  <LocationSelector existingLocations={this.props.locations} />
                )}
              </Form.Item>
            </InputContainer>
          </FormGrid>
          <Divider />

          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <H3Bold>Do you have any specific skills? (optional)</H3Bold>
              </TitleContainer>
              <P>
                Do you have skills in any specific categories like programming,
                electronics, or robots? Enter them here to make it easier for us
                to recommend suitable opportunities for you.
              </P>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={personTags}>
                {getFieldDecorator('tags', {
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
                <H3Bold>Contact details</H3Bold>
              </TitleContainer>
              <P>
                How do you want teachers and charities to get in touch with you?
                Other people can only see this if you let them 🤫
              </P>
            </DescriptionContainer>
            <InputContainer>
              <ShortInputContainer>
                <Form.Item label={personEmail}>
                  {getFieldDecorator('email', {
                    rules: []
                  })(<Input placeholder='salvador@dali.com' />)}
                </Form.Item>
              </ShortInputContainer>
              <ShortInputContainer>
                <Form.Item label={personPhone}>
                  {getFieldDecorator('phone', {
                    rules: []
                  })(<Input placeholder='000 000 0000' />)}
                </Form.Item>
              </ShortInputContainer>
            </InputContainer>
          </FormGrid>
          <Divider />

          <FormGrid>
            <DescriptionContainer>
              <H3Bold>Avatar (optional)</H3Bold>
              <p>Help people to recognise you or reflect your character.</p>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={personAvatar}>
                {getFieldDecorator('imgUrl', {
                  rules: [
                    {
                      /* { type: 'url', message: 'a URL is required' } */
                    }
                  ]
                })(<Input />)}
                <ImageUpload setImgUrl={this.setImgUrl} />
              </Form.Item>
            </InputContainer>
          </FormGrid>
          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <H3Bold>Admin section</H3Bold>
              </TitleContainer>
              <P>Please be careful on this part</P>
            </DescriptionContainer>
            <InputContainer>
              {' '}
              <Form.Item label={personRole}>
                {getFieldDecorator('role', {
                  rules: [{ required: true, message: 'role is required' }]
                })(<Checkbox.Group options={roleOptions} />)}
              </Form.Item>
              <Form.Item label={personStatus}>
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: 'status is required' }]
                })(
                  <Radio.Group buttonStyle='solid'>
                    <Radio.Button value='inactive'>Not Available</Radio.Button>
                    <Radio.Button value='active'>Available</Radio.Button>
                    {/* // TODO: [VP-212] on person detail form only show Hold button to admins */}
                    <Radio.Button value='hold'>Hold</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
            </InputContainer>
          </FormGrid>
          <Divider />
          <FormGrid>
            <DescriptionContainer />
            <InputContainer>
              <Button
                type='secondary'
                htmlType='button'
                onClick={this.props.onCancel}
              >
                <FormattedMessage
                  id='cancel'
                  defaultMessage='Cancel'
                  description='Label for cancel button on person details form'
                />
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                disabled={hasErrors(getFieldsError())}
                style={{ marginLeft: 8 }}
              >
                <FormattedMessage
                  id='savePerson'
                  defaultMessage='Save'
                  description='Label for submit button on person details form'
                />
              </Button>
            </InputContainer>
          </FormGrid>
        </Form>
      </div>
    )
  }
}

PersonDetailForm.propTypes = {
  person: PropTypes.shape({
    cuid: PropTypes.string,
    name: PropTypes.string,
    nickname: PropTypes.string,
    about: PropTypes.string,
    location: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    facebook: PropTypes.string,
    twitter: PropTypes.string,
    website: PropTypes.string,
    pronoun: PropTypes.string,
    imgUrl: PropTypes.any,
    role: PropTypes.arrayOf(
      PropTypes.oneOf([
        'admin',
        'opportunityProvider',
        'volunteer',
        'activityProvider',
        'tester'
      ])
    ),
    status: PropTypes.oneOf(['active', 'inactive', 'hold'])
  }),
  form: PropTypes.object,
  params: PropTypes.shape({
    cuid: PropTypes.string.isRequired
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.string),
  existingTags: PropTypes.arrayOf(
    PropTypes.shape({
      tag: PropTypes.string.isRequired,
      _id: PropTypes.string
    })
  ).isRequired
  // dispatch: PropTypes.func.isRequired,
}

export default Form.create({
  name: 'person_detail_form',
  onFieldsChange (props, changedFields) {
    // props.onChange(changedFields);
  },
  mapPropsToFields (props) {
    return {
      name: Form.createFormField({
        ...props.person.name,
        value: props.person.name
      }),
      nickname: Form.createFormField({
        ...props.person.nickname,
        value: props.person.nickname
      }),
      about: Form.createFormField({
        ...props.person.about,
        value: props.person.about
      }),
      location: Form.createFormField({
        ...props.person.location,
        value: props.person.location
      }),
      email: Form.createFormField({
        ...props.person.email,
        value: props.person.email
      }),
      phone: Form.createFormField({
        ...props.person.phone,
        value: props.person.phone
      }),
      pronoun: Form.createFormField({
        ...props.person.pronoun,
        value: props.person.pronoun
      }),
      imgUrl: Form.createFormField({
        ...props.person.imgUrl,
        value: props.person.imgUrl
      }),
      facebook: Form.createFormField({
        ...props.person.facebook,
        value: props.person.facebook
      }),
      twitter: Form.createFormField({
        ...props.person.twitter,
        value: props.person.twitter
      }),
      website: Form.createFormField({
        ...props.person.website,
        value: props.person.website
      }),
      role: Form.createFormField({
        ...props.person.role,
        value: props.person.role
      }),
      status: Form.createFormField({
        ...props.person.status,
        value: props.person.status
      }),
      tags: Form.createFormField({
        ...props.person.tags,
        value: props.person.tags
      })
    }
  },
  onValuesChange (_, values) {
    // console.log('onValuesChange', values)
  }
})(PersonDetailForm)
