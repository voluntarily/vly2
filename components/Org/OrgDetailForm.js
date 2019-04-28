import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Radio } from 'antd'
import { FormattedMessage } from 'react-intl'
const { TextArea } = Input

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class OrgDetailForm extends Component {
  componentDidMount () {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // eslint-disable-next-line no-console
        console.log('Received values of form: ', values)
        // preserve the id and other values not edited by form.
        const org = this.props.org
        // update the rest from the form values.
        org.name = values.name
        org.about = values.about
        org.imgUrl = values.imgUrl
        org.type = values.type

        this.props.onSubmit(this.props.org)
      }
    })
  }

  render () {
    // get translated labels
    const orgName = <FormattedMessage id='orgName' defaultMessage='Title' about='organisation Title label in OrgDetails Form' />
    const orgAbout = <FormattedMessage id='orgAbout' defaultMessage='About' about='organisation Description label in OrgDetails Form' />
    const orgImgUrl = <FormattedMessage id='orgImgUrl' defaultMessage='Image Link' about='organisation Image URL label in OrgDetails Form' />
    const orgType = <FormattedMessage id='orgType' defaultMessage='Type' about='school, business or activity provider' />

    // TODO conver type to allow multiples
    // const typeOptions = [
    //   { label: 'Business', value: 'volunteer-provider' },
    //   { label: 'School', value: 'op-provider' },
    //   { label: 'Activity provider', value: 'content-provider' }
    // ]

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
        sm: { span: 20 },
        md: { span: 16 }
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
          <Row>
            <Col
              xs={{ span: 24 }}
              md={{ span: 16 }}
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
                  <TextArea rows={20} placeholder='Tell us about your organisation. You can use markdown here. and include links' />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col
              xs={{ span: 24 }}
              md={{ span: 16 }}
            >
              <Form.Item label={orgImgUrl}>
                {getFieldDecorator('imgUrl', {
                  rules: [
                    { type: 'url', message: 'a URL is required' }
                  ]
                })(
                  <Input placeholder='http://example.com/image.jpg' />
                )}
              </Form.Item>
              <Form.Item label={orgType}>
                {getFieldDecorator('type', {
                  rules: [
                    { required: true, message: 'type is required' }
                  ]
                })(
                  // <Checkbox.Group
                  //   options={typeOptions}
                  // />
                  <Radio.Group buttonStyle='solid'>
                    <Radio.Button value='op'>School</Radio.Button>
                    <Radio.Button value='vp'>Business</Radio.Button>
                    <Radio.Button value='act'>Activity Provider</Radio.Button>
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
                  about='Label for cancel button on organisation details form'
                />
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                disabled={hasErrors(getFieldsError())}
                style={{ marginLeft: 8 }}
              >
                <FormattedMessage
                  id='saveOpportunity'
                  defaultMessage='Save'
                  about='Label for submit button on organisation details form'
                />
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

OrgDetailForm.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
    _id: PropTypes.string.isRequired
  }).isRequired,
  form: PropTypes.object,
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
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
  name: 'organisation_detail_form',
  onFieldsChange (props, changedFields) {
    console.log('onFieldsChange', changedFields)
    // props.onChange(changedFields);
  },
  mapPropsToFields (props) {
    console.log('mapPropsToFields', props)
    return {
      name: Form.createFormField({ ...props.org.name, value: props.org.name }),
      about: Form.createFormField({ ...props.org.about, value: props.org.about }),
      imgUrl: Form.createFormField({ ...props.org.imgUrl, value: props.org.imgUrl }),
      type: Form.createFormField({ ...props.org.type, value: props.org.type })
    }
  },
  onValuesChange (_, values) {
    console.log('onValuesChange', values)
  }
})(OrgDetailForm)
