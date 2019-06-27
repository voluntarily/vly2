import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

const { Option } = Select

class OpDetailLocation extends React.Component {
  handleChange = selectedOption => {
    this.props.onChange(selectedOption)
  };

  render () {
    const { existingLocations } = this.props
    const children = existingLocations.map(location => <Option key={location}>{location}</Option>)

    return (
      <Select
        showSearch
        placeholder='Select the most applicable region'
        onChange={this.handleChange}
      >
        {children}
      </Select>
    )
  }
}

OpDetailLocation.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  existingLocations: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default OpDetailLocation
