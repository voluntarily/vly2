import { Button, Checkbox, Divider, Form, Input, InputNumber } from 'antd'
import slug from 'limax'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import RichTextEditor from '../Form/Input/RichTextEditor'
import ImageUpload from '../UploadComponent/ImageUploadComponent'
import NumericRange from '../VTheme/NumericRange'
import { Category as OrganisationCategory } from '../../server/api/organisation/organisation.constants'
import PageTitle from '../../components/LandingPageComponents/PageTitle.js'
import {
  DescriptionContainer,
  FormGrid,
  InputContainer,
  MediumInputContainer,
  ShortInputContainer,
  TitleContainer
} from '../VTheme/FormStyles'

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class OrgDetailForm extends Component {
  constructor (props) {
    super(props)
    this.setImgUrl = this.setImgUrl.bind(this)
    this.setAddress = this.setAddress.bind(this)
  }

  componentDidMount () {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }

  setImgUrl = value => {
    this.props.form.setFieldsValue({ imgUrl: value })
  }

  setAddress = value => {
    this.props.form.setFieldsValue({ address: value })
  }
  // setWebsite = (value) => {
  //   this.props.form.setWebsite({ contactEmail: value })
  // }
  // setContactEmailUrl = (value) => {
  //   this.props.form.setFieldsValue({ contactEmail: value })
  // }

  /**
   * Creates a link to google maps for the supplied address.
   * @param {string} address
   */
  static createGoogleMapsAddressUrl (address) {
    address = (address || '').trim()
    if (!address) { return undefined }

    address = address.replace(/\n/g, ' ')
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // preserve the id and other values not edited by form.
        const org = this.props.org
        // update the rest from the form values.
        org.name = values.name
        org.slug = slug(values.name)
        org.info.about = values.about
        org.info.instructions = values.instructions
        org.info.followers = values.followers
        org.info.joiners = values.joiners
        org.info.members = values.members
        org.info.outsiders = values.outsiders
        org.imgUrl = values.imgUrl
        org.website = values.website
        org.twitter = values.twitter
        org.facebook = values.facebook
        org.contactEmail = values.contactEmail
        org.contactName = values.contactName
        org.contactPhoneNumber = values.contactPhoneNumber
        org.category = values.category
        org.ageRange = values.ageRange
        org.decile = values.decile
        org.address = values.address

        window.scrollTo(0, 0)
        this.props.onSubmit(this.props.org)
      }
    })
  }

  render () {
    // get translated labels
    const orgName = (
      <FormattedMessage
        id='orgName'
        defaultMessage='Title'
        description='organisation Title label in OrgDetails Form'
      />
    )
    const orgImgUrl = (
      <FormattedMessage
        id='orgImgUrl'
        defaultMessage='Image Link'
        description='organisation Image URL label in OrgDetails Form'
      />
    )
    const orgWebsite = (
      <FormattedMessage
        id='orgWebsite'
        defaultMessage='Website'
        description='website label in OrgDetails Form'
      />
    )
    const orgContactEmail = (
      <FormattedMessage
        id='orgContactEmail'
        defaultMessage='Contact Email'
        description='contact Email label in OrgDetails Form'
      />
    )
    const orgCategory = (
      <FormattedMessage
        id='orgCategory'
        defaultMessage='Category'
        description='school, business or activity provider'
      />
    )

    const orgAbout = (
      <FormattedMessage
        id='orgAbout'
        defaultMessage='About'
        description='organisation Description label in OrgDetails Form'
      />
    )
    const orgInfoInstructions = (
      <FormattedMessage
        id='orgInfoInstructions'
        defaultMessage='Getting started'
        description='organisation instructions label in OrgDetails Form'
      />
    )
    const orgInfoFollowers = (
      <FormattedMessage
        id='orgInfoFollowers'
        defaultMessage='Followers'
        description='organisation Description label in OrgDetails Form'
      />
    )
    const orgInfoJoiners = (
      <FormattedMessage
        id='orgInfoJoiners'
        defaultMessage='Joiners'
        description='organisation Description label in OrgDetails Form'
      />
    )
    const orgInfoMembers = (
      <FormattedMessage
        id='orgInfoMembers'
        defaultMessage='Members'
        description='organisation Description label in OrgDetails Form'
      />
    )
    const orgInfoOutsiders = (
      <FormattedMessage
        id='orgInfoOutsiders'
        defaultMessage='Outsiders'
        description='organisation Description label in OrgDetails Form'
      />
    )
    const orgAgeRange = (
      <FormattedMessage
        id='orgAgeRange'
        defaultMessage='Age range'
        description='Age range of students at the school'
      />
    )
    const orgDecile = (
      <FormattedMessage
        id='orgDecile'
        defaultMessage='Decile'
        description='Decile of school'
      />
    )
    const orgContactName = (
      <FormattedMessage
        id='orgContactName'
        defaultMessage='Contact name'
        description='Contact name'
      />
    )
    const orgContactPhoneNumber = (
      <FormattedMessage
        id='orgContactPhoneNumber'
        defaultMessage='Contact phone number'
        description='Contact phone number'
      />
    )
    const orgAddress = (
      <FormattedMessage
        id='orgAddress'
        defaultMessage='Address'
        description='Address of the organisation'
      />
    )

    // TODO translate
    // TODO Use constant values from server/api/organisation/organisation.constants.js
    const categoryOptions = [
      { label: 'Business', value: 'vp' },
      { label: 'School', value: 'op' },
      { label: 'Activity provider', value: 'ap' },
      { label: 'Agency', value: 'admin' },
      { label: 'Other', value: 'other' }
    ]

    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
      getFieldValue
    } = this.props.form

    // Only show error after a field is touched.
    const orgNameError = isFieldTouched('name') && getFieldError('name')
    return (
      <div className='OrgDetailForm'>
        <PageTitle>
          <h1>
            {' '}
            <FormattedMessage
              id='orgDetail.form.title'
              defaultMessage='Manage Organisation'
              description='Main Title for Organisation edit form'
            />
          </h1>
        </PageTitle>

        <Form onSubmit={this.handleSubmit} hideRequiredMark colon={false}>
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>
                  <FormattedMessage
                    id='orgDetail.form.category'
                    defaultMessage='Choose your organisation'
                    description='The type of organisation'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='orgDetail.form.category.description'
                  defaultMessage='Let everyone know what type of organisation you are.'
                  description='Description of the type of organisation'
                />
              </p>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={orgCategory}>
                {getFieldDecorator('category', {
                  rules: [{ required: true, message: 'category is required' }]
                })(<Checkbox.Group options={categoryOptions} />)}
              </Form.Item>
            </InputContainer>
          </FormGrid>
          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>
                  <FormattedMessage
                    id='orgDetail.form.about'
                    defaultMessage='About your Organisation'
                    description='Title for about section of organisation edit form'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='orgDetail.form.about.description'
                  values={{ br: <br /> }}
                  defaultMessage='Tell the world about your school or organisation.{br}{br}
                  This is your opportunity to ‘sell’ your school or organisation to the rest of the Voluntarily community. Who are you? What do you do? What are your values and your motivations for using Voluntarily?'
                  description='Title for about section of organisation edit form'
                />
              </p>
            </DescriptionContainer>
            <InputContainer>
              <ShortInputContainer>
                <Form.Item
                  label={orgName}
                  validateStatus={orgNameError ? 'error' : ''}
                  help={orgNameError || ''}
                >
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'A name is required' }]
                  })(<Input placeholder='Organisation Name' />)}
                </Form.Item>
              </ShortInputContainer>
              <Form.Item label={orgAbout}>
                {getFieldDecorator('about', {
                  rules: []
                })(
                  // <TextArea rows={20} placeholder='Tell us about your organisation. You can use markdown here. and include links' />
                  <RichTextEditor />
                )}
              </Form.Item>
              <Form.Item label={orgImgUrl}>
                {getFieldDecorator('imgUrl', {
                  rules: []
                })(<Input />)}
                <ImageUpload setImgUrl={this.setImgUrl} />
              </Form.Item>
            </InputContainer>
          </FormGrid>
          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>Contact Details</h3>
              </TitleContainer>
              <p>
                How do you want teachers and schools to get in touch with you?
              </p>
            </DescriptionContainer>
            <InputContainer>
              <ShortInputContainer>
                <Form.Item label={orgContactEmail}>
                  {getFieldDecorator('contactEmail', {
                    rules: []
                  })(
                    // <TextArea rows={20} placeholder='Enter email address for organisations contact person' />
                    <Input placeholder='example@gmail.com' />
                  )}
                </Form.Item>
                <Form.Item label={orgWebsite}>
                  {getFieldDecorator('website', {
                    rules: [
                      {
                        pattern: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
                        message: 'Enter valid URL'
                      }
                    ]
                  })(<Input placeholder='https://example.com' />)}
                </Form.Item>
              </ShortInputContainer>
              <MediumInputContainer>
                <Form.Item label='Facebook'>
                  {getFieldDecorator('facebook', {
                    rules: []
                  })(<Input addonBefore='facebook.com/' />)}
                </Form.Item>
              </MediumInputContainer>
              <ShortInputContainer>
                <Form.Item label='Twitter'>
                  {getFieldDecorator('twitter', {})(<Input addonBefore='@' />)}
                </Form.Item>
              </ShortInputContainer>
            </InputContainer>
          </FormGrid>
          <Divider />
          {(getFieldValue('category') || []).includes(OrganisationCategory.SCHOOL)
            ? (
              <>
                <FormGrid>
                  <DescriptionContainer>
                    <TitleContainer>
                      <h3>School details</h3>
                    </TitleContainer>
                    <p>A few details about your school</p>
                  </DescriptionContainer>
                  <InputContainer>
                    <ShortInputContainer>
                      <Form.Item htmlId='decile' label={orgDecile}>
                        {getFieldDecorator('decile', {})(
                          <InputNumber min={1} max={10} className='decile' />
                        )}
                      </Form.Item>

                      <Form.Item htmlId='age-range' label={orgAgeRange}>
                        {getFieldDecorator('ageRange', {
                          rules: [
                            {
                              type: 'method',
                              validator: (rule, value, callback) => {
                                callback(validateAgeRange(value)
                                  ? undefined
                                  : (
                                    <FormattedMessage
                                      id='org.detail.ageRange'
                                      defaultMessage='Please enter the age range of your students'
                                      description='The age range specified on the organisation form is invalid'
                                    />))
                              }
                            }
                          ]
                        })(
                          <NumericRange
                            fromPlaceholder='5'
                            fromMin={0}
                            fromMax={120}
                            toPlaceholder='18'
                            toMin={0}
                            toMax={120}
                          />
                        )}
                      </Form.Item>
                      <Form.Item label={orgContactName}>
                        {getFieldDecorator('contactName')(
                          <Input />
                        )}
                      </Form.Item>
                      <Form.Item label={orgContactPhoneNumber}>
                        {getFieldDecorator('contactPhoneNumber')(
                          <Input placeholder='01 123 456789' />
                        )}
                      </Form.Item>
                      <Form.Item label={orgAddress}>
                        {getFieldDecorator('address')(
                          <>
                            <Input.TextArea
                              id='address'
                              rows={4}
                              maxLength={512}
                              value={getFieldValue('address')}
                              onChange={e => this.setAddress(e.target.value)}
                            />
                            {OrgDetailForm.createGoogleMapsAddressUrl(getFieldValue('address')) &&
                              <a href={OrgDetailForm.createGoogleMapsAddressUrl(getFieldValue('address'))} target='_blank' rel='noopener noreferrer'>
                                <FormattedMessage
                                  id='org.detail.viewAddressInGoogleMaps'
                                  defaultMessage='View in Google maps'
                                  description='Link to view the address in Google maps'
                                />
                              </a>}
                          </>
                        )}
                      </Form.Item>
                    </ShortInputContainer>
                  </InputContainer>
                </FormGrid>
                <Divider />
              </>)
            : null}
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>Staff Instructions</h3>
              </TitleContainer>
              <p>
                What processes do you want staff to do before they start
                volunteering? Should they fill in a form? Ask for approval from
                their manager? Specify your instructions here.
              </p>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={orgInfoInstructions}>
                {getFieldDecorator('instructions', {
                  rules: []
                })(
                  // <TextArea rows={20} placeholder='Tell us about your organisation. You can use markdown here. and include links' />
                  <RichTextEditor />
                )}
              </Form.Item>
            </InputContainer>
          </FormGrid>
          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>Partner Instructions</h3>
              </TitleContainer>
              <p>
                Is there anything you want partners who collaborate on CSR
                activities with you to know? Write it here
              </p>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={orgInfoFollowers}>
                {getFieldDecorator('followers', {
                  rules: []
                })(
                  // <TextArea rows={20} placeholder='Tell us about your organisation. You can use markdown here. and include links' />
                  <RichTextEditor />
                )}
              </Form.Item>
            </InputContainer>
          </FormGrid>

          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>How to join</h3>
              </TitleContainer>
              <p>
                How do you want teachers and schools to get in touch with you?
              </p>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={orgInfoJoiners}>
                {getFieldDecorator('joiners', {
                  rules: []
                })(
                  // <TextArea rows={20} placeholder='Tell us about your organisation. You can use markdown here. and include links' />
                  <RichTextEditor />
                )}
              </Form.Item>
            </InputContainer>
          </FormGrid>
          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>Staff Section</h3>
              </TitleContainer>
              <p>
                Anything you want to only tell staff about? ie: Where to get
                Company T-Shirts before volunteering
              </p>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={orgInfoMembers}>
                {getFieldDecorator('members', {
                  rules: []
                })(
                  // <TextArea rows={20} placeholder='Tell us about your organisation. You can use markdown here. and include links' />
                  <RichTextEditor />
                )}
              </Form.Item>
            </InputContainer>
          </FormGrid>
          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>Public Section</h3>
              </TitleContainer>
              <p>
                How do you want teachers and schools to get in touch with you?
              </p>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={orgInfoOutsiders}>
                {getFieldDecorator('outsiders', {
                  rules: []
                })(
                  // <TextArea rows={20} placeholder='Tell us about your organisation. You can use markdown here. and include links' />
                  <RichTextEditor />
                )}
              </Form.Item>
            </InputContainer>
          </FormGrid>
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>Confirm</h3>
              </TitleContainer>
              <p>Check before you go</p>
            </DescriptionContainer>
            <InputContainer>
              <Button
                type='primary'
                size='large'
                htmlType='submit'
                shape='round'
                disabled={hasErrors(getFieldsError())}
                style={{ marginLeft: 8 }}
              >
                <FormattedMessage
                  id='org.save'
                  defaultMessage='Save'
                  description='Label for submit button on organisation details form'
                />
              </Button>
              &nbsp;&nbsp;
              <Button
                type='secondary'
                htmlType='button'
                shape='round'
                size='large'
                onClick={this.props.onCancel}
              >
                <FormattedMessage
                  id='org.cancel'
                  defaultMessage='Cancel'
                  description='Label for cancel button on organisation details form'
                />
              </Button>
            </InputContainer>
          </FormGrid>
        </Form>
      </div>
    )
  }
}

OrgDetailForm.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string,
    info: PropTypes.shape({
      about: PropTypes.string.isRequired,
      followers: PropTypes.string,
      joiners: PropTypes.string,
      members: PropTypes.string,
      outsiders: PropTypes.string
    }),
    category: PropTypes.arrayOf(
      PropTypes.oneOf(['admin', 'op', 'vp', 'ap', 'other'])
    ),
    imgUrl: PropTypes.string,
    website: PropTypes.string,
    contactEmail: PropTypes.string,
    facebook: PropTypes.string,
    twitter: PropTypes.string,
    _id: PropTypes.string,
    ageRange: PropTypes.object,
    contactName: PropTypes.string,
    contactPhoneNumber: PropTypes.string,
    address: PropTypes.string
  }).isRequired,
  form: PropTypes.object,
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
  // dispatch: PropTypes.func.isRequired,
}

export default Form.create({
  name: 'organisation_detail_form',
  onFieldsChange (props, changedFields) {
    // props.onChange(changedFields);
  },
  mapPropsToFields (props) {
    const org = props.org
    if (!org.info) {
      org.info = {}
    }
    return {
      name: Form.createFormField({ ...org.name, value: org.name }),
      about: Form.createFormField({ ...org.info.about, value: org.info.about }),
      instructions: Form.createFormField({
        ...org.info.instructions,
        value: org.info.instructions
      }),
      followers: Form.createFormField({
        ...org.info.followers,
        value: org.info.followers
      }),
      joiners: Form.createFormField({
        ...org.info.joiners,
        value: org.info.joiners
      }),
      members: Form.createFormField({
        ...org.info.members,
        value: org.info.members
      }),
      outsiders: Form.createFormField({
        ...org.info.outsiders,
        value: org.info.outsiders
      }),
      imgUrl: Form.createFormField({ ...org.imgUrl, value: org.imgUrl }),
      website: Form.createFormField({ ...org.website, value: org.website }),
      contactEmail: Form.createFormField({
        ...org.contactEmail,
        value: org.contactEmail
      }),
      facebook: Form.createFormField({ ...org.facebook, value: org.facebook }),
      twitter: Form.createFormField({ ...org.twitter, value: org.twitter }),
      category: Form.createFormField({ ...org.category, value: org.category }),
      ageRange: Form.createFormField({ ...org.ageRange, value: org.ageRange }),
      decile: Form.createFormField({ ...org.decile, value: org.decile }),
      contactName: Form.createFormField({ ...org.contactName, value: org.contactName }),
      contactPhoneNumber: Form.createFormField({ ...org.contactPhoneNumber, value: org.contactPhoneNumber }),
      address: Form.createFormField({ ...org.address, value: org.address })
    }
  }
})(OrgDetailForm)

/**
 * Validates the age range field.
 * @param {{ from: Number, to: Number }?} value The value in the age range field.
 * @returns {boolean} True if the field is valid based on the input, False otherwise.
 */
export const validateAgeRange = (value) => {
  // Allow an empty age range
  if (!value) { return true }

  const from = Number(value.from)
  const to = Number(value.to)

  // Only compare age ranges if both are specified
  if (from && to) { return (from <= to) }

  return true
}
