import React from 'react'
import PropTypes from 'prop-types'
import { TextHeadingSubtitle, TextP } from '../VTheme/VTheme'
import OpList from './OpList'

class OpRecommendations extends React.Component {
  render () {
    const location = this.props.me.location // TODO: verify this works when "me" has location added
    // TODO: get location relationships from API and include territories within regions
    // const filteredOps = this.props.ops.filter(o => o.location === location)
    const filteredOps = this.props.ops.filter(o => o.location === 'Auckland')
    return (
      <div>
        <TextHeadingSubtitle>Based on your location...</TextHeadingSubtitle>
        { filteredOps.length > 0 ? <OpList ops={filteredOps} /> : <TextP>No nearby opportunities</TextP> }
      </div>
    )
  }
}

OpRecommendations.propTypes = {
  me: PropTypes.object.isRequired,
  attributes: PropTypes.arrayOf(PropTypes.string).isRequired,
  ops: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired
}

export default OpRecommendations
