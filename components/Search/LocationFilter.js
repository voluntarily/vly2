import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import LocationSelector from '../Form/Input/LocationSelector'
import { TextPBold } from '../VTheme/VTheme'
import './locationFilterStyles.less'

class LocationFilter extends React.Component {
  render () {
    const { locations, onLocationSelected, selectedLocation } = this.props
    return (
      <div className='location-filter-container'>
        <TextPBold>
          <FormattedMessage
            id='location-filter-description'
            defaultMessage='Find opportunities in...'
            description='Text that describes what the location filter does'
          />
        </TextPBold>
        <LocationSelector
          existingLocations={locations}
          value={selectedLocation}
          onChange={onLocationSelected}
          width='33%'
        />
      </div>
    )
  }
}

LocationFilter.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.string),
  selectedLocation: PropTypes.string,
  onLocationSelected: PropTypes.func.isRequired
}

export default LocationFilter
