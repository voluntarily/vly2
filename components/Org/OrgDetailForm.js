import { Button, Checkbox, Divider, Form, Input, Tooltip, Icon, Affix } from 'antd'
import slug from 'limax'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import RichTextEditor from '../Form/Input/RichTextEditor'
import ImageUpload from '../Upload/ImageUpload'
import PageTitle from '../../components/LandingPageComponents/PageTitle.js'
import { domainRegex } from '../../lib/fieldValidation'
import {
  DescriptionContainer,
  FormGrid,
  InputContainer,
  MediumInputContainer,
  ShortInputContainer,
  TitleContainer
} from '../VTheme/FormStyles'
import TagInput from '../Form/Input/TagInput'
import { OrganisationRole } from '../../server/api/organisation/organisation.constants'
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

  /**
   * Creates a link to google maps for the supplied address.
   * @param {string} address
   */
  static createGoogleMapsAddressUrl (address) {
    address = (address || '').trim()
    if (!address) {
      return undefined
    }

    address = address.replace(/\n/g, ' ')
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // preserve the id and other values not edited by form.
        const org = this.props.org
        // update the rest from the form values.
        org.name = values.name
        org.domainName = values.domainName
        org.slug = slug(values.name)
        org.groups = values.groups
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
        org.ageRange = values.ageRange
        org.decile = values.decile
        org.address = values.address
        if (values.role) org.role = values.role

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
    const orgDomain = (
      <span>
        <FormattedMessage
          id='orgDomain'
          defaultMessage='Domain Name'
          description='organisation Domain label in OrgDetails Form'
        />
      &nbsp;
        <Tooltip title='Used to match emails of the form name@org.domain to your organisation automatically.'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
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
    const orgRole = (
      <FormattedMessage
        id='orgRole'
        defaultMessage='Role'
        description='business or activity provider'
      />
    )

    const orgGroups = (
      <FormattedMessage
        id='orgGroups'
        defaultMessage='Groups'
        description='Descriptions of groups this org belongs to'
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
    const roleOptions = [
      { label: 'Volunteer', value: OrganisationRole.VOLUNTEER_PROVIDER },
      { label: 'Create Requests', value: OrganisationRole.OPPORTUNITY_PROVIDER },
      { label: 'Plan Activities', value: OrganisationRole.ACTIVITY_PROVIDER },
      { label: 'Admin', value: OrganisationRole.ADMIN },
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
          {this.props.isAdmin && (
            <>
              <FormGrid>
                <DescriptionContainer>
                  <TitleContainer>
                    <h3>
                      <FormattedMessage
                        id='OpAskForm.groups.label'
                        description='Section label for op groups'
                        defaultMessage='What categories does this group service?'
                      />
                    </h3>
                  </TitleContainer>
                  <p>
                    <FormattedMessage
                      id='OpAskForm.groups.prompt'
                      description='Section prompt for op groups'
                      defaultMessage='e.g. Business or Individual'
                    />
                  </p>
                </DescriptionContainer>
                <InputContainer>
                  <Form.Item label={orgGroups}>
                    {getFieldDecorator('groups', {
                      initialValue: [],
                      rules: []
                    })(<TagInput existingTags={this.props.existingGroups} />)}
                  </Form.Item>
                </InputContainer>
                <DescriptionContainer>
                  <TitleContainer>
                    <h3>
                      <FormattedMessage
                        id='orgDetail.form.role'
                        defaultMessage='Set organisation permissions'
                        description='The type of organisation'
                      />
                    </h3>
                  </TitleContainer>
                  <p>
                    <FormattedMessage
                      id='orgDetail.form.role.description'
                      defaultMessage='Members of this group can do the listed items.'
                      description='Description of the permissions of organisation'
                    />
                  </p>
                </DescriptionContainer>
                <InputContainer>
                  <Form.Item label={orgRole}>
                    {getFieldDecorator('role', {
                      rules: [
                        { required: true, message: 'permissions level  is required' }
                      ]
                    })(<Checkbox.Group options={roleOptions} />)}
                  </Form.Item>
                </InputContainer>

              </FormGrid>
              <Divider />
            </>
          )}
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
                  defaultMessage='Tell the world about your organisation.{br}{br}
                  This is your opportunity to ‘sell’ your organisation to the rest of the Voluntarily community. Who are you? What do you do? What are your values and your motivations for using Voluntarily?'
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
                  <RichTextEditor />
                )}
              </Form.Item>
              <ShortInputContainer>
                <Form.Item label={orgDomain}>
                  {getFieldDecorator('domainName', {
                    rules: [
                      {
                        pattern: domainRegex,
                        message: 'Enter a valid Domain'
                      }
                    ]
                  })(<Input placeholder='Organisation Domain' />)}
                </Form.Item>
              </ShortInputContainer>
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
                How do you want the public to get in touch with you?
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

          <>
            <FormGrid>
              <InputContainer>
                <ShortInputContainer>
                  <Form.Item label={orgContactName}>
                    {getFieldDecorator('contactName')(<Input />)}
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
                        {OrgDetailForm.createGoogleMapsAddressUrl(
                          getFieldValue('address')
                        ) && (
                          <a
                            href={OrgDetailForm.createGoogleMapsAddressUrl(
                              getFieldValue('address')
                            )}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <FormattedMessage
                              id='org.detail.viewAddressInGoogleMaps'
                              defaultMessage='View in Google maps'
                              description='Link to view the address in Google maps'
                            />
                          </a>
                        )}
                      </>
                    )}
                  </Form.Item>
                </ShortInputContainer>
              </InputContainer>
            </FormGrid>
            <Divider />
          </>
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>
                  <FormattedMessage
                    id='orgDetailPage.staff.join.title'
                    defaultMessage='Staff Instructions'
                    description='title for staff joiner section'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='orgDetailPage.staff.join.description'
                  defaultMessage='What processes do you want staff to do before they start volunteering? Should they fill in a form? Ask for approval from their manager? Specify your instructions here.'
                  description='a place to write instructions regarding how to join the org for org managers'
                />
              </p>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={orgInfoInstructions}>
                {getFieldDecorator('instructions', {
                  rules: []
                })(
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
                  <RichTextEditor />
                )}
              </Form.Item>
            </InputContainer>
          </FormGrid>

          <Divider />
          <FormGrid>
            <DescriptionContainer>
              <TitleContainer>
                <h3>
                  <FormattedMessage
                    id='orgDetailpage.staff.signup.title'
                    defaultMessage='Signing up'
                    description='title for joining employees section'
                  />
                </h3>
              </TitleContainer>
              <p>
                <FormattedMessage
                  id='orgDetailpage.staff.signup.description'
                  defaultMessage='Tell your members what they need to do to join the group - ie: Talk to your manager or HR person for the magic code'
                  description='description for joining employees section'
                />

              </p>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={orgInfoJoiners}>
                {getFieldDecorator('joiners', {
                  rules: []
                })(
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
                How do you want the public to get in touch with you?
              </p>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={orgInfoOutsiders}>
                {getFieldDecorator('outsiders', {
                  rules: []
                })(
                  <RichTextEditor />
                )}
              </Form.Item>
            </InputContainer>
          </FormGrid>
          <Affix offsetBottom={0}>
            <FormGrid style={{ backgroundColor: 'white', paddingTop: 15 }}>
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
          </Affix>
        </Form>
      </div>
    )
  }
}

OrgDetailForm.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string,
    info: PropTypes.shape({
      about: PropTypes.string,
      followers: PropTypes.string,
      joiners: PropTypes.string,
      members: PropTypes.string,
      outsiders: PropTypes.string
    }),
    role: PropTypes.arrayOf(
      PropTypes.oneOf([OrganisationRole.ADMIN, OrganisationRole.OPPORTUNITY_PROVIDER, OrganisationRole.VOLUNTEER_PROVIDER, OrganisationRole.ACTIVITY_PROVIDER, 'other'])
    ),
    imgUrl: PropTypes.string,
    domainName: PropTypes.string,
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

  mapPropsToFields (props) {
    const org = props.org
    if (!org.info) {
      org.info = {}
    }
    return {
      name: Form.createFormField({ ...org.name, value: org.name }),
      groups: Form.createFormField({
        ...props.org.groups,
        value: props.org.groups
      }),
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
      domainName: Form.createFormField({ ...org.domainName, value: org.domainName }),
      website: Form.createFormField({ ...org.website, value: org.website }),
      contactEmail: Form.createFormField({
        ...org.contactEmail,
        value: org.contactEmail
      }),
      facebook: Form.createFormField({ ...org.facebook, value: org.facebook }),
      twitter: Form.createFormField({ ...org.twitter, value: org.twitter }),
      role: Form.createFormField({ ...org.role, value: org.role }),
      ageRange: Form.createFormField({ ...org.ageRange, value: org.ageRange }),
      decile: Form.createFormField({ ...org.decile, value: org.decile }),
      contactName: Form.createFormField({
        ...org.contactName,
        value: org.contactName
      }),
      contactPhoneNumber: Form.createFormField({
        ...org.contactPhoneNumber,
        value: org.contactPhoneNumber
      }),
      address: Form.createFormField({ ...org.address, value: org.address })
    }
  }
})(OrgDetailForm)

/**
 * Validates the age range field.
 * @param {{ from: Number, to: Number }?} value The value in the age range field.
 * @returns {boolean} True if the field is valid based on the input, False otherwise.
 */
export const validateAgeRange = value => {
  // Allow an empty age range
  if (!value) {
    return true
  }

  const from = Number(value.from)
  const to = Number(value.to)

  // Only compare age ranges if both are specified
  if (from && to) {
    return from <= to
  }

  return true
}
