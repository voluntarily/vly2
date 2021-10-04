import React, { useState, useEffect } from 'react'
import { Avatar, Button, Checkbox, Divider, Form, Input, Radio, Tooltip, Row, Col } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
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
import { withAddressFinder } from '../Address/AddressFinder'

const developerSettings = process.env.NODE_ENV !== 'production'
const { TextArea } = Input

// TODO - only the owner and admins should be able to edit the person record.
function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

const personEmail = (
  <span>
    <FormattedMessage
      id='personEmail'
      defaultMessage='Email'
      description='person email label in personDetails Form'
    />
    &nbsp;
    <Tooltip title="As we use your email as your unique id you can't change it here. Use the Support menu to ask for an email change.">
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)

const requiredMsg = (
  <FormattedMessage
    id='required'
    defaultMessage='Required'
    description='For Field is required'
  />
)

const personPhone = (
  <FormattedMessage
    id='personPhone'
    defaultMessage='Phone'
    description='person phone label in personDetails Form'
  />
)
const personAddress = (
  <span>
    <FormattedMessage
      id='personAddress'
      defaultMessage='Address'
      description='person physical/postal address label in personDetails Form'
    />
    &nbsp;
    <Tooltip title='Required for volunteers to help verify your identity. Optional for askers but required if you want to get home deliveries'>
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
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
      <QuestionCircleOutlined />
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
      <QuestionCircleOutlined />
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
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)
// get translated labels
const personName = (
  <FormattedMessage
    id='personName'
    defaultMessage='Formal name'
    description='person full name label in PersonDetails Form'
  />
)
const personNickname = (
  <FormattedMessage
    id='personNickname'
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

export const PersonDetailForm = ({ me, person, onCancel, onSubmit, locations, existingTags, scriptLoaded }) => {
  const [form] = Form.useForm()
  const [avatar, setAvatar] = useState({
    lg: person.imgUrl,
    sm: person.imgUrlSm
  })
  // To save various fields of address
  // TODO: [VP-1891] address finder adds duplicate locations to the locations field in the person.
  const [address, setAddress] = useState(person.address)
  const addressListener = () => {
    const widget = new window.AddressFinder.Widget(
      document.getElementById('person_detail_form_address_addressSummary'),
      locations.addressFinderKey, // ADDRESSFINDER_KEY
      'NZ', {
        show_locations: true,
        empty_content: 'No addresses were found. This could be a new address, or you may need to check the spelling.'
      }
    )
    widget.on && widget.on('result:select', (_, metaData) => {
      setAddress({
        street: metaData.address_line_1,
        suburb: metaData.suburb,
        city: metaData.city,
        postcode: metaData.postcode,
        region: metaData.region.replace(/\sRegion/, ''),
        addressSummary: metaData.a
      })
      form.setFieldsValue({
        address: { addressSummary: metaData.a }
      })
    })
  }
  useEffect(() => {
    scriptLoaded && addressListener()
  }, [scriptLoaded])

  // const isTest = process.env.NODE_ENV === 'test'
  const isVolunteer = person.role.some(r => r === Role.VOLUNTEER)

  const onFinish = (values) => {
    // dedup locations.
    values.locations = [...new Set(values.locations)]
    person = {
      ...person,
      ...values,
      address: address
    }
    // console.log('Received values of form: ', values, person)

    permissionTrimFields(person, me.role)
    onSubmit(person)
  }

  const setImgUrl = (imgUrl, sizeVariants) => {
    console.log('setImgUrl', imgUrl, sizeVariants)
    setAvatar(sizeVariants)
    person.imgUrl = imgUrl
    person.imgUrlSm = sizeVariants.sm
  }
  return (
    <Form
      form={form}
      name='person_detail_form'
      layout='vertical'
      initialValues={person}
      onFinish={onFinish}
      size='large'
    >
      <FormGrid> {/* // Your Name */}
        <DescriptionContainer>
          <TitleContainer>
            <H3Bold>
              <FormattedMessage
                id='PersonDetailForm.SectionTitle.YourName'
                defaultMessage='Your name'
              />
            </H3Bold>
          </TitleContainer>
          <P>
            <FormattedMessage
              id='PersonDetailForm.SectionDescription.YourName'
              defaultMessage='Set your nickname and your formal name to help people to recoginise you.'
            />
          </P>
        </DescriptionContainer>
        <InputContainer>
          <ShortInputContainer>
            <Form.Item
              label={personNickname}
              name='nickname'
              required
              // validateStatus={nicknameError ? 'error' : ''}
              // help={nicknameError || ''}
            >
              <Input placeholder='e.g Dali' />
            </Form.Item>
          </ShortInputContainer>
          <ShortInputContainer>
            <Form.Item
              label={personName}
              name='name'
              required
              // validateStatus={nameError ? 'error' : ''}
              // help={nameError || ''}
            >
              <Input placeholder='e.g Salvador' />
            </Form.Item>
          </ShortInputContainer>
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
          {avatar.lg &&
            <p>
              <Avatar size={128} src={avatar.lg} />
              <Avatar size={32} src={avatar.sm} />
            </p>}
        </DescriptionContainer>
        <InputContainer>
          <Form.Item label={personAvatar}>
            <ImageUpload setImgUrl={setImgUrl} usages='profile-photo' />
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
            <Form.Item name='email' label={personEmail}>
              <Input placeholder='salvador@dali.com' readOnly />
            </Form.Item>
          </ShortInputContainer>
          <ShortInputContainer>
            <Form.Item name='phone' label={personPhone}>
              <Input placeholder='000 000 0000' />
            </Form.Item>
          </ShortInputContainer>
          {/* make address required for volunteer for validation purpose and optional for asker */}
          <ShortInputContainer>
            <Form.Item
              name={['address', 'addressSummary']}
              label={personAddress}
              rules={[
                {
                  required: isVolunteer,
                  message: 'Address is required for volunteers'
                }]}
              // validateStatus={addressError ? 'error' : ''}
              // help={addressError || ''}
            >

              <Input placeholder='Physical Address' allowClear />
            </Form.Item>
          </ShortInputContainer>

        </InputContainer>
      </FormGrid>
      <Divider />

      <FormGrid> {/* // Location, Skills and Interests */}
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
            {isVolunteer
              ? (
                <FormattedMessage
                  id='PersonDetailForm.SectionDescription.SkillsAndInterests'
                  defaultMessage='This section helps us find the right things for you to do. Tell us the region you in and your skills and interests. Use keywords like: accounting, video conferencing etc.'
                />
              )
              : (
                <FormattedMessage
                  id='PersonDetailForm.SectionDescription.Location'
                  defaultMessage='This section helps us find the right things for you to do. Tell us the region you in.'
                />
              )}
          </P>
        </DescriptionContainer>
        <InputContainer>
          <Form.Item name='locations' label={personLocation}>
            <TagSelect options={locations?.locations} placeholder='Select location' />
          </Form.Item>
          {isVolunteer && (
            <Form.Item
              name='tags'
              label={personTags}
              required
            >
              <TagInput existingTags={existingTags} />
            </Form.Item>
          )}
        </InputContainer>
      </FormGrid>
      <Divider />
      <FormGrid> {/* // Pronoun */}
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
              defaultMessage='Optional: Tell the people you will be volunteering for something about yourself. And How we should address you.'
            />
          </P>
        </DescriptionContainer>
        <InputContainer>
          <ShortInputContainer>
            <Row>
              <Col span={24}>
                <label>{personPronoun}</label>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item name={['pronoun', 'subject']} layout='inline' style={{ width: '100%', marginRight: 0 }}>
                  <Input placeholder='they' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={['pronoun', 'object']} layout='inline'>
                  <Input placeholder='them' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={['pronoun', 'posessive']} layout='inline'>
                  <Input placeholder='theirs' />
                </Form.Item>
              </Col>
            </Row>
          </ShortInputContainer>
          <Form.Item name='about'>
            <RichTextEditor />
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
          <Form.Item name='facebook' label={personFacebook}>
            <Input addonBefore='https://www.facebook.com/' />
          </Form.Item>
          <Form.Item name='twitter' label={personTwitter}>
            <Input addonBefore='@' />
          </Form.Item>
          <Form.Item
            name='website' label={personWebSite}
            rules={[
              {
                pattern: websiteRegex,
                message: 'Enter valid URL'
              }
            ]}
          >
            <Input placeholder='Website' />
          </Form.Item>
        </InputContainer>
      </FormGrid>
      <Divider />
      <FormGrid> {/* // Work & Education */}
        <DescriptionContainer>
          <TitleContainer>
            <H3Bold>
              <FormattedMessage
                id='PersonDetailForm.SectionTitle.WorkAndEducation'
                defaultMessage='Work &amp; Education'
              />
            </H3Bold>
          </TitleContainer>
          <P>
            <FormattedMessage
              id='PersonDetailForm.SectionDescription.WorkAndEducation'
              defaultMessage='Tell the people your education, place of work and job to help people know you better and help find recommendations.'
            />
          </P>
        </DescriptionContainer>
        <InputContainer>
          <Form.Item name='education' label={personEducation}>
            <EducationSelector />
          </Form.Item>
          <Form.Item name='placeOfWork' label={personplaceOfWork}>
            <Input placeholder='Enter your place of work here' />
          </Form.Item>
          <ShortInputContainer>
            <Form.Item name='job' label={personJob}>
              <Input placeholder='Enter your job title here' />
            </Form.Item>
          </ShortInputContainer>
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
          <Form.Item name='status' label={personStatus} required>
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value='inactive'>Not Available</Radio.Button>
              <Radio.Button value='active'>Available</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name='sendEmailNotifications' valuePropName='checked'>
            <Checkbox>{personSendEmailNotifications}</Checkbox>
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
              <Form.Item name='role' required label={personRole}>
                <Checkbox.Group options={roleOptions} />
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
            onClick={onCancel}
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
  )
}

/* TODO: these should be translated - but we don't as they are developer only */
const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Requestor', value: 'opportunityProvider' },
  { label: 'Volunteer', value: 'volunteer' },
  { label: 'Content provider', value: 'activityProvider' },
  { label: 'SUPPORT', value: 'support' }
]

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

export const PersonDetailFormWithAddressFinder = withAddressFinder(PersonDetailForm)
export default connect(store => ({ me: store.session.me }))(PersonDetailFormWithAddressFinder)
