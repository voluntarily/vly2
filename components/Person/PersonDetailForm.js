import React, { useState, Component, forwardRef } from 'react'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Avatar, Button, Checkbox, Divider, Input, Radio, Tooltip, Row, Col } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

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

const EducationSelectorRef = forwardRef(EducationSelector)
const TagSelectRef = forwardRef(TagSelect)
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
// const addressListener = () => {
//   const widget = new window.AddressFinder.Widget(
//     document.getElementById('person_detail_form_address'),
//     this.props.locations.addressFinderKey, // ADDRESSFINDER_KEY
//     'NZ', {
//       show_locations: true,
//       empty_content: 'No addresses were found. This could be a new address, or you may need to check the spelling.'
//     }
//   )
//   widget.on('result:select', (_, metaData) => {
//     const region = metaData.region.replace(/\sRegion/, '')
//     this.address.street = metaData.address_line_1
//     this.address.suburb = metaData.suburb
//     this.address.city = metaData.city
//     this.address.postcode = metaData.postcode
//     this.address.region = region
//     this.address.addressSummary = metaData.a
//     this.props.form.setFieldsValue({ address: metaData.a })
//   })
// }

const PersonDetailForm = ({ person }) => {
  // const [imgUrl, setImgUrl] = useState('')
  // To save various fields of address
  // const [address, setAddress] = useState({
  //   street: null,
  //   suburb: null,
  //   city: null,
  //   postcode: null,
  //   region: null,
  //   addressSummary: null
  // })

  const onFinish = (values) => {
    console.log('Received values of form: ', values)
  }

  return (
    <Form
      name='person_detail_form'
      layout='horizontal'
      onFinish={onFinish}
      // fields={fields}
      // onFieldsChange={(_, allFields) => {
      //   onChange(allFields);
      // }}
    >
      <Form.Item
        label={personNickname}
        name='personNickname'
        rules={[
          {
            required: true,
            message: <requiredMsg />
          }
        ]}
        // validateStatus={nicknameError ? 'error' : ''}
        // help={nicknameError || ''}
      >
        <Input placeholder='e.g Dali' />
      </Form.Item>
    </Form>
  )
}

// componentDidUpdate (prevProps, prevState) {
//   if (this.props.scriptLoaded !== prevProps.scriptLoaded) {
//     this.addressListener()
//   }
// }

// const updateImgUrl = (imgUrl, sizeVariants) => {
//   avatar = sizeVariants
//   this.props.person.imgUrl = imgUrl
//   setImgUrl(imgUrl)
// }

// const onFinish = handleSubmit = e => {
//   e.preventDefault()
//   console.log('handleSubmit')
// this.props.form.validateFields((err, values) => {
//   if (!err) {
//     const person = this.props.person
//     person.name = values.name
//     person.nickname = values.nickname
//     person.email = values.email
//     person.phone = values.phone
//     person.address = this.address.addressSummary ? this.address : this.props.person.address
//     person.sendEmailNotifications = values.sendEmailNotifications
//     person.pronoun = {
//       subject: values.pronoun_subject,
//       object: values.pronoun_object,
//       possessive: values.pronoun_possessive
//     }
//     person.about = values.about
//     person.locations = values.locations
//     person.tags = values.tags

//     person.website = values.website
//     person.twitter = values.twitter
//     person.facebook = values.facebook
//     if (this.avatar) {
//       person.imgUrl = this.avatar.lg
//       person.imgUrlSm = this.avatar.sm
//     }

//     if (developerSettings) {
//       person.role = values.role
//     }
//     person.status = values.status
//     person.education = values.education
//     person.placeOfWork = values.placeOfWork
//     person.job = values.job
//     window.scrollTo(0, 0)
//     permissionTrimFields(person, this.props.me.role)
//     this.props.onSubmit(person)
//   }
// })

//     const roleOptions = [
//       { label: 'Admin', value: 'admin' },
//       { label: 'Requestor', value: 'opportunityProvider' },
//       { label: 'Volunteer', value: 'volunteer' },
//       { label: 'Content provider', value: 'activityProvider' },
//       { label: 'SUPPORT', value: 'support' }
//     ]
//     // Only show error after a field is touched.
//     const nameError = isFieldTouched('name') && getFieldError('name')
//     const nicknameError = isFieldTouched('nickname') && getFieldError('nickname')
//     const tagsError = isFieldTouched('tags') && getFieldError('tags')
//     const addressError = isFieldTouched('address') && getFieldError('address')
//     const isTest = process.env.NODE_ENV === 'test'
//     const isVolunteer = this.props.person.role.some(r => r === 'volunteer')

//     return (
//       <div className='PersonDetailForm'>
//         <Form onSubmit={this.handleSubmit} colon={false}>
//           <FormGrid> {/* // Your Name */}
//             <DescriptionContainer>
//               <TitleContainer>
//                 <H3Bold>
//                   <FormattedMessage
//                     id='PersonDetailForm.SectionTitle.YourName'
//                     defaultMessage='Your name'
//                   />
//                 </H3Bold>
//               </TitleContainer>
//               <P>
//                 <FormattedMessage
//                   id='PersonDetailForm.SectionDescription.YourName'
//                   defaultMessage='Set your nickname and your formal name to help people to recoginise you.'
//                 />
//               </P>
//             </DescriptionContainer>
//             <InputContainer>
//               <ShortInputContainer>
//                 <Form.Item
//                   label={personNickname}
//                   validateStatus={nicknameError ? 'error' : ''}
//                   help={nicknameError || ''}
//                 >
//                   {getFieldDecorator('nickname', {
//                     rules: []
//                   })(<Input placeholder='e.g Dali' />)}
//                 </Form.Item>
//               </ShortInputContainer>
//               <ShortInputContainer>
//                 <Form.Item
//                   label={personName}
//                   validateStatus={nameError ? 'error' : ''}
//                   help={nameError || ''}
//                 >
//                   {getFieldDecorator('name', {
//                     rules: [{ required: true, message: 'Name is required' }]
//                   })(
//                     <Input placeholder='e.g. Salvador Felipe Jacinto Dalí y Domenech.' />
//                   )}
//                 </Form.Item>
//               </ShortInputContainer>
//             </InputContainer>
//           </FormGrid>
//           <Divider />
//           <FormGrid> {/* // Avatar */}
//             <DescriptionContainer>
//               <H3Bold>
//                 <FormattedMessage
//                   id='PersonDetailForm.SectionTitle.Avatar'
//                   defaultMessage='Profile Photo'
//                 />
//               </H3Bold>
//               <FormattedMessage
//                 id='PersonDetailForm.SectionDescription.Avatar'
//                 defaultMessage='Upload a photo to help people to recognise you and reflect your character.'
//               />
//               {this.state.imgUrl &&
//                 <p>
//                   <Avatar size={128} src={this.state.imgUrl} />
//                 </p>}
//             </DescriptionContainer>
//             <InputContainer>
//               <Form.Item label={personAvatar}>
//                 <ImageUpload setImgUrl={updateImgUrl} usages='profile-photo' />
//               </Form.Item>
//             </InputContainer>
//           </FormGrid>
//           <Divider />
//           <FormGrid> {/* // Contact Details */}
//             <DescriptionContainer>
//               <TitleContainer>
//                 <H3Bold>
//                   <FormattedMessage
//                     id='PersonDetailForm.SectionTitle.ContactDetails'
//                     defaultMessage='Contact details'
//                   />
//                 </H3Bold>
//               </TitleContainer>
//               <P>
//                 <FormattedMessage
//                   id='PersonDetailForm.SectionDescription.ContactDetails'
//                   defaultMessage='How do you want people to get in touch with you? Other people can only see this if you let them 🤫'
//                 />
//               </P>
//             </DescriptionContainer>
//             <InputContainer>
//               <ShortInputContainer>
//                 <Form.Item label={personEmail}>
//                   {getFieldDecorator('email')(<Input placeholder='salvador@dali.com' readOnly />)}
//                 </Form.Item>
//               </ShortInputContainer>
//               <ShortInputContainer>
//                 <Form.Item label={personPhone}>
//                   {getFieldDecorator('phone')(<Input placeholder='000 000 0000' />)}
//                 </Form.Item>
//               </ShortInputContainer>
//               {/* make address required for volunteer for validation purpose and optional for asker */}
//               {isVolunteer
//                 ? (
//                   <ShortInputContainer>
//                     <Form.Item
//                       label={personAddress}
//                       validateStatus={addressError ? 'error' : ''}
//                       help={addressError || ''}
//                     >
//                       {getFieldDecorator('address', {
//                         rules: [{ required: true, message: 'Address is required for volunteers' }]
//                       })(<Input placeholder='Physical Address' allowClear />)}
//                     </Form.Item>
//                   </ShortInputContainer>
//                 ) : (
//                   <ShortInputContainer>
//                     <Form.Item
//                       label={personAddress}
//                     >
//                       {getFieldDecorator('address', {
//                         rules: []
//                       })(<Input placeholder='Physical or Postal Address' allowClear />)}
//                     </Form.Item>
//                   </ShortInputContainer>
//                 )}
//             </InputContainer>
//           </FormGrid>
//           <Divider />
//           <FormGrid> {/* // Location, Skills and Interests */}
//             <DescriptionContainer>
//               <TitleContainer>
//                 <H3Bold>
//                   <FormattedMessage
//                     id='PersonDetailForm.SectionTitle.SkillsAndInterests'
//                     defaultMessage='Activity Recommendations'
//                   />
//                 </H3Bold>
//               </TitleContainer>
//               <P>
//                 {isVolunteer
//                   ? (
//                     <FormattedMessage
//                       id='PersonDetailForm.SectionDescription.SkillsAndInterests'
//                       defaultMessage='This section helps us find the right things for you to do. Tell us the region you in and your skills and interests. Use keywords like: accounting, video conferencing etc.'
//                     />
//                   )
//                   : (
//                     <FormattedMessage
//                       id='PersonDetailForm.SectionDescription.Location'
//                       defaultMessage='This section helps us find the right things for you to do. Tell us the region you in.'
//                     />
//                   )}
//               </P>
//             </DescriptionContainer>
//             <InputContainer>
//               <Form.Item label={personLocation}>
//                 {getFieldDecorator('locations')(
//                   <TagSelectRef values={this.props.locations.locations} placeholder='Select location' />
//                 )}
//               </Form.Item>
//               {isVolunteer && (
//                 <Form.Item
//                   label={personTags}
//                   validateStatus={tagsError ? 'error' : ''}
//                   help={tagsError || ''}
//                 >
//                   {getFieldDecorator('tags', {
//                     initialValue: [],
//                     rules: [{ required: true, message: 'Skills & Interests are required' }]
//                   })(<TagInput existingTags={this.props.existingTags} />)}
//                 </Form.Item>
//               )}
//             </InputContainer>
//           </FormGrid>
//           <Divider />
//           <FormGrid> {/* // Pronoun */}
//             <DescriptionContainer>
//               <TitleContainer>
//                 <H3Bold>
//                   <FormattedMessage
//                     id='PersonDetailForm.SectionTitle.AboutYou'
//                     defaultMessage='About you'
//                   />
//                 </H3Bold>
//               </TitleContainer>
//               <P>
//                 <FormattedMessage
//                   id='PersonDetailForm.SectionDescription.AboutYou'
//                   defaultMessage='Optional: Tell the people you will be volunteering for something about yourself. And How we should address you.'
//                 />
//               </P>
//             </DescriptionContainer>
//             <InputContainer>
//               <ShortInputContainer>
//                 <Row>
//                   <Col span={24}>
//                     <label>{personPronoun}</label>
//                   </Col>
//                 </Row>
//                 <Row>
//                   <Col span={8}>
//                     <Form.Item layout='inline' style={{ width: '100%', marginRight: 0 }}>
//                       {getFieldDecorator('pronoun_subject', {
//                         rules: []
//                       })(<Input placeholder='they' />)}
//                     </Form.Item>
//                   </Col>
//                   <Col span={8}>
//                     <Form.Item layout='inline'>
//                       {getFieldDecorator('pronoun_object', {
//                         rules: []
//                       })(<Input placeholder='them' />)}
//                     </Form.Item>
//                   </Col>
//                   <Col span={8}>
//                     <Form.Item layout='inline'>
//                       {getFieldDecorator('pronoun_possessive', {
//                         rules: []
//                       })(<Input placeholder='theirs' />)}
//                     </Form.Item>
//                   </Col>
//                 </Row>
//               </ShortInputContainer>
//               <Form.Item label={personAbout}>
//                 {getFieldDecorator('about', {
//                   rules: []
//                 })(
//                   isTest ? (
//                     <TextArea
//                       rows={20}
//                       placeholder='Tell everyone about yourself here'
//                     />
//                   ) : (
//                     <RichTextEditor />
//                   )
//                 )}
//               </Form.Item>
//             </InputContainer>
//           </FormGrid>
//           <Divider />
//           <FormGrid> {/* // Social Links - Optional */}
//             <DescriptionContainer>
//               <TitleContainer>
//                 <H3Bold>
//                   <FormattedMessage
//                     id='PersonDetailForm.SectionTitle.SocialLinks'
//                     defaultMessage='Social Media'
//                   />
//                 </H3Bold>
//               </TitleContainer>
//               <P>
//                 <FormattedMessage
//                   id='PersonDetailForm.SectionDescription.SocialLinks'
//                   defaultMessage='Optional: Share your social media links so the groups you work with can follow your social network.'
//                 />
//               </P>
//             </DescriptionContainer>
//             <InputContainer>
//               <Form.Item label={personFacebook}>
//                 {getFieldDecorator('facebook', {
//                   rules: []
//                 })(<Input addonBefore='https://www.facebook.com/' />)}
//               </Form.Item>
//               <Form.Item label={personTwitter}>
//                 {getFieldDecorator('twitter', {})(<Input addonBefore='@' />)}
//               </Form.Item>
//               <Form.Item label={personWebSite}>
//                 {getFieldDecorator('website', {
//                   rules: [
//                     {
//                       pattern: websiteRegex,
//                       message: 'Enter valid URL'
//                     }
//                   ]
//                 })(<Input placeholder='Website' />)}
//               </Form.Item>
//             </InputContainer>
//           </FormGrid>
//           <Divider />
//           <FormGrid> {/* // Work & Education */}
//             <DescriptionContainer>
//               <TitleContainer>
//                 <H3Bold>
//                   <FormattedMessage
//                     id='PersonDetailForm.SectionTitle.WorkAndEducation'
//                     defaultMessage='Work & Education'
//                   />
//                 </H3Bold>
//               </TitleContainer>
//               <P>
//                 <FormattedMessage
//                   id='PersonDetailForm.SectionDescription.WorkAndEducation'
//                   defaultMessage='Tell the people your education, place of work and job to help people know you better and help find recommendations.'
//                 />
//               </P>
//             </DescriptionContainer>
//             <InputContainer>
//               <Form.Item label={personEducation}>
//                 {getFieldDecorator('education')(
//                   <EducationSelectorRef />
//                 )}
//               </Form.Item>
//               <Form.Item label={personplaceOfWork}>
//                 {getFieldDecorator('placeOfWork')(
//                   <Input placeholder='Enter your place of work here' />
//                 )}
//               </Form.Item>
//               <ShortInputContainer>
//                 <Form.Item label={personJob}>
//                   {getFieldDecorator('job')(
//                     <Input placeholder='Enter your job title here' />
//                   )}
//                 </Form.Item>
//               </ShortInputContainer>
//             </InputContainer>
//           </FormGrid>
//           <Divider />
//           <FormGrid> {/* // Settings */}
//             <DescriptionContainer>
//               <TitleContainer>
//                 <H3Bold>
//                   <FormattedMessage
//                     id='PersonDetailForm.SectionTitle.Settings'
//                     defaultMessage='Settings'
//                   />
//                 </H3Bold>
//               </TitleContainer>
//               <P>
//                 <FormattedMessage
//                   id='PersonDetailForm.SectionDescription.Settings'
//                   defaultMessage='Control your availability for volunteering and whether to receive emails.'
//                 />
//               </P>
//             </DescriptionContainer>
//             <InputContainer>
//               <Form.Item label={personStatus}>
//                 {getFieldDecorator('status', {
//                   rules: [{ required: true, message: 'availability is required' }]
//                 })(
//                   <Radio.Group buttonStyle='solid'>
//                     <Radio.Button value='inactive'>Not Available</Radio.Button>
//                     <Radio.Button value='active'>Available</Radio.Button>
//                   </Radio.Group>
//                 )}
//               </Form.Item>
//               <Form.Item>
//                 {getFieldDecorator('sendEmailNotifications', {
//                   valuePropName: 'checked'
//                 })(<Checkbox>{personSendEmailNotifications}</Checkbox>)}
//               </Form.Item>
//             </InputContainer>
//           </FormGrid>
//           <Divider />
//           {developerSettings && (
//             <>
//               <FormGrid> {/* // Dev Settings */}
//                 <DescriptionContainer>
//                   <TitleContainer>
//                     <H3Bold>Developer Settings</H3Bold>
//                   </TitleContainer>
//                   <P>This section is only available to developers.</P>
//                 </DescriptionContainer>
//                 <InputContainer>
//                   {' '}
//                   <Form.Item label={personRole}>
//                     {getFieldDecorator('role', {
//                       rules: [{ required: true, message: 'role is required' }]
//                     })(<Checkbox.Group options={roleOptions} />)}
//                   </Form.Item>
//                 </InputContainer>
//               </FormGrid>
//               <Divider />
//             </>
//           )}
//           <FormGrid> {/* // Buttons */}
//             <DescriptionContainer />
//             <InputContainer>
//               <Button
//                 type='secondary'
//                 htmlType='button'
//                 onClick={this.props.onCancel}
//               >
//                 <FormattedMessage
//                   id='cancel'
//                   defaultMessage='Cancel'
//                   description='Label for cancel button on person details form'
//                 />
//               </Button>
//               <Button
//                 type='primary'
//                 htmlType='submit'
//                 disabled={hasErrors(getFieldsError())}
//                 style={{ marginLeft: 8 }}
//               >
//                 <FormattedMessage
//                   id='savePerson'
//                   defaultMessage='Save'
//                   description='Label for submit button on person details form'
//                 />
//               </Button>
//             </InputContainer>
//           </FormGrid>
//         </Form>
//       </div>
//     )
//   }
// }

// PersonDetail.propTypes = {
//   person: PropTypes.shape({
//     cuid: PropTypes.string,
//     name: PropTypes.string,
//     nickname: PropTypes.string,
//     about: PropTypes.string,
//     locations: PropTypes.arrayOf(PropTypes.string),
//     address: PropTypes.shape({
//       street: PropTypes.string,
//       suburb: PropTypes.string,
//       city: PropTypes.string,
//       postcode: PropTypes.string,
//       region: PropTypes.string,
//       addressSummary: PropTypes.string
//     }),
//     email: PropTypes.string,
//     phone: PropTypes.string,
//     sendEmailNotifications: PropTypes.bool,
//     facebook: PropTypes.string,
//     twitter: PropTypes.string,
//     website: PropTypes.string,
//     placeOfWork: PropTypes.string,
//     pronoun: PropTypes.object,
//     job: PropTypes.string,
//     imgUrl: PropTypes.any,
//     imgUrlSm: PropTypes.string,
//     role: PropTypes.arrayOf(
//       PropTypes.oneOf([
//         'admin',
//         'opportunityProvider',
//         'volunteer',
//         'activityProvider',
//         'support'
//       ])
//     ),
//     status: PropTypes.oneOf(['active', 'inactive', 'hold']),
//     tags: PropTypes.arrayOf(PropTypes.string)
//   }),
//   form: PropTypes.object,
//   params: PropTypes.shape({
//     cuid: PropTypes.string.isRequired
//   }),
//   onSubmit: PropTypes.func.isRequired,
//   onCancel: PropTypes.func.isRequired,
//   locations: PropTypes.shape({
//     locations: PropTypes.arrayOf(PropTypes.string),
//     addressFinderKey: PropTypes.string
//   }),
//   existingTags: PropTypes.arrayOf(PropTypes.string).isRequired
//   // dispatch: PropTypes.func.isRequired,
// }

// const PersonDetailForm = Form.create({
//   name: 'person_detail_form',
//   onFieldsChange (props, changedFields) {
//     // props.onChange(changedFields)
//   },
//   mapPropsToFields (props) {
//     return {
//       name: Form.createFormField({
//         ...props.person.name,
//         value: props.person.name
//       }),
//       nickname: Form.createFormField({
//         ...props.person.nickname,
//         value: props.person.nickname
//       }),
//       about: Form.createFormField({
//         ...props.person.about,
//         value: props.person.about
//       }),
//       locations: Form.createFormField({
//         ...props.person.locations,
//         value: props.person.locations
//       }),
//       education: Form.createFormField({
//         ...props.person.education,
//         value: props.person.education
//       }),
//       placeOfWork: Form.createFormField({
//         ...props.person.placeOfWork,
//         value: props.person.placeOfWork
//       }),
//       job: Form.createFormField({
//         ...props.person.job,
//         value: props.person.job
//       }),
//       email: Form.createFormField({
//         ...props.person.email,
//         value: props.person.email
//       }),
//       phone: Form.createFormField({
//         ...props.person.phone,
//         value: props.person.phone
//       }),
//       address: Form.createFormField({
//         ...props.person.address,
//         value: props.person.address ? props.person.address.addressSummary : ''
//       }),
//       sendEmailNotifications: Form.createFormField({
//         ...props.person.sendEmailNotifications,
//         value: props.person.sendEmailNotifications
//       }),
//       pronoun_subject: Form.createFormField({
//         ...props.person.pronoun,
//         value: props.person.pronoun ? props.person.pronoun.subject : ''
//       }),
//       pronoun_object: Form.createFormField({
//         ...props.person.pronoun,
//         value: props.person.pronoun ? props.person.pronoun.object : ''
//       }),
//       pronoun_possessive: Form.createFormField({
//         ...props.person.pronoun,
//         value: props.person.pronoun ? props.person.pronoun.possessive : ''
//       }),
//       facebook: Form.createFormField({
//         ...props.person.facebook,
//         value: props.person.facebook
//       }),
//       twitter: Form.createFormField({
//         ...props.person.twitter,
//         value: props.person.twitter
//       }),
//       website: Form.createFormField({
//         ...props.person.website,
//         value: props.person.website
//       }),
//       role: Form.createFormField({
//         ...props.person.role,
//         value: props.person.role
//       }),
//       status: Form.createFormField({
//         ...props.person.status,
//         value: props.person.status
//       }),
//       tags: Form.createFormField({
//         ...props.person.tags,
//         value: props.person.tags
//       })
//     }
//   },
//   onValuesChange (_, values) {
//   }
// })(withAddressFinder(PersonDetail))

export default connect(store => ({ me: store.session.me }))(PersonDetailForm)
export { PersonDetailForm }

/**
 * Removes any fields from the person object which cannot be altered via the API.
 * @param {*} person The person object to alter.
 * @param {string[]} roles The array of permission roles to use.
 */
// export const permissionTrimFields = (person, roles) => {
//   if (!roles.includes(Role.ADMIN) && !roles.includes(Role.SUPPORT)) {
//     delete person.email
//   }

//   delete person.createdAt

//   const applicableRoles = [Role.ACTIVITY_PROVIDER, Role.ADMIN, Role.OPPORTUNITY_PROVIDER, Role.RESOURCE_PROVIDER, Role.SUPPORT, Role.VOLUNTEER]
//   if (person.role) {
//     person.role = person.role.filter(role => applicableRoles.includes(role))
//   }
// }
