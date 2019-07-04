import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

const { Option } = Select

class OpLocationSelector extends React.Component {
  render () {
    const { existingLocations, onChange, value, width } = this.props
    const children = existingLocations.map(location => <Option key={location}>{location}</Option>)
    return (
      <Select
        showSearch
        placeholder='Select the most applicable location'
        onChange={onChange}
        value={value}
        style={width && { width: width }}
      >
        {children}
      </Select>
    )
  }
}

OpLocationSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  existingLocations: PropTypes.arrayOf(PropTypes.string).isRequired,
  width: PropTypes.string
}

export default OpLocationSelector
