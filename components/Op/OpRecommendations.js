import React from 'react'
import PropTypes from 'prop-types'
import { TextHeadingSubtitle, TextP } from '../VTheme/VTheme'
import OpList from './OpList'

class OpRecommendations extends React.Component {
  render () {
    // const location = this.props.me.location // TODO: verify this works when "me" has location added
    const location = 'Rotorua District'
    const regionToMatch = this.props.locations.find(loc => {
      return loc.name === location || loc.containedTerritories.includes(location)
    })

    const filteredOps = this.props.ops.filter(o => {
      return o.location === regionToMatch.name ||
      regionToMatch.containedTerritories.includes(o.location)
    })
    return (
      <div>
        <TextHeadingSubtitle>Nearby opportunities</TextHeadingSubtitle>
        { filteredOps.length > 0 ? <OpList ops={filteredOps} /> : <TextP>No nearby opportunities</TextP> }
      </div>
    )
  }
}

OpRecommendations.propTypes = {
  me: PropTypes.object.isRequired,
  attributes: PropTypes.arrayOf(PropTypes.string).isRequired,
  ops: PropTypes.array.isRequired,
  locations: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    containedTerritories: PropTypes.arrayOf(PropTypes.string)
  })).isRequired
}

export default OpRecommendations
