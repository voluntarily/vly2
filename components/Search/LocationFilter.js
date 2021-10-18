import React from 'react'
import { FormattedMessage } from 'react-intl'
import LocationSelector from '../Form/Input/LocationSelector'
import { PBold } from '../VTheme/VTheme'
import styled from 'styled-components'

const LocationFilterContainer = styled.div`
  display: flex;
  flex-direction: column;

  > * {
      padding: 10px;
  }
`

class LocationFilter extends React.Component {
  render () {
    const { locations, onChange, value } = this.props
    return (
      <LocationFilterContainer>
        <PBold>
          <FormattedMessage
            id='location-filter-description'
            defaultMessage='Find opportunities in...'
            description='Text that describes what the location filter does'
          />
        </PBold>
        <LocationSelector
          existingLocations={locations}
          value={value}
          onChange={onChange}
          width='100%'
        />
      </LocationFilterContainer>
    )
  }
}

export default LocationFilter
