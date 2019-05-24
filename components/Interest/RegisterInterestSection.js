/*
  Smart component. For the given op id and person id, it displays that person's interest in that op.
  If no interest exists, it will allow one to be created. If one does exist, it will allow it to be updated or cancelled.
*/
import React, { Component } from 'react'
import RegisterInterestItem from './RegisterInterestItem'
import { message } from 'antd'

import reduxApi, { withInterests } from '../../lib/redux/reduxApi'
import Loading from '../Loading'

// Helper function to generate a blank interest.
function getNewInterest(me, op) {
    return {
        person: me,
        opportunity: op,
        comment: '',
        status: null,
        dateAdded: Date.now()
    }
}

class RegisterInterestSection extends Component {

    // When component mounts, make initial API call.
    // TODO do we need to change this to getInitialProps?
    async componentDidMount() {

        const op = this.props.op
        const me = this.props.me
        try {
            await this.props.dispatch(reduxApi.actions.interests.get({ id: '', op, me }))

        } catch (err) {
            console.log('error in getting interests', err)
        }
    }

    // When the button is clicked to advance the interest status, make an appropriate api call.
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

        // interest = res[0]

    }

    // When the button is clicked to withdraw interest, make an appropriate api call.
    async handleWithdraw(interest) {
        // console.log('Deleting interest')
        await this.props.dispatch(reduxApi.actions.interests.delete({ id: interest._id }))
        message.success('Interest deleted')

    }

    // Render the component depending on whether we've completed the initial api call, and what information is contained in the store.
    render() {

        // If we haven't finished making the API request to the server yet...
        if (!this.props.interests) {
            return (
                <section>
                    <Loading><p>Loading ...</p></Loading>
                </section>)
        }

        // If we have access to the interests section of the Redux store...
        else {

            // Get the interest out of the store, if any.
            let interest = null
            if (this.props.interests && this.props.interests.data && this.props.interests.data.length > 0) {

                interest = this.props.interests.data[0]
            }

            // If not, use a blank interest.
            else {

                interest = getNewInterest(this.props.me, this.props.op)
            }

            return (
                <section>
                    <RegisterInterestItem
                        interest={interest}
                        onChangeStatus={this.handleChangeStatus.bind(this)}
                        onWithdraw={this.handleWithdraw.bind(this)} />
                </section>
            )
        }
    }
}

export default withInterests(RegisterInterestSection)
