import { Button, Checkbox, Form, Input } from 'antd'
import slug from 'limax'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import RichTextEditor from '../Form/Input/RichTextEditor'
import ImageUpload from '../UploadComponent/ImageUploadComponent'

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class OrgDetailForm extends Component {
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
  setImgUrl = (value) => {
    this.props.form.setFieldsValue({ imgUrl: value })
  }

  setContactEmailUrl = (value) => {
    this.props.form.setFieldsValue({ contactEmail: value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // preserve the id and other values not edited by form.
        const org = this.props.org
        // update the rest from the form values.
        org.name = values.name
        org.slug = slug(values.name)
        org.about = values.about
        org.imgUrl = values.imgUrl
        org.type = values.type
        org.contactEmail = values.contactEmail

        this.props.onSubmit(this.props.org)
      }
    })
  }

  render () {
    // get translated labels
    const orgName = <FormattedMessage id='orgName' defaultMessage='Title' about='organisation Title label in OrgDetails Form' />
    const orgAbout = <FormattedMessage id='orgAbout' defaultMessage='About' about='organisation Description label in OrgDetails Form' />
    const orgImgUrl = <FormattedMessage id='orgImgUrl' defaultMessage='Image Link' about='organisation Image URL label in OrgDetails Form' />
    const orgContactEmail = <FormattedMessage id='orgContactEmail' defaultMessage='Contact Email' about='contact Email labek in OrgDetails Form' />
    const orgType = <FormattedMessage id='orgType' defaultMessage='Type' about='school, business or activity provider' />

    // TODO translate
    const typeOptions = [
      { label: 'Business', value: 'vp' },
      { label: 'School', value: 'op' },
      { label: 'Activity provider', value: 'ap' },
      { label: 'Agency', value: 'admin' },
      { label: 'Other', value: 'other' }
    ]

    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched
    } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    }

    // Only show error after a field is touched.
    const orgNameError = isFieldTouched('name') && getFieldError('name')

    return (
      <div className='OrgDetailForm'>
        <Form
          {...formItemLayout}
          onSubmit={this.handleSubmit}
          hideRequiredMark
          colon={false}
        >
          <Form.Item
            label={orgName}
            validateStatus={orgNameError ? 'error' : ''}
            help={orgNameError || ''}
          >
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: 'A name is required' }
              ]
            })(
              <Input placeholder='Organisation Name' />
            )}
          </Form.Item>
          <Form.Item label={orgAbout}>
            {getFieldDecorator('about', {
              rules: [

              ]
            })(
              // <TextArea rows={20} placeholder='Tell us about your organisation. You can use markdown here. and include links' />
              <RichTextEditor onChange={this.setAbout} />
            )}
          </Form.Item>
          <Form.Item label={orgImgUrl}>
            {getFieldDecorator('imgUrl', {
              rules: []
            })(
              <Input />
            )}
            <ImageUpload setImgUrl={this.setImgUrl} />
          </Form.Item>
          <Form.Item label={orgContactEmail}>
            {getFieldDecorator('contactEmail', {
              rules: [

              ]
            })(
              // <TextArea rows={20} placeholder='Enter email address for organisations contact person' />
              <Input placeholder='example@gmail.com' />
            )}
          </Form.Item>
          <Form.Item label={orgType}>
            {getFieldDecorator('type', {
              rules: [
                { required: true, message: 'type is required' }
              ]
            })(
              <Checkbox.Group
                options={typeOptions}
              />
            )}
          </Form.Item>
          <Button
            type='secondary'
            htmlType='button'
            shape='round'
            onClick={this.props.onCancel}
          >
            <FormattedMessage
              id='org.cancel'
              defaultMessage='Cancel'
              about='Label for cancel button on organisation details form'
            />
          </Button>
          <Button
            type='primary'
            htmlType='submit'
            shape='round'
            disabled={hasErrors(getFieldsError())}
            style={{ marginLeft: 8 }}
          >
            <FormattedMessage
              id='org.save'
              defaultMessage='Save'
              shape='round'
              about='Label for submit button on organisation details form'
            />
          </Button>
        </Form>
      </div>
    )
  }
}

OrgDetailForm.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string,
    about: PropTypes.string,
    type: PropTypes.arrayOf(PropTypes.oneOf(['admin', 'op', 'vp', 'ap', 'other'])),
    imgUrl: PropTypes.string,
    contactEmail: PropTypes.string,
    _id: PropTypes.string
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
    // console.log('onFieldsChange', changedFields)
    // props.onChange(changedFields);
  },
  mapPropsToFields (props) {
    return {
      name: Form.createFormField({ ...props.org.name, value: props.org.name }),
      about: Form.createFormField({ ...props.org.about, value: props.org.about }),
      imgUrl: Form.createFormField({ ...props.org.imgUrl, value: props.org.imgUrl }),
      contactEmail: Form.createFormField({ ...props.org.contactEmail, value: props.org.contactEmail }),
      type: Form.createFormField({ ...props.org.type, value: props.org.type })
    }
  },
  onValuesChange (_, values) {
    // console.log('onValuesChange', values)
  }
})(OrgDetailForm)
