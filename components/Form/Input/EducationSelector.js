import { Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const { Option } = Select

class EducationSelector extends React.Component {
  render () {
    const { existingEducation, onChange, value, width } = this.props
    const children = existingEducation.map(education => <Option key={education}>{education}</Option>)
    return (
      <Select
        showSearch
        placeholder='Select your education'
        onChange={onChange}
        value={value}
        style={width && { width: width }}
      >
        {children}
      </Select>
    )
  }
}

EducationSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  existingLocations: PropTypes.arrayOf(PropTypes.string).isRequired,
  width: PropTypes.string
}

export default EducationSelector
