/*
  Smart component. For the given op id and person id, it displays that person's interest in that op.
  If no interest exists, it will allow one to be created. If one does exist, it will allow it to be updated or cancelled.
*/
// import PropTypes from 'prop-types'
import React, { Component } from 'react'
import RegisterInterestItem from './RegisterInterestItem'

import reduxApi, { withInterests } from '../../lib/redux/reduxApi'
import Loading from '../Loading'

class RegisterInterestSection extends Component {
    state = {}
    async componentDidMount() {
        // Get all interests

        const op = this.props.op
        const me = this.props.me
        try {
            const interests = await this.props.dispatch(reduxApi.actions.interests.get({ id: '', op, me }))
            console.log('got interests', interests, 'for op', op, 'for me', me)

            // Create an empty interest here if none were returned.
            if (interests.length === 0) {
                console.log('That person hasnt registered interest in this op yet')
                interests.push({
                    person: me,
                    opportunity: op,
                    comment: '',
                    status: null,
                    dateAdded: Date.now
                })
            }

            this.setState({ interests })
        } catch (err) {
            console.log('error in getting interests', err)
        }
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
                    <RegisterInterestItem interest={this.state.interests[0]} />
                </section>
            )
        }
    }
}

export default withInterests(RegisterInterestSection)
