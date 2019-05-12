/* eslint-disable no-console */
import React, { Component } from 'react'
import { Button, Col, Form, Row, Popconfirm } from 'antd'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import TextArea from 'antd/lib/input/TextArea';
import Link from 'next/link'

class OpDetailPageButtons extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formVisible: false
        }
    }

    componentDidMount() {

    }

    handleSubmit = (e) => {
        e.preventDefault()

        this.props.form.validateFields((err, values) => {
            if (!err) {

                console.log(`User message: ${values.message}`);

            }
        })

    }

    render() {

        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched
        } = this.props.form

        return (
            <div>
                <Form>
                    {this.state.formVisible ?
                        <Row>
                            <h1>How do you want to get involved?</h1>
                            <p>Type in how you want to get involved, and an organizer will get in touch with you :)</p>
                            <Col
                                xs={{ span: 24 }}
                                md={{ span: 12 }}>
                                <Form.Item label='Your message'>
                                    {getFieldDecorator('message', {
                                        rules: [
                                            { required: true, message: 'Message is required' }
                                        ]
                                    })(
                                        <TextArea placeholder='How do you want to help out? Got any questions?'></TextArea>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row> : null}
                    <Row>
                        {this.state.formVisible ?
                            <span>
                                <Button type='primary' shape='round' onClick={this.handleSubmit.bind(this)}>
                                    Get involved!
                                </Button>
                                &nbsp;
                                <Button type='secondary' shape='round' onClick={() => this.setState({ formVisible: false })}>
                                    Cancel
                                </Button>
                                &nbsp;
                            </span> :
                            <span>
                                <Button type='primary' shape='round' onClick={() => this.setState({ formVisible: true })}>
                                    <FormattedMessage id='claimOp' defaultMessage="I'm Interested" description='Button to show interest in an opportunity on OpDetails page' />
                                </Button>
                                &nbsp;
                        </span>}
                        <span>
                            <Link href={`/ops/${this.props.op._id}/edit`} >
                                <Button type='secondary' shape='round' >
                                    <FormattedMessage id='editOp' defaultMessage='Edit' description='Button to edit an opportunity on OpDetails page' />
                                </Button>
                            </Link>
                            &nbsp;
                        </span>
                        <span>
                            <Popconfirm title='Confirm removal of this opportunity.' onConfirm={this.handleDeleteOp} onCancel={this.cancel} okText='Yes' cancelText='No'>
                                <Button type='danger' shape='round' >
                                    <FormattedMessage id='deleteOp' defaultMessage='Remove Request' description='Button to remove an opportunity on OpDetails page' />
                                </Button>
                            </Popconfirm>
                        </span>
                    </Row>
                    <Row>
                        <small>visible buttons here depend on user role</small>
                    </Row>
                </Form>
            </div>
        )
    }

}

OpDetailPageButtons.propTypes = {
    op: PropTypes.shape({
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
        imgUrl: PropTypes.any,
        duration: PropTypes.string,
        location: PropTypes.string,
        _id: PropTypes.string.isRequired
    }),
    onRegisterInterestClicked: PropTypes.func.isRequired,
    onDeleteOpCancelled: PropTypes.func,
    onDeleteOpClicked: PropTypes.func,
    form: PropTypes.object
}

export default Form.create({
    name: 'register_interest_form',
    onFieldsChange(props, changedFields) {
        // console.log('onFieldsChange', changedFields)
        // props.onChange(changedFields);
    },
    // mapPropsToFields (props) {
    //   return {
    //     // title: Form.createFormField({ ...props.op.title, value: props.op.title }),
    //     // subtitle: Form.createFormField({ ...props.op.subtitle, value: props.op.subtitle }),
    //     // description: Form.createFormField({ ...props.op.description, value: props.op.description }),
    //     // duration: Form.createFormField({ ...props.op.duration, value: props.op.duration }),
    //     // location: Form.createFormField({ ...props.op.location, value: props.op.location }),
    //     // imgUrl: Form.createFormField({ ...props.op.imgUrl, value: props.op.imgUrl }),
    //     // status: Form.createFormField({ ...props.op.status, value: props.op.status })
    //   }
    // }
    // onValuesChange (_, values) {
    //   console.log('onValuesChange', values)
    // }
})(OpDetailPageButtons)