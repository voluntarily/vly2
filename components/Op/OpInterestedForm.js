/* eslint-disable no-console */
import React, { Component } from 'react'
import { Button, Col, Divider, Form, Input, Radio, Row } from 'antd'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import TextArea from 'antd/lib/input/TextArea';

export default class OpInterestedForm extends Component {

    componentDidMount() {
        
    }

    handleSubmit = (e) => {
        e.preventDefault()
        
    }

    render() {
        return (
            <div>
                <h1>How do you want to get involved?</h1>
                <p>Type in how you want to get involved, and an organizer will get in touch with you :)</p>
                <Form>
                    <Row>
                        <Col
                            xs={{ span: 24 }}
                            md={{ span: 12 }}>
                            <Form.Item label='Your message'>
                                <TextArea placeholder='How do you want to help out? Got any questions?'></TextArea>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Button type='primary' shape='round'>Get involved</Button>
                        &nbsp;
                        <Button type='secondary' shape='round' onClick={this.props.onCancel}>Cancel</Button>
                    </Row>
                </Form>
            </div>
        )
    }

}

OpInterestedForm.propTypes = {
    interest: PropTypes.shape({
        volunteerId: PropTypes.string,
        opId: PropTypes.string,
        message: PropTypes.string
    }),
    form: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
}

