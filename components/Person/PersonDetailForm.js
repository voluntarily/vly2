/* eslint-disable no-console */
import React, { Component } from 'react'
import { Form, Input, Button, Row, Col, Divider, Radio, Checkbox } from 'antd'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
const { TextArea } = Input

// TODO - only the owner and admins should be able to edit the person record.
function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class PersonDetailForm extends Component {
  componentDidMount () {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // eslint-disable-next-line no-console
        // console.log('Received values of form: ', values)
        // TODO Send new person to database and update the store.
        const person = this.props.person
        person.name = values.name
        person.nickname = values.nickname
        person.email = values.email
        person.phone = values.phone
        person.gender = values.gender
        // person.password = values.password;
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
    const personName = (<FormattedMessage id='personName' defaultMessage='Full Name' description='person full name label in PersonDetails Form' />)
    const personnickname = (<FormattedMessage id='personnickname' defaultMessage='What we should call you' description='person Subtitle label in personDetails Form' />)
    const personEmail = (<FormattedMessage id='personEmail' defaultMessage='Email' description='person email label in personDetails Form' />)
    const personPhone = (<FormattedMessage id='personPhone' defaultMessage='Phone' description='person phone label in personDetails Form' />)
    const personAbout = (<FormattedMessage id='personAbout' defaultMessage='About you' description='person about label in personDetails Form' />)
    const personAvatar = (<FormattedMessage id='personAvatar' defaultMessage='Image Link' description='person Image URL label in personDetails Form' />)
    const personGender = (<FormattedMessage id='personGender' defaultMessage='Gender' description='person gender label in personDetails Form' />)
    const personRole = (<FormattedMessage id='personRole' defaultMessage='Role' description='Admin Role' />)
    const personStatus = (<FormattedMessage id='personStatus' defaultMessage='Status' description='active or retired status' />)
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched
    } = this.props.form

    const roleOptions = [
      { label: 'Admin', value: 'admin' },
      { label: 'Requestor', value: 'op-provider' },
      { label: 'Volunteer', value: 'volunteer' },
      { label: 'Content provider', value: 'content-provider' },
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

    return (
      <div className='PersonDetailForm'>
        <Form
          {...formItemLayout}
          onSubmit={this.handleSubmit}
          hideRequiredMark
          colon={false}
        >
          <Row>
            <Col
              xs={{ span: 24 }}
              md={{ span: 8 }}
            >
              <h2>1. Basic Contact</h2>
              <p>How do we get in touch?
              </p>
            </Col>
            <Col
              xs={{ span: 24 }}
              md={{ span: 16 }}
            >
              <Form.Item
                label={personName}
                validateStatus={nameError ? 'error' : ''}
                help={nameError || ''}
              >
                {getFieldDecorator('name', {
                  rules: [
                    { required: true, message: 'Name is required' }
                  ]
                })(
                  <Input placeholder='e.g. Salvador Felipe Jacinto Dalí y Domenech.' />
                )}
              </Form.Item>
              <Form.Item label={personnickname}>
                {getFieldDecorator('nickname', {
                  rules: []
                })(
                  <Input placeholder='e.g Dali' />
                )}
              </Form.Item>
              <Form.Item label={personEmail}>
                {getFieldDecorator('email', {
                  rules: []
                })(
                  <Input placeholder='salvador@dali.com' />
                )}
              </Form.Item>
              <Form.Item label={personPhone}>
                {getFieldDecorator('phone', {
                  rules: []
                })(
                  <Input placeholder='000 000 0000' />
                )}
              </Form.Item>
              <Form.Item label={personAbout}>
                {getFieldDecorator('about', {
                  rules: [

                  ]
                })(
                  <TextArea rows={20} placeholder='You can use markdown here.' />
                )}
              </Form.Item>
              <Form.Item label={personGender}>
                {getFieldDecorator('gender', {
                  rules: []
                })(
                  <Input placeholder='write what you want here. ' />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Divider />

          <Row>
            <Col
              xs={{ span: 24 }}
              md={{ span: 8 }}
            >
              <h2>Avatar (optional)</h2>
              <p>Help people to recognise you or reflect your character.
              </p>
            </Col>
            <Col
              xs={{ span: 24 }}
              md={{ span: 16 }}
            >
              <Form.Item label={personAvatar}>
                {getFieldDecorator('avatar', {
                  rules: [
                    { type: 'url', message: 'a URL is required' }
                  ]
                })(
                  <Input placeholder='http://example.com/image.jpg' />
                )}
              </Form.Item>
              <Form.Item label={personRole}>
                {getFieldDecorator('role', {
                  rules: [
                    { required: true, message: 'role is required' }
                  ]
                })(
                  <Checkbox.Group
                    options={roleOptions}
                  />
                )}
              </Form.Item>
              <Form.Item label={personStatus}>
                {getFieldDecorator('status', {
                  rules: [
                    { required: true, message: 'status is required' }
                  ]
                })(
                  <Radio.Group buttonStyle='solid'>
                    <Radio.Button value='draft'>Draft</Radio.Button>
                    <Radio.Button value='active'>Active</Radio.Button>
                    <Radio.Button value='done'>Done</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
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
    role: PropTypes.arrayOf(PropTypes.oneOf(['admin', 'op-provider', 'volunteer', 'content-provider', 'tester'])),
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

// TODO replace imageURL field with uploader.
// <Form.Item
//     label="Image"
//   >
//     <div className="dropbox">
//       {getFieldDecorator('dragger', {
//         valuePropName: 'fileList',
//         getValueFromEvent: this.normFile,
//       })(
//         <Upload.Dragger name="files" action="">
//           <p className="ant-upload-drag-icon">
//             <Icon type="inbox" />
//           </p>
//           <p className="ant-upload-text">Click or drag file to this area to upload</p>
//           <p className="ant-upload-hint">Image ideal is 4:3 aspect ratio.</p>
//         </Upload.Dragger>
//       )}
//     </div>
//   </Form.Item>

export default Form.create({
  name: 'person_detail_form',
  onFieldsChange (props, changedFields) {
    // console.log('onFieldsChange', changedFields)
    // props.onChange(changedFields);
  },
  mapPropsToFields (props) {
    return {
      name: Form.createFormField({ ...props.person.name, value: props.person.name }),
      nickname: Form.createFormField({ ...props.person.nickname, value: props.person.nickname }),
      about: Form.createFormField({ ...props.person.about, value: props.person.about }),
      email: Form.createFormField({ ...props.person.email, value: props.person.email }),
      phone: Form.createFormField({ ...props.person.phone, value: props.person.phone }),
      gender: Form.createFormField({ ...props.person.gender, value: props.person.gender }),
      avatar: Form.createFormField({ ...props.person.avatar, value: props.person.avatar }),
      role: Form.createFormField({ ...props.person.role, value: props.person.role }),
      status: Form.createFormField({ ...props.person.status, value: props.person.status })
    }
  },
  onValuesChange (_, values) {
    // console.log('onValuesChange', values)
  }
})(PersonDetailForm)
