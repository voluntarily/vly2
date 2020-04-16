import { Avatar, Button, Checkbox, Divider, Form, Icon, Input, Radio, Tooltip, Row, Col } from 'antd'
import PropTypes from 'prop-types'
import React, { Component, forwardRef } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import EducationSelector from '../Form/Input/EducationSelector'
import RichTextEditor from '../Form/Input/RichTextEditor'
import TagInput from '../Form/Input/TagInput'
import ImageUpload from '../Upload/ImageUpload'
import {
  DescriptionContainer,
  FormGrid,
  InputContainer,
  ShortInputContainer,
  TitleContainer
} from '../VTheme/FormStyles'
import { H3Bold, P } from '../VTheme/VTheme'
import { websiteRegex } from '../../server/api/person/person.validation'
import { Role } from '../../server/services/authorize/role'
import TagSelect from '../Form/Input/TagSelect'

const EducationSelectorRef = forwardRef(EducationSelector)
const developerSettings = process.env.NODE_ENV !== 'production'
const { TextArea } = Input

// TODO - only the owner and admins should be able to edit the person record.
function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class PersonDetail extends Component {
  constructor (props) {
    super(props)
    this.setImgUrl = this.setImgUrl.bind(this)
  }

  componentDidMount () {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }

  setImgUrl = (imgUrl, sizeVariants) => {
    this.avatar = sizeVariants
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
        person.sendEmailNotifications = values.sendEmailNotifications
        person.pronoun = {
          subject: values.pronoun_subject,
          object: values.pronoun_object,
          possessive: values.pronoun_possessive
        }
        person.about = values.about
        person.locations = values.locations
        person.tags = values.tags

        person.website = values.website
        person.twitter = values.twitter
        person.facebook = values.facebook
        if (this.avatar) {
          person.imgUrl = this.avatar.lg
          person.imgUrlSm = this.avatar.sm
        }

        if (developerSettings) {
          person.role = values.role
        }
        person.status = values.status
        person.education = values.education
        person.placeOfWork = values.placeOfWork
        person.job = values.job
        window.scrollTo(0, 0)
        permissionTrimFields(person, this.props.me.role)
        this.props.onSubmit(person)
      }
    })
  }

  render () {
    // get translated labels
    const personName = (
      <FormattedMessage
        id='personName'
        defaultMessage='Formal name'
        description='person full name label in PersonDetails Form'
      />
    )
    const personnickname = (
      <FormattedMessage
        id='personnickname'
        defaultMessage='Short name'
        description='person nickname label in personDetails Form'
      />
    )

    const personPronoun = (
      <FormattedMessage
        id='personPronoun'
        defaultMessage='Pronoun (subject/object/possessive)'
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
    const personSendEmailNotifications = (
      <FormattedMessage
        id='personSendEmailNotifications'
        defaultMessage='Get email notifications from Voluntarily'
        description='send email notifications label in personDetails form'
      />
    )
    const personAbout = (
      <FormattedMessage
        id='personAbout2'
        defaultMessage='About'
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
        defaultMessage='Profile Photo'
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
          id='PersonDetailForm.Label.Location'
          defaultMessage='In what regions do you want to volunteer'
          description='Person Location label in PersonDetails Form'
        />
        &nbsp;
        <Tooltip title='Lets us recommend you nearby opportunities'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const personEducation = (
      <span>
        {' '}
        <FormattedMessage
          id='PersonDetailForm.Label.education'
          defaultMessage='Education Level'
          description='Select box label for education.'
        />
        &nbsp;
        <Tooltip title='So we can learn more about who volunteers'>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    )
    const personplaceOfWork = (
      <FormattedMessage
        id='placeOfWork'
        defaultMessage='Where is your place of Work'
        description='persons location of work if they do not come from a organisation'
      />
    )
    const personJob = (
      <FormattedMessage
        id='job'
        defaultMessage='What is your Job Title?'
        description='person Job label in personDetails Form'
      />
    )
    const personTags = (
      <span>
        {' '}
        <FormattedMessage
          id='PersonDetailForm.Label.Tags'
          defaultMessage='Skills &amp; Interests'
          description='Descriptions of general areas the person has skills in'
        />
        &nbsp;
        <Tooltip title='Helps us recommend activities based on your skills and interests'>
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

    const roleOptions = [
      { label: 'Admin', value: 'admin' },
      { label: 'Requestor', value: 'opportunityProvider' },
      { label: 'Volunteer', value: 'volunteer' },
      { label: 'Content provider', value: 'activityProvider' },
      { label: 'SUPPORT', value: 'support' }
    ]
    // Only show error after a field is touched.
    const nameError = isFieldTouched('name') && getFieldError('name')
    const isTest = process.env.NODE_ENV === 'test'
    return (
      <div className='PersonDetailForm'>
        <Form onSubmit={this.handleSubmit} hideRequiredMark colon={false}>
          <FormGrid> {/* // About You */}
            <DescriptionContainer>
              <TitleContainer>
                <H3Bold>
                  <FormattedMessage
                    id='PersonDetailForm.SectionTitle.AboutYou'
                    defaultMessage='About you'
                  />
                </H3Bold>
              </TitleContainer>
              <P>
                <FormattedMessage
                  id='PersonDetailForm.SectionDescription.AboutYou'
                  defaultMessage='Tell the people you will be volunteering for something about yourself. How we should address you, education and job etc.'
                />
              </P>
            </DescriptionContainer>
            <InputContainer>
              <ShortInputContainer>
                <Form.Item label={personnickname}>
                  {getFieldDecorator('nickname', {
                    rules: []
                  })(<Input placeholder='e.g Dali' />)}
                </Form.Item>
              </ShortInputContainer>
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
                <Row>
                  <Col span={24}>
                    <label>{personPronoun}</label>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Form.Item layout='inline' style={{ width: '100%', marginRight: 0 }}>
                      {getFieldDecorator('pronoun_subject', {
                        rules: []
                      })(<Input placeholder='they' />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item layout='inline'>
                      {getFieldDecorator('pronoun_object', {
                        rules: []
                      })(<Input placeholder='them' />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item layout='inline'>
                      {getFieldDecorator('pronoun_possessive', {
                        rules: []
                      })(<Input placeholder='theirs' />)}
                    </Form.Item>
                  </Col>
                </Row>
              </ShortInputContainer>

              <Form.Item label={personAbout}>
                {getFieldDecorator('about', {
                  rules: []
                })(
                  isTest ? (
                    <TextArea
                      rows={20}
                      placeholder='Tell everyone about yourself here'
                    />
                  ) : (
                    <RichTextEditor />
                  )
                )}
              </Form.Item>

              <Form.Item label={personEducation}>
                {getFieldDecorator('education')(
                  <EducationSelectorRef />
                )}
              </Form.Item>
              <Form.Item label={personplaceOfWork}>
                {getFieldDecorator('placeOfWork')(
                  <Input placeholder='Enter your place of work here' />
                )}
              </Form.Item>
              <ShortInputContainer>
                <Form.Item label={personJob}>
                  {getFieldDecorator('job')(
                    <Input placeholder='Enter your job title here' />
                  )}
                </Form.Item>
              </ShortInputContainer>
            </InputContainer>
          </FormGrid>
          <Divider />

          <FormGrid> {/* // Skills and Interests */}
            <DescriptionContainer>
              <TitleContainer>
                <H3Bold>
                  <FormattedMessage
                    id='PersonDetailForm.SectionTitle.SkillsAndInterests'
                    defaultMessage='Activity Recommendations'
                  />
                </H3Bold>
              </TitleContainer>
              <P>
                <FormattedMessage
                  id='PersonDetailForm.SectionDescription.SkillsAndInterests'
                  defaultMessage='This section helps us find the right things for you to do. Tell us the region you in and your skills and interests. Use keywords like: accounting, video conferencing etc.'
                />
              </P>
            </DescriptionContainer>

            <InputContainer>
              <Form.Item label={personLocation}>
                {getFieldDecorator('locations')(
                  <TagSelect values={this.props.locations} placeholder='Select location' />
                )}
              </Form.Item>
              <Form.Item label={personTags}>
                {getFieldDecorator('tags', {
                  initialValue: [],
                  rules: []
                })(<TagInput existingTags={this.props.existingTags} />)}
              </Form.Item>
            </InputContainer>
          </FormGrid>
          <Divider />

          <FormGrid> {/* // Contact Details */}
            <DescriptionContainer>
              <TitleContainer>
                <H3Bold>
                  <FormattedMessage
                    id='PersonDetailForm.SectionTitle.ContactDetails'
                    defaultMessage='Contact details'
                  />
                </H3Bold>
              </TitleContainer>
              <P>
                <FormattedMessage
                  id='PersonDetailForm.SectionDescription.ContactDetails'
                  defaultMessage='How do you want people to get in touch with you? Other people can only see this if you let them 🤫'
                />
              </P>
            </DescriptionContainer>
            <InputContainer>
              <ShortInputContainer>
                <Form.Item label={personEmail}>
                  {getFieldDecorator('email', {
                    rules: []
                  })(<Input placeholder='salvador@dali.com' readOnly />)}
                </Form.Item>
              </ShortInputContainer>
              <ShortInputContainer>
                <Form.Item label={personPhone}>
                  {getFieldDecorator('phone', {
                    rules: []
                  })(<Input placeholder='000 000 0000' />)}
                </Form.Item>
              </ShortInputContainer>
              <Divider />
            </InputContainer>
          </FormGrid>
          <Divider />

          <FormGrid> {/* // Avatar */}
            <DescriptionContainer>
              <H3Bold>
                <FormattedMessage
                  id='PersonDetailForm.SectionTitle.Avatar'
                  defaultMessage='Profile Photo'
                />
              </H3Bold>
              <FormattedMessage
                id='PersonDetailForm.SectionDescription.Avatar'
                defaultMessage='Upload a photo to help people to recognise you and reflect your character.'
              />
              {this.props.person.imgUrlSm &&
                <p>
                  <Avatar size={128} src={this.props.person.imgUrl} />
                </p>}
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={personAvatar}>
                <ImageUpload setImgUrl={this.setImgUrl} usages='profile-photo' />
              </Form.Item>
            </InputContainer>
          </FormGrid>
          <Divider />
          <FormGrid> {/* // Social Links - Optional */}
            <DescriptionContainer>
              <TitleContainer>
                <H3Bold>
                  <FormattedMessage
                    id='PersonDetailForm.SectionTitle.SocialLinks'
                    defaultMessage='Social Media'
                  />
                </H3Bold>
              </TitleContainer>
              <P>
                <FormattedMessage
                  id='PersonDetailForm.SectionDescription.SocialLinks'
                  defaultMessage='Optional: Share your social media links so the groups you work with can follow your social network.'
                />
              </P>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={personWebSite}>
                {getFieldDecorator('website', {
                  rules: [
                    {
                      pattern: websiteRegex,
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

            </InputContainer>
          </FormGrid>
          <Divider />
          <FormGrid> {/* // Settings */}
            <DescriptionContainer>
              <TitleContainer>
                <H3Bold>
                  <FormattedMessage
                    id='PersonDetailForm.SectionTitle.Settings'
                    defaultMessage='Settings'
                  />
                </H3Bold>
              </TitleContainer>
              <P>
                <FormattedMessage
                  id='PersonDetailForm.SectionDescription.Settings'
                  defaultMessage='Control your availability for volunteering and whether to receive emails.'
                />
              </P>
            </DescriptionContainer>
            <InputContainer>
              <Form.Item label={personStatus}>
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: 'availability is required' }]
                })(
                  <Radio.Group buttonStyle='solid'>
                    <Radio.Button value='inactive'>Not Available</Radio.Button>
                    <Radio.Button value='active'>Available</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('sendEmailNotifications', {
                  valuePropName: 'checked'
                })(<Checkbox>{personSendEmailNotifications}</Checkbox>)}
              </Form.Item>
            </InputContainer>
          </FormGrid>
          <Divider />
          {developerSettings && (
            <>
              <FormGrid> {/* // Dev Settings */}
                <DescriptionContainer>
                  <TitleContainer>
                    <H3Bold>Developer Settings</H3Bold>
                  </TitleContainer>
                  <P>This section is only available to developers.</P>
                </DescriptionContainer>
                <InputContainer>
                  {' '}
                  <Form.Item label={personRole}>
                    {getFieldDecorator('role', {
                      rules: [{ required: true, message: 'role is required' }]
                    })(<Checkbox.Group options={roleOptions} />)}
                  </Form.Item>
                </InputContainer>
              </FormGrid>
              <Divider />
            </>
          )}

          <FormGrid> {/* // Buttons */}
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

PersonDetail.propTypes = {
  person: PropTypes.shape({
    cuid: PropTypes.string,
    name: PropTypes.string,
    nickname: PropTypes.string,
    about: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.string),
    email: PropTypes.string,
    phone: PropTypes.string,
    sendEmailNotifications: PropTypes.bool,
    facebook: PropTypes.string,
    twitter: PropTypes.string,
    website: PropTypes.string,
    placeOfWork: PropTypes.string,
    pronoun: PropTypes.object,
    job: PropTypes.string,
    imgUrl: PropTypes.any,
    imgUrlSm: PropTypes.string,
    role: PropTypes.arrayOf(
      PropTypes.oneOf([
        'admin',
        'opportunityProvider',
        'volunteer',
        'activityProvider',
        'support'
      ])
    ),
    status: PropTypes.oneOf(['active', 'inactive', 'hold']),
    tags: PropTypes.arrayOf(PropTypes.string)
  }),
  form: PropTypes.object,
  params: PropTypes.shape({
    cuid: PropTypes.string.isRequired
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.string),
  existingTags: PropTypes.arrayOf(PropTypes.string).isRequired
  // dispatch: PropTypes.func.isRequired,
}

const PersonDetailForm = Form.create({
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
      locations: Form.createFormField({
        ...props.person.locations,
        value: props.person.locations
      }),
      education: Form.createFormField({
        ...props.person.education,
        value: props.person.education
      }),
      placeOfWork: Form.createFormField({
        ...props.person.placeOfWork,
        value: props.person.placeOfWork
      }),
      job: Form.createFormField({
        ...props.person.job,
        value: props.person.job
      }),
      email: Form.createFormField({
        ...props.person.email,
        value: props.person.email
      }),
      phone: Form.createFormField({
        ...props.person.phone,
        value: props.person.phone
      }),
      sendEmailNotifications: Form.createFormField({
        ...props.person.sendEmailNotifications,
        value: props.person.sendEmailNotifications
      }),
      pronoun_subject: Form.createFormField({
        ...props.person.pronoun,
        value: props.person.pronoun ? props.person.pronoun.subject : ''
      }),
      pronoun_object: Form.createFormField({
        ...props.person.pronoun,
        value: props.person.pronoun ? props.person.pronoun.object : ''
      }),
      pronoun_possessive: Form.createFormField({
        ...props.person.pronoun,
        value: props.person.pronoun ? props.person.pronoun.possessive : ''
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
  }
})(PersonDetail)

export default connect(store => ({ me: store.session.me }))(PersonDetailForm)
export { PersonDetailForm }

/**
 * Removes any fields from the person object which cannot be altered via the API.
 * @param {*} person The person object to alter.
 * @param {string[]} roles The array of permission roles to use.
 */
export const permissionTrimFields = (person, roles) => {
  if (!roles.includes(Role.ADMIN) && !roles.includes(Role.SUPPORT)) {
    delete person.email
  }

  delete person.createdAt

  const applicableRoles = [Role.ACTIVITY_PROVIDER, Role.ADMIN, Role.OPPORTUNITY_PROVIDER, Role.RESOURCE_PROVIDER, Role.SUPPORT, Role.VOLUNTEER]
  if (person.role) {
    person.role = person.role.filter(role => applicableRoles.includes(role))
  }
}
