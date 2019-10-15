/*
  Smart component. for the given opportunity gets a list of Interests
  and displays them in a table. actions change the state of the interested volunteers
*/
// import PropTypes from 'prop-types'
import React, { Component } from 'react'
import InterestArchivedTable from './InterestArchivedTable'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import reduxApi, { withInterestsArchived } from '../../lib/redux/reduxApi'
import Loading from '../Loading'

class InterestArchivedSection extends Component {
  async componentDidMount () {
    // Get all interests
    const opid = this.props.opid
    try {
      await this.props.dispatch(reduxApi.actions.interestsArchived.get({ id: '', op: opid }))
    } catch (err) {
      console.error('error in getting interests', err)
    }
  }

  async markAsPresent (interest) {
    interest.status = 'attended'
    await this.props.dispatch(reduxApi.actions.interestsArchived.put({ id: interest._id }, { body: JSON.stringify(interest) }))
  }

  async markAsAbsent (interest) {
    interest.status = 'not attended'
    await this.props.dispatch(reduxApi.actions.interestsArchived.put({ id: interest._id }, { body: JSON.stringify(interest) }))
  }

  render () {
    if (!(this.props.interestsArchived && this.props.interestsArchived.data)) {
      return (
        <section>
          <Loading>
            <p>Loading interested volunteers...</p>
          </Loading>
        </section>
      )
    } else {
      return (
        <section>
          <h2>
            <FormattedMessage
              id='interestArchiveSection.name'
              defaultMessage='Volunteers'
              description='label for interest table on op detail page'
            /></h2>
          <InterestArchivedTable
            interests={this.props.interestsArchived.data}
            onPresent={this.markAsPresent.bind(this)}
            onAbsent={this.markAsAbsent.bind(this)} />
        </section>
      )
    }
  }
}
InterestArchivedSection.propTypes = {
    opid: PropTypes.string.isRequired
}

export const InterestArchivedSectionTest = InterestArchivedSection
export default withInterestsArchived(InterestArchivedSection)
