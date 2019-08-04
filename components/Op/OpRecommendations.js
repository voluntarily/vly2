import React from 'react'
import PropTypes from 'prop-types'
import { TextHeadingSubtitle } from '../VTheme/VTheme'
import OpList from './OpList'

class OpRecommendations extends React.Component {
  render () {
    // const location = this.props.me.location // TODO: verify this works when "me" has location added
    const location = this.props.me.location || 'No location'
    const regionToMatch = (location === 'No location') ? '' : this.props.locations.find(loc => {
      return loc.name === location || loc.containedTerritories.includes(location)
    })

    const filteredOps = (location === 'No location') ? [] : this.props.ops.filter(o => {
      return o.location === regionToMatch.name ||
      regionToMatch.containedTerritories.includes(o.location)
    })

    // if user has specified a territory, we should show the exact matches first, because we know
    // they are closest to the user.
    const userIsInTerritory = regionToMatch.name !== location
    if (userIsInTerritory) {
      filteredOps.sort((a, b) => {
        if (a.location === location && b.location !== location) {
          return -1
        } else if (b.location === location && a.location !== location) {
          return 1
        } else {
          return 0 // we don't care about the ordering if the location isn't matching
        }
      })
    }

    return (filteredOps.length === 0)
      ? <div /> : (
        <div>
          <TextHeadingSubtitle>Nearby opportunities</TextHeadingSubtitle>
          <OpList ops={filteredOps} />
        </div>
      )
  }
}

OpRecommendations.propTypes = {
  me: PropTypes.object.isRequired,
  // attributes: PropTypes.arrayOf(PropTypes.string).isRequired,
  ops: PropTypes.array.isRequired,
  locations: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    containedTerritories: PropTypes.arrayOf(PropTypes.string)
  })).isRequired
}

export default OpRecommendations
