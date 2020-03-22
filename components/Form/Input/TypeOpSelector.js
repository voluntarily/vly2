import { Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const { Option } = Select

function TypeOpSelector ({ opTypes, onChange, value, width }) {
  const children = opTypes.map(type => <Option key={type}>{type}</Option>)
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

TypeOpSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  opTypes: PropTypes.array.isRequired,
  width: PropTypes.string
}

export default TypeOpSelector
