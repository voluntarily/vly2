/*
  Smart component. For the given op id and person id, it displays that person's interest in that op.
  If no interest exists, it will allow one to be created. If one does exist, it will allow it to be updated or cancelled.
*/
import React, { Component } from 'react'
import RegisterInterestItem from './RegisterInterestItem'
import { message } from 'antd'

import reduxApi, { withInterests } from '../../lib/redux/reduxApi'
import Loading from '../Loading'

class RegisterInterestSection extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    async componentDidMount() {
        // Get all interests
        console.log(this.props)

        const op = this.props.op
        const me = this.props.me
        try {
            let interests = await this.props.dispatch(reduxApi.actions.interests.get({ id: '', op, me }))
            console.log('got interests', interests, 'for op', op, 'for me', me)

            // Create an empty interest here if none were returned.
            if (interests.length === 0) {
                console.log('That person hasnt registered interest in this op yet')
                interests = [{
                    person: me,
                    opportunity: op,
                    comment: '',
                    status: null,
                    dateAdded: Date.now()
                }]
            }

            this.setState({ interests })
        } catch (err) {
            console.log('error in getting interests', err)
        }
    }

    async handleChangeStatus(interest) {

        let res = {}

        if (interest._id) {
            // console.log('Modifying interest')
            res = await this.props.dispatch(reduxApi.actions.interests.put({ id: interest._id }, { body: JSON.stringify(interest) }))
            message.success('Interest updated')
        }
        else {
            // console.log('Adding interest')
            res = await this.props.dispatch(reduxApi.actions.interests.post({}, { body: JSON.stringify(interest) }))
            message.success('Interest added')
        }

        interest = res[0]
        // console.log(res)

    }

    async handleWithdraw(interest) {
        // console.log('Deleting interest')
        await this.props.dispatch(reduxApi.actions.interests.delete({ id: interest._id }))
        message.success('Interest deleted')

    }

    render() {
        // If we haven't loaded the interests from the server yet
        if (!this.state.interests) {
            return (
                <section>
                    <Loading><p>Loading ...</p></Loading>
                </section>)
        }

        // If we have our interests
        else {
            return (
                <section>
                    <RegisterInterestItem
                        interest={this.state.interests[0]}
                        onChangeStatus={this.handleChangeStatus.bind(this)}
                        onWithdraw={this.handleWithdraw.bind(this)} />
                </section>
            )
        }
    }
}

export default withInterests(RegisterInterestSection)
