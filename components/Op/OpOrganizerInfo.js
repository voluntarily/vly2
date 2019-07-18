import { FormattedMessage } from 'react-intl'
import PersonCard from '../Person/PersonCard'
import { Component } from 'react'

export default class OpOrganizerInfo extends Component {
  render () {
    return (
      this.props.organizer &&
      <div>
        <h2>
          <FormattedMessage id='organiser' defaultMessage='Requested by' description='Title for organiser card on op details page' />
        </h2>
        <PersonCard style={{ width: '300px' }} person={this.props.organizer} />
      </div>
    )
  }
}
