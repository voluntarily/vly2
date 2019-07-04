import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

const { Option } = Select

class OpLocationSelector extends React.Component {
  render () {
    const { existingLocations, onChange, value } = this.props
    const children = existingLocations.map(location => <Option key={location}>{location}</Option>)
    return (
      <Select
        showSearch
        placeholder='Select the most applicable region'
        onChange={onChange}
        value={value}
      >
        {children}
      </Select>
    )
  }
}

OpLocationSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  existingLocations: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default OpLocationSelector
