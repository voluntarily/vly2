
import { Button, Form, Modal, Checkbox } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { FormattedMessage } from 'react-intl'
import { useState } from 'react'
function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}
// todo - get terms accepted from the interest record.

/* when person clicks I'm Interested a popup form shows a text field
 and check box for accept terms, click the terms string to open terms in another window
 OK on the text box completes the interested record with the given message
 Cancel just returns to the previous state.
 This happens each time the state is changed.

 Form calls back onSubmit false if cancelled and form fields in ok.
 */

const RegisterInterestForm = ({
  form,
  visible,
  values,
  prevAccepted,
  onSubmit,
  placeholder,
  title
}) => {
  const [termsAccepted, setTermsAccepted] = useState(prevAccepted)
  const handleOk = (e) => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(true, values)
      }
    })
  }
  const handleCancel = (e) => {
    onSubmit(false)
  }

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={380}
      footer={[
        <Button key='esc' shape='round' onClick={handleCancel}>
          <FormattedMessage id='RegisterInterestMessageForm.cancel' defaultMessage='Cancel' description='Cancel button on popup form' />
        </Button>,
        <Button
          key='submit' type='primary' shape='round'
          disabled={hasErrors(form.getFieldsError()) || !termsAccepted}
          onClick={handleOk}
        >
          <FormattedMessage id='RegisterInterestMessageForm.send' defaultMessage='Send' description='Send button on popup form' />
        </Button>
      ]}
    >
      <Form.Item>
        {form.getFieldDecorator('message', {
          rules: [
            { required: true, message: 'message is required' }
          ]
        })(
          <TextArea
            rows='3'
            placeholder={placeholder}
            maxLength='200'
          />
        )}
      </Form.Item>
      {!termsAccepted && (
        <Form.Item>
          {form.getFieldDecorator('accepted', {
            rules: [
              { required: true, message: 'message is required' }
            ]
          })(
            <Checkbox
              defaultChecked={!!termsAccepted}
              onChange={e => setTermsAccepted(e.target.checked)}
            >
              <FormattedMessage
                id='registerinterestitem.accepttcs'
                defaultMessage='I accept the '
              />
              <a
                href='/terms'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FormattedMessage
                  id='registerinterestitem.termsandconditions'
                  defaultMessage='Terms and Conditions'
                />
              </a>
            </Checkbox>
          )}

        </Form.Item>
      )}
    </Modal>

  )
}

// Adds form logic to this component
const RegisterInterestMessageForm = Form.create({
  name: 'register_interest_form',
  mapPropsToFields ({ defaultmessage, prevAccepted }) {
    return {
      message: Form.createFormField({ value: defaultmessage }),
      accepted: Form.createFormField({ value: prevAccepted })
    }
  }
})(RegisterInterestForm)

export default RegisterInterestMessageForm
