import { Button, Checkbox, Col, Divider, Form, Input, Radio, Row } from 'antd'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import RichTextEditor from '../Editor/RichTextEditor'
import ImageUpload from '../UploadComponent/ImageUploadComponent'
import { TextHeadingBold, TextP } from '../VTheme/VTheme'
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
    this.props.form.setFieldsValue({ avatar: value })
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
        person.gender = values.gender
        person.about = values.about
        person.avatar = values.avatar
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
    const personAvatar = (
      <FormattedMessage
        id='personAvatar'
        defaultMessage='Image Link'
        description='person Image URL label in personDetails Form'
      />
    )
    const personGender = (
      <FormattedMessage
        id='personGender'
        defaultMessage='Gender'
        description='person gender label in personDetails Form'
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
    const nameError = isFieldTouched('name') && getFieldError('name')
    const isTest = process.env.NODE_ENV === 'test'

    return (
      <div className='PersonDetailForm'>
        <PageTitle>
          <h2>Edit Your Profile</h2>
        </PageTitle>

        <Form onSubmit={this.handleSubmit} hideRequiredMark colon={false}>
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <TextHeadingBold>About You</TextHeadingBold>
              </TitleContainer>
              <TextP>How do we get in touch?</TextP>
            </DescriptionContainer>
            <InputContainer>
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
              <Form.Item label={personnickname}>
                {getFieldDecorator('nickname', {
                  rules: []
                })(<Input placeholder='e.g Dali' />)}
              </Form.Item>
              <Form.Item label={personEmail}>
                {getFieldDecorator('email', {
                  rules: []
                })(<Input placeholder='salvador@dali.com' />)}
              </Form.Item>
              <Form.Item label={personPhone}>
                {getFieldDecorator('phone', {
                  rules: []
                })(<Input placeholder='000 000 0000' />)}
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
              <Form.Item label={personGender}>
                {getFieldDecorator('gender', {
                  rules: []
                })(<Input placeholder='write what you want here. ' />)}
              </Form.Item>
            </InputContainer>
          </FormGrid>

          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <TextHeadingBold>Avatar (optional)</TextHeadingBold>
              </TitleContainer>
              <TextP>
                Help people to recognise you or reflect your character.
              </TextP>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={personAvatar}>
                {getFieldDecorator('avatar', {
                  rules: [
                    {
                      /* { type: 'url', message: 'a URL is required' } */
                    }
                  ]
                })(<Input />)}
                <ImageUpload setImgUrl={this.setImgUrl} />
              </Form.Item>
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
          <FormGrid>
            
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
              </Col>
            </Row>
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
    email: PropTypes.string,
    phone: PropTypes.string,
    gender: PropTypes.string,
    avatar: PropTypes.any,
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
  onCancel: PropTypes.func.isRequired
  // dispatch: PropTypes.func.isRequired,
}

export default Form.create({
  name: 'person_detail_form',
  onFieldsChange (props, changedFields) {
    // console.log('onFieldsChange', changedFields)
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
      email: Form.createFormField({
        ...props.person.email,
        value: props.person.email
      }),
      phone: Form.createFormField({
        ...props.person.phone,
        value: props.person.phone
      }),
      gender: Form.createFormField({
        ...props.person.gender,
        value: props.person.gender
      }),
      avatar: Form.createFormField({
        ...props.person.avatar,
        value: props.person.avatar
      }),
      role: Form.createFormField({
        ...props.person.role,
        value: props.person.role
      }),
      status: Form.createFormField({
        ...props.person.status,
        value: props.person.status
      })
    }
  },
  onValuesChange (_, values) {
    // console.log('onValuesChange', values)
  }
})(PersonDetailForm)
