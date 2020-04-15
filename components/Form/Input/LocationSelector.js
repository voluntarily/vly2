import { Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const { Option } = Select

class LocationSelector extends React.Component {
  render () {
    const { existingLocations, onChange, value, width } = this.props
    const children = existingLocations.map(location => <Option key={location}>{location}</Option>)
    return (
      <Select
        showSearch
        placeholder='Select the most applicable location'
        onChange={onChange}
        value={value}
        mode='tags'
        tokenSeparators={[',']}
        style={width && { width: width }}
      >
        {children}
      </Select>
    )
  }
}

LocationSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  existingLocations: PropTypes.arrayOf(PropTypes.string).isRequired,
  width: PropTypes.string
}

export default LocationSelector
