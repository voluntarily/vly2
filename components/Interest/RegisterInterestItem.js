/*
  Dumb component. Contains information about a volunteer's interest in an opportunity. Unlike InterestItem, this one is a Form allowing state changes.
*/

import React, { Component } from 'react'
import { Button, Col, Divider, Form, Input, Radio, Row } from 'antd'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import TextArea from 'antd/lib/input/TextArea';

class RegisterInterestItem extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isFormVisible: false
    }
  }

  componentDidMount() {

  }

  handleChangeStateButtonClicked() {
    console.log('Action button clicked!')
  }

  render() {

    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched
    } = this.props.form

    let buttonText = 'The Button!'
    // TODO Change button text based on current state

    // Show the form if we're freshly registering our interest and have already clicked "I'm Interested", or if
    // we're editing an already-existing interest.
    if (this.state.isFormVisible || this.props.interest.state) {
      return (
        <div>
          <Form>
            <Row>
              <h1>How do you want to get involved?</h1>
              <p>Type in how you want to get involved, and an organizer will get in touch with you :)</p>
              <Col
                xs={{ span: 24 }}
                md={{ span: 12 }}>
                <Form.Item label='Your message'>
                  {getFieldDecorator('comment', {
                    rules: [
                      { required: true, message: 'Comment is required' }
                    ]
                  })(
                    <TextArea placeholder='How do you want to help out? Got any questions?'></TextArea>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Button type='primary' shape='round' onClick={this.handleChangeStateButtonClicked.bind(this)}>
                {buttonText}
              </Button>
              &nbsp;
              {this.state.isFormVisible ?
                <Button type='secondary' shape='round' onClick={() => this.setState({ isFormVisible: false })}>
                  Cancel
                </Button>
                : null}
            </Row>
          </Form>
        </div>
      )
    }

    // Otherwise, show the "I'm interested" button (if we're creating a new interest and haven't clicked it yet).
    else {
      return (
        <div>
          <Button type='primary' shape='round' onClick={() => this.setState({ isFormVisible: true })}>
            <FormattedMessage id='claimOp' defaultMessage="I'm Interested" description='Button to show interest in an opportunity on OpDetails page' />
          </Button>
        </div>
      )
    }

    return (
      <dl>
        <dt>_id</dt><dd>{props.interest._id}</dd>
        <dt>Person</dt><dd>{props.interest.person}</dd>
        <dt>Opportunity</dt><dd>{props.interest.opportunity}</dd>
        <dt>Comment</dt><dd>{props.interest.comment}</dd>
        <dt>Status</dt><dd>{props.interest.status}</dd>
      </dl>
    )
  }

}

RegisterInterestItem.propTypes = {
  interest: PropTypes.shape({
    person: PropTypes.string.isRequired,
    opportunity: PropTypes.string.isRequired,
    comment: PropTypes.string,
    status: PropTypes.string
  }).isRequired,
  form: PropTypes.object,
  onChangeState: PropTypes.func.isRequired
}

export default Form.create({
  name: 'register_interest_form',
  onFieldsChange(props, changedFields) {
    // console.log('onFieldsChange', changedFields)
    // props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      comment: Form.createFormField({ ...props.interest.comment, value: props.interest.comment })
    }
  }
  // onValuesChange (_, values) {
  //   console.log('onValuesChange', values)
  // }
})(RegisterInterestItem)
